---
title: "Revisiting RDMA Retransmission Boundaries"
slug: "rdma-reading-notes"
publishedAt: "2026-09-24"
summary: "Reading notes on PSN, ACK, and the send window: which state belongs to transport, and what retransmission should not implicitly own."
type: "note"
category: "reading"
tags:
  - RDMA
  - Protocol
  - Reliability
featured: false
draft: false
---

## Retransmission is not just “send it again”

When reading about reliable RDMA transport, it is easy to overlook the mismatch in lifetimes: the retransmission action is brief, but the state that supports it may persist for much longer. The sender needs to know whether a packet entered the wire, whether it was acknowledged, whether its payload is still available, and whether a retry still respects the original ordering constraints.

Before discussing retransmission, it helps to make three boundaries explicit:

1. **Acknowledgment boundary:** Does an ACK or SACK confirm a packet, a message, or a higher-level operation?
2. **Storage boundary:** After which event is it safe to release the payload?
3. **Ordering boundary:** Which queues and arbitration rules are shared by retry and new traffic?

## PSN answers only part of the question

A PSN can identify a packet's position in transport order, but it cannot by itself tell us whether a WQE has completed. A WQE may span several packets; software-visible completion must not be signaled before the last relevant packet has been acknowledged.

| State | Object | Typical release condition |
| --- | --- | --- |
| Sent | packet | Entered the transmit path |
| Acked | PSN range | Covered by ACK/SACK |
| Completed | WQE | All packets acknowledged and ordering conditions met |

The point of this table is not the field names. It is to avoid asking a single boolean to represent three different facts.

## What to verify next

I want to examine idempotence when a timeout and explicit NAK arrive together, and the comparison rules when a bitmap window crosses the PSN wraparound point. The hard cases in reliable transport rarely live on the happy path; they emerge when two individually reasonable events happen at the same time.
