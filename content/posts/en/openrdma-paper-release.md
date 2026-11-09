---
title: "OpenRDMA Paper Release: An 8-Byte Doorbell for GPU-Native RDMA"
slug: "openrdma-paper-release"
publishedAt: "2026-11-09"
summary: "An 8-byte doorbell, 400 Gb/s multipath transport, and hardware–software cooperative recovery: announcing the OpenRDMA paper."
type: "project"
category: "engineering"
tags:
  - RDMA
  - FPGA
  - AI Networking
  - OpenRDMA
featured: true
draft: false
---

> **An 8-byte doorbell to start a transfer, 400G multipath transport, and hardware and software working together on retransmission.** We’ve released the OpenRDMA paper, which explores how to divide communication work among the GPU, CPU, and NIC in AI clusters.

- **Paper:** [OpenRDMA: A GPU-Native Multi-Path Reliable RDMA Transport Architecture](https://arxiv.org/html/2611.07559)
- **Open-source project:** [GitHub · open-rdma/open-rdma](https://github.com/open-rdma/open-rdma)
- **Authors:** Ziheng Ji\*, Chunyu Liu\*, Weihao Peng, Mingheng Mi, Pu Wang, Hai Zhang (\*co-first authors)

---

## How can the network keep up with faster GPUs?

Training and running large models is changing how AI clusters communicate. Gradient synchronization, model parallelism, and frequent exchanges between GPUs all require the network to move data quickly between compute tasks. **GPUs need fast transfers, a low-overhead way to start them, and a reliable signal that the data is safe to use.**

RDMA (remote direct memory access) provides a foundation for high-performance data transfers. Moving data directly into GPU memory and letting the GPU start a transfer with little overhead are two separate problems.

![Comparison of request submission and completion notification paths in GDR with a CPU proxy, IBGDA, and OpenRDMA](/images/posts/openrdma-paper-release/fig1-submission-paths.png)

*Figure 1. GDR with a CPU proxy, IBGDA, and OpenRDMA use different paths to submit requests and signal completion, with OpenRDMA using an 8-byte doorbell to submit work and an Ordered Flag to tell the receiving GPU the data is ready.*

- **GPUDirect RDMA (GDR)** lets the NIC access GPU memory directly, but common request submission paths still rely on a CPU proxy for control.
- **InfiniBand GPUDirect Async (IBGDA)** lets the GPU start transfers with less CPU proxy involvement. The GPU still has to build work queue entries (WQEs), manage queue state, and ring the doorbell.
- **OpenRDMA** takes a different approach. If the connection, addresses, and access permissions are already set up, can the GPU simply say which operation it wants to run and leave the full request assembly to the NIC?

That’s where OpenRDMA starts. **The GPU focuses on computation and specifies what to transfer. The FPGA NIC builds requests and handles frequent transfers, while the CPU takes care of setup and occasional recovery.**

## 01｜An 8-byte doorbell takes full WQE assembly off the GPU

For a conventional RDMA request, the WQE specifies the operation type, addresses, length, memory access keys, and other details. For many transfers that GPUs perform repeatedly, those details are already known at initialization.

OpenRDMA stores this static context in the NIC’s **Slot Table** ahead of time. At runtime, the GPU reserves the necessary credits and selects a preauthorized operation with a single **8-byte doorbell write**. The NIC then looks up the slot, checks permissions and payload length, and reconstructs the request internally.

In one sentence:

**In the conventional approach, the GPU tells the NIC how to carry out the operation, while with OpenRDMA it only needs to say which operation to run.**

A credit/grant mechanism applies backpressure so that lightweight submissions stay within the NIC’s queue capacity. The design simplifies the high-frequency submission path. The CPU still handles memory registration, QP creation, slot configuration, and recovery that requires retransmission.

![OpenRDMA layered architecture with GPU submission, FPGA NIC datapaths, and CPU recovery](/images/posts/openrdma-paper-release/fig2-architecture.png)

*Figure 2. In OpenRDMA’s layered architecture, the GPU submits requests, the FPGA NIC sends and receives data across four 100 Gb/s channels, and CPU software coordinates retransmission.*

## 02｜Reliable transport over multiple paths with one connection

Modern AI clusters often have several network links, but conventional RDMA typically uses ECMP to pin a queue pair (QP) to a single path. If that path gets congested, the connection has little opportunity to use spare bandwidth elsewhere. Conventional RoCE RC also typically expects packets to arrive in order. Packet loss or reordering can trigger **Go-Back-N**, which resends multiple packets starting at the gap and adds redundant traffic. Congestion control typically eases congestion by **using ECN/DCQCN to slow the sender down**.

OpenRDMA draws on **MRC (Multipath Reliable Connection)** to design a reliable multipath transport based on packet spraying:

1. **Per-packet multipath scheduling:** Packets from the same QP can travel over several paths in parallel, using the network’s combined bandwidth without requiring the application to maintain multiple connections.
2. **Lightweight path selection:** With SRv6 paths mapped to entropy values (EVs), the NIC uses the EV Table to quickly choose a path and output channel for each packet, keeping scheduling overhead low.
3. **Selective retransmission:** The receiver tracks out-of-order arrivals in a bitmap. With ACK/SACK/NAK feedback and its scoreboard, the sender **retransmits only the packets that were actually lost**, avoiding the extra traffic that Go-Back-N can generate.
4. **Congestion awareness and dynamic path switching:** When ECN feedback indicates congestion on a path, the sender removes its EV from the active set and selects another path from the backup EV set. **Where conventional congestion control relies on slowing the sender, OpenRDMA tries to route around congestion first**, preserving as much aggregate throughput as possible when other paths still have capacity.

**OpenRDMA resends missing packets when there’s a loss and switches paths first when there’s congestion.** Per-packet scheduling, selective retransmission, and dynamic EV management let it deliver data reliably despite out-of-order arrivals, cut unnecessary retransmissions, and limit the effect of one congested path on aggregate throughput.

## 03｜When a packet arrives, the GPU may still have to wait

Reliable transport has a boundary that’s easy to miss. A packet can arrive before DMA finishes writing it into GPU memory, and the GPU may have to wait longer before it can read the data safely.

OpenRDMA uses **Relaxed Write + Ordered Flag** to separate data movement from completion notification:

- **Relaxed Write** lets packets travel out of order across multiple paths and places their data directly at the destination address.
- **Ordered Flag** is a separate completion notification operation. The receiving NIC writes the 4-byte flag to GPU-visible memory only after the relevant earlier writes on the same QP satisfy the ordering and placement requirements.
- **The GPU polls the flag** to check that it can safely use the data, bypassing CPU proxy polling of CQEs and the need to relay the notification.

The ordering guarantee is scoped to **the same QP**. Global ordering across QPs would require a separate guarantee.

From submission to completion, OpenRDMA aims to keep the interface simple: **Doorbell in, Flag out.**

## 04｜Hardware handles the fast path, software handles complex recovery

Compared with routine transfers, retransmission is rare. Putting every retransmission decision, timeout queue, timer, and recovery policy on the FPGA would drive up logic use and the cost of managing state. Putting the CPU on the path of every normal packet would add overhead to frequent transfers.

OpenRDMA therefore splits **recovery between hardware and software**:

- **The FPGA/NIC** keeps the datapaths needed for normal transmission, receive state, ACK/SACK processing, and retransmission execution.
- **CPU software** analyzes status reports on the recovery path, decides which packets to resend, and manages timeouts and retry policies.
- **Normal transmission and recovery run separately**, so routine communication can proceed while software handles complex recovery.

The CPU’s role is to make **occasional recovery decisions**, while **routine, high-frequency data transfer** stays in hardware. This division keeps the design within the FPGA’s resource constraints.

## Experimental results｜High throughput, multipath transport, and reliable recovery

We used **Verilator RTL and ns-3 co-simulation** to evaluate OpenRDMA’s throughput, multipath transport, and reliability mechanisms.

### ① Aggregate throughput reaches 380.9 Gb/s across four links

Across four 100 Gb/s links, OpenRDMA reached **380.9 Gb/s** of payload goodput, or **95.2%** of the theoretical aggregate bandwidth. It reached **326.0 Gb/s** even with 1 KiB messages. With the simulated DMA completion order reversed, it still reached **359.9 Gb/s**, showing that the parallel datapath can sustain high throughput in both cases.

![Payload goodput across four modeled links and comparisons for message size and DMA completion order](/images/posts/openrdma-paper-release/fig3-throughput.png)

*Figure 3. The left panel shows how payload goodput across four modeled links varies with batch size, while the right panel compares goodput for different message sizes and DMA completion orders.*

### ② Multipath gives one QP 3.51× the throughput

A conventional fixed-path policy typically pins the traffic from each QP to one link. OpenRDMA uses **packet spraying (per-packet traffic splitting)** to spread packets from the same QP across available paths, so the application relies less on adding QPs. In a comparison with one QP and 16 KiB messages, packet spraying raised payload goodput **from 92.2 Gb/s to 323.5 Gb/s**, a **3.51×** gain. Mean network completion time fell **from 1.534 μs to 0.642 μs**, a **58.2%** reduction.

The result shows where multipath helps. **Even when the application has only a few active QPs, the NIC can make use of the bandwidth of several physical links in parallel.**

The gains vary with message size and QP count. Fixed mapping can be faster in some configurations because uneven packet sizes and scheduling overhead can eat into the gains from multipath.

### ③ Selective retransmission cuts recovery overhead

In controlled single-packet loss tests, OpenRDMA’s local drop-to-CQE recovery time was **508–598 ns**, with about **34 ns** spent on the CPU decision and retry submission.

![Drop-to-CQE latency by lost-packet position and retry-to-CQE latency across three message sizes](/images/posts/openrdma-paper-release/fig4-recovery-latency.png)

*Figure 4. The left panel breaks down drop-to-CQE latency by the position of the lost packet, and the right panel shows that the time from retry submission to CQE stays at 162 ns across all three tested message sizes.*

Selective retransmission also cuts unnecessary traffic. In the test configuration, losing one, two, or three packets added only **298 B, 596 B, or 894 B**, respectively, to the traffic on the wire. The sender retransmitted only the missing packets. Ordered Completion also preserved the correct order for consuming the data when four DMA lanes finished in reverse order.

These results come from ns-3 simulation tests. End-to-end performance on physical FPGA and GPU hardware still needs to be verified.

## A transport protocol and an open starting point for system design

OpenRDMA asks:

> **How can a GPU start RDMA transfers with less overhead, and how should the queue interface work to support that?**

Our answer is to try a different division of work. The GPU identifies the preauthorized operation, the NIC handles frequent data transfers and keeps them reliable, and the CPU takes care of initial setup and occasional recovery.

With a lightweight GPU submission interface, reliable multipath transport that handles out-of-order packets, and GPU-visible ordered completion, we hope OpenRDMA gives people working on **AI cluster networking, FPGA SmartNICs, GPU communication systems, and open RDMA research** an architecture they can discuss, test, and build on.

We welcome discussion, feedback, and contributions from developers and researchers interested in RDMA, FPGAs, network protocols, GPU communication, and distributed AI systems.

- **Full paper:** [arxiv.org/html/2611.07559](https://arxiv.org/html/2611.07559)
- **Project repository:** [github.com/open-rdma/open-rdma](https://github.com/open-rdma/open-rdma)

If you share our belief in “open networks, an open future,” give OpenRDMA a **star** on GitHub and join us in exploring the next generation of open, high-performance networking.
