---
title: "OpenRDMA 论文发布｜让 GPU 只敲一次「门铃」"
slug: "openrdma-paper-release"
publishedAt: "2026-11-09"
summary: "8 字节 Doorbell、400G 多路径传输与软硬件协同恢复：OpenRDMA 论文正式发布。"
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

> **8 字节 Doorbell 发起通信、400G 多路径传输、软硬件协同重传策略。** 我们正式发布 OpenRDMA 论文，尝试重新思考 AI 集群中 GPU、CPU 与网卡之间的分工。

- **论文：** [OpenRDMA: A GPU-Native Multi-Path Reliable RDMA Transport Architecture](https://arxiv.org/html/2611.07559)
- **开源项目：** [GitHub · open-rdma/open-rdma](https://github.com/open-rdma/open-rdma)
- **作者：** Ziheng Ji\*, Chunyu Liu\*, Weihao Peng, Mingheng Mi, Pu Wang, Hai Zhang（\*共同第一作者）

---

## 当 GPU 越来越快，网络通信该如何跟上？

大模型训练和推理正在让 AI 集群的通信模式发生变化。无论是梯度同步、模型并行，还是频繁的跨 GPU 数据交换，网络都需要在计算任务之间快速搬运数据。**通信不仅要快，还要让 GPU 能以足够低的开销发起通信，并准确知道数据何时可以安全使用。**

RDMA（远程直接内存访问）为高性能数据传输提供了基础，但“数据能直接传到 GPU 显存”和“GPU 能低成本地发起一次传输”其实是两个不同的问题。

![GDR（CPU 代理）、IBGDA 与 OpenRDMA 的请求提交和完成通知路径对比](/images/posts/openrdma-paper-release/fig1-submission-paths.png)

*图 1. GDR（CPU 代理）、IBGDA 和 OpenRDMA 采用不同的请求提交与完成通知路径，其中 OpenRDMA 用 8 字节 Doorbell 提交请求，通过 Ordered Flag 通知接收端 GPU 数据已就绪。*

- **GPUDirect RDMA（GDR）** 可以让网卡直接访问 GPU 显存，但常见的请求提交方式仍依赖 CPU 代理参与控制路径。
- **InfiniBand GPUDirect Async（IBGDA）** 把发起通信的能力交给 GPU，减少 CPU 代理参与，却仍需要 GPU 处理 WQE（工作队列项）构造、队列状态和 Doorbell 等操作。
- **OpenRDMA** 提出了另一种思路：如果连接、地址、访问权限等信息已经预先配置好，GPU 是否只需表达“我要执行哪项通信”，而不必每次重新组装完整的请求？

这正是 OpenRDMA 的出发点：**让 GPU 专注计算和通信意图，让 FPGA 网卡承担请求构造与高频传输，让 CPU 负责配置与低频异常恢复。**

## 01｜8 字节 Doorbell：GPU 不再亲自组装完整 WQE

传统 RDMA 请求中，WQE 需要描述操作类型、地址、长度、内存访问密钥等信息。但在许多重复执行的 GPU 通信场景中，这些信息在初始化阶段就已确定。

OpenRDMA 将这部分静态上下文预先保存在网卡的 **Slot Table** 中。运行时，GPU 先完成必要的 Credit 预留，再通过一次 **8 字节 Doorbell 写入**选择预授权操作；网卡随后完成 Slot 查询、权限和带搬运数据的长度检查，并在内部重构请求。

用一句话概括：

**传统思路是“GPU 告诉网卡如何做”，OpenRDMA 则让 GPU 只需告诉网卡“做哪件事”。**

这套机制还配有 Credit/Grant 背压控制，防止轻量级提交接口突破网卡有限的队列资源。它简化的是高频提交路径，并不意味着完全取消 CPU：内存注册、QP 创建、Slot 配置和异常重传处理仍由 CPU 负责。

![OpenRDMA 分层架构：GPU 提交请求、FPGA 网卡收发数据、CPU 协调重传](/images/posts/openrdma-paper-release/fig2-architecture.png)

*图 2. 在 OpenRDMA 的分层架构中，GPU 提交请求，FPGA 网卡通过四条 100 Gb/s 通道收发数据，CPU 软件协调重传。*

## 02｜单条连接也能跑多条路径：面向多路径网络的可靠传输

现代 AI 集群往往拥有多条网络链路，但传统 RDMA 通常通过 ECMP 将一条 QP（Queue Pair，队列对）固定在单一路径上。当该路径发生拥塞时，即使其他路径仍有空闲带宽，也难以被当前连接利用。此外，传统 RoCE RC 通常要求数据包按序接收，发生丢包或乱序时，可能采用 **Go-Back-N** 机制，从缺失的数据包开始重传后续多个数据包，造成冗余流量；拥塞控制则通常通过 **ECN/DCQCN 降低发送速率**来缓解拥塞。

OpenRDMA 借鉴 **MRC（Multipath Reliable Connection）** 的设计思想，提出基于 Packet Spraying 的多路径可靠传输机制：

1. **逐包多路径调度：** 同一 QP 的不同数据包可通过多条路径并行传输，无需上层应用维护多条连接，充分利用网络聚合带宽。
2. **轻量级路径选择：** 基于 SRv6 与 EV（Entropy Value）映射，通过 EV Table 快速选择发送路径与输出通道，实现低开销的逐包调度。
3. **选择性重传：** 接收端使用 Bitmap 记录乱序到达的数据包，结合 ACK/SACK/NAK 和发送端 Scoreboard，**仅重传真正丢失的数据包**，避免 Go-Back-N 带来的大量冗余流量。
4. **拥塞感知与动态路径切换：** 当 ECN 反馈表明某条路径发生拥塞时，发送端将对应 EV 从活跃路径集合中移除，并从备用 EV 集合中选择其他路径。**相比传统依赖降速的拥塞控制，OpenRDMA 优先通过切换路径绕开拥塞点**，在其他路径仍有可用带宽时，尽可能维持整体吞吐。

**OpenRDMA 的核心思路是：丢包时精准重传，拥塞时优先换路。** 通过将逐包调度、选择性重传与 EV 动态路径管理结合，OpenRDMA 在支持乱序可靠传输的同时，减少不必要的重传流量，并降低单一路径拥塞对整体吞吐的影响。

## 03｜数据到了，不等于 GPU 可以用了

可靠传输还有一个经常被忽略的边界：数据包到达、DMA 写入显存以及 GPU 能够安全读取数据，并不是同一个时刻。

OpenRDMA 使用 **Relaxed Write + Ordered Flag** 来区分数据搬运与完成通知：

- **Relaxed Write** 允许数据在多路径环境中乱序传输，并直接放置到目标地址。
- **Ordered Flag** 是独立的完成通知操作。接收端网卡只有在同一 QP 中此前的相关写入满足顺序和放置条件后，才把 4 字节 Flag 写入 GPU 可见内存。
- **GPU 轮询 Flag**，确认数据具备被安全消费的条件，而不必依赖 CPU 代理轮询 CQE 再转发通知。

需要强调的是，这种顺序保证针对**同一 QP**，并不自动扩展为不同 QP 之间的全局顺序。

从提交到完成，OpenRDMA 希望提供的是一条足够简洁的路径：**Doorbell in, Flag out。**

## 04｜硬件负责快路径，软件负责复杂恢复

与正常数据传输相比，重传是一个低概率事件，把所有重传判断、超时队列、定时器和恢复策略都塞进 FPGA，会让逻辑资源与状态管理成本持续增加；但如果每次正常发包都依赖 CPU，又会损害高频通信的目标。

OpenRDMA 因此设计了**软硬件协同的恢复机制**：

- **FPGA/NIC** 保留正常发包、接收状态、ACK/SACK 处理及重传执行所需的关键数据通路。
- **CPU 软件** 在异常恢复路径中分析状态报告、决定需要重传哪些包，并管理超时与重试策略。
- **正常发送与异常恢复解耦**，让常见通信操作不必等待复杂的软件恢复流程。

这并不是把所有可靠性工作都交给 CPU，而是有意识地区分**高频的正常数据传输**和**低频的异常恢复决策**，以适应 FPGA 的资源约束。

## 实验结果｜高吞吐、多路径与可靠恢复

我们采用 **Verilator RTL 与 ns-3 联合仿真**，对 OpenRDMA 的吞吐性能、多路径传输及可靠性机制进行了验证。

### ① 四路聚合吞吐达到 380.9 Gb/s

在四条 100 Gb/s 链路下，OpenRDMA 实现 **380.9 Gb/s** 的有效吞吐，达到理论总带宽的 **95.2%**。即使采用 1 KiB 小消息，吞吐仍达到 **326.0 Gb/s**；在模拟 DMA 完成顺序反转时，仍保持 **359.9 Gb/s**，体现了高效的并行传输能力。

![四条模拟链路上的有效吞吐及不同消息大小与 DMA 完成顺序的对比](/images/posts/openrdma-paper-release/fig3-throughput.png)

*图 3. 左图展示四条模拟链路上的有效吞吐随批量大小的变化，右图对比不同消息大小和 DMA 完成顺序下的有效吞吐。*

### ② 单 QP 多路径吞吐提升 3.51 倍

传统的固定路径策略通常将一个 QP 的流量固定在一条链路上。OpenRDMA 通过 **Packet Spraying（逐包分流）**，允许同一 QP 的数据包分布到不同的可用路径，减少对上层增加 QP 数量的依赖。在单 QP、16 KiB 消息的对比测试中，Packet Spraying 将有效吞吐从 **92.2 Gb/s 提升到 323.5 Gb/s**，提升 **3.51×**；平均网络完成时间从 **1.534 μs 降至 0.642 μs**，降低 **58.2%**。

这组结果揭示了多路径技术的关键价值：**即使应用只保留少量活跃 QP，网卡仍有机会挖掘多条物理链路的并行带宽。**

当然，多路径并非在所有消息尺寸和 QP 数量下都优于固定映射，包大小不均衡和调度开销仍会影响收益。

### ③ 可靠恢复：精准重传，降低恢复开销

在受控单包丢失实验中，OpenRDMA 的局部 Drop-to-CQE 恢复时间为 **508–598 ns**，其中 CPU 决策与重传提交约需 **34 ns**。

![按丢包位置拆解的 Drop-to-CQE 延迟及三种消息大小下的重传到 CQE 延迟](/images/posts/openrdma-paper-release/fig4-recovery-latency.png)

*图 4. 左图按丢包位置拆解从丢包到 CQE 的恢复延迟，右图显示三种测试消息大小下从提交重传到 CQE 的延迟均为 162 ns。*

选择性重传进一步减少了无效流量：在测试配置下，丢失 1、2、3 个数据包分别仅增加 **298、596、894 B** 的线上流量，而无需重传整条消息。此外，Ordered Completion 机制在四路 DMA 逆序完成的情况下，仍能保证正确的消费顺序。

上述结果基于 ns-3 仿真测试，真实 FPGA 和 GPU 环境下的端到端性能仍有待进一步验证。

## 不只是一个传输协议，更是一个开放的系统设计起点

OpenRDMA 试图回答的问题是：

> **如何让 GPU 以更轻量的方式发起 RDMA 通信，并设计与之适配的高效队列交互范式？**

我们的答案是：可以尝试重新划分职责——由 GPU 表达预授权的通信意图，由 NIC 执行高频数据传输与可靠性保障，由 CPU 处理初始化配置与低频异常恢复。

从 GPU 侧的轻量提交接口，到多路径乱序可靠传输，再到 GPU 可见的有序完成，OpenRDMA 希望为 **AI 集群网络、FPGA 智能网卡、GPU 通信系统和开放 RDMA 研究**提供一套可讨论、可验证、可持续演进的架构。

我们也欢迎对 RDMA、FPGA、网络协议、GPU 通信和分布式 AI 系统感兴趣的开发者与研究者交流、反馈和参与贡献。

- **论文原文：** [arxiv.org/html/2611.07559](https://arxiv.org/html/2611.07559)
- **项目仓库：** [github.com/open-rdma/open-rdma](https://github.com/open-rdma/open-rdma)

如果你认可“开放网络，开放未来”的理念，欢迎在 GitHub 为 OpenRDMA 点亮一颗 **Star**，一起探索下一代开放的高性能网络技术。
