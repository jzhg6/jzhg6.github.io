---
title: "从可靠传输角度重读 RDMA 重传边界"
slug: "rdma-reading-notes"
publishedAt: "2026-09-24"
summary: "一次围绕 PSN、ACK 与发送窗口的阅读笔记：哪些状态属于传输层，哪些不该被重传机制隐式接管。"
type: "note"
category: "reading"
tags:
  - RDMA
  - Protocol
  - Reliability
featured: false
draft: false
---

## 重传不是“再发一次”

阅读 RDMA 可靠传输设计时，我最容易忽略的是：重传动作很短，支撑它的状态生命周期却很长。发送端需要知道一个 packet 是否进入 wire、是否得到确认、payload 是否仍可读取，以及一次 retry 是否仍满足原始顺序约束。

因此，讨论重传之前，最好先明确三个边界：

1. **确认边界**：ACK 或 SACK 究竟确认 packet、message，还是某个更高层操作。
2. **存储边界**：payload 在什么事件之后可以安全回收。
3. **排序边界**：retry traffic 与新 traffic 共用哪些队列和仲裁规则。

## PSN 只解决了一部分问题

PSN 可以标识 packet 的传输顺序，但不能独立回答 WQE 是否完成。一个 WQE 可能跨越多个 packet；最后一个 packet 被 ACK 之前，软件可见 completion 都不应提前出现。

| 状态 | 关注对象 | 典型释放条件 |
| --- | --- | --- |
| Sent | packet | 已进入发送路径 |
| Acked | PSN range | ACK/SACK 覆盖 |
| Completed | WQE | 全部 packet 确认且顺序条件满足 |

这张表的价值不在字段名称，而在于避免用一个布尔值同时承担三个不同层次的事实。

## 下一步要验证什么

我会继续检查 timeout 与显式 NAK 同时到达时的幂等性，以及 bitmap 窗口跨回绕点时的比较规则。可靠传输的难点很少出现在 happy path，更多藏在两个合理事件恰好同时发生的瞬间。
