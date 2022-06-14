# mini-vue3

吼，又一个 mini-vue 项目我的老伙计

**[中文](README_zh.md)** | [English](README.md)

## 特性

### reactivity

- [x] effect
- [x] reactive
- [x] ref
- [x] readonly
- [x] computed
- [ ] watch
- [ ] watchEffect

### runtime-core

- [x] h
- [x] vnode
- [x] component
- [x] component props
- [x] component slots
- [x] component emits
- [x] provide & inject
- [ ] update element
- [ ] update props

### runtime-dom

- [x] createApp

### compiler

- [x] parse text interpolation
- [x] parse element
- [x] parse text
- [x] transform

## 未解之谜~

### stop

- 这个 api 是干什么用的？

> 暂时来看，它可以暂停被收集依赖对象的 trigger。实际有哪些功能是通过它实现的，需要日后研究 [TODO]()

- 为什么 ReactiveEffect 类要使用一个 active 字段来控制是否需要 stop？ 没有这个字段其实也是可以的吧？(至少我的单元测试是通过的)

  > 是用来避免多次 stop，多次 cleanupEffect 的，属于一个性能优化

- 那这个 active 字段为什么不叫 isStoped 呢，听起来似乎更合理，或许 active 有更多的其他用途？

- 一旦 stop 了以后，重新调用 runner 会将 active 置为 true 吗？换句话说，是否 stop 状态是可以恢复到 active 状态？
  > 从 vue 源码角度来看，并没有 active = true 的逻辑，至于为什么这么设计，了解相关 api 的使用目标才能理解了 [TODO]()

### extends

- ReactiveEffect 类的 options，vue 源码并没有显式地传递，而是通过封装了 Object.assign 为 ReactiveEffect 实例直接"增加"对应的值，这不是一种反模式吗？

## 我的错误理解

- ReactiveEffect，我一开始理解是 stop 和 runner 是一组成对出现的 api，可以切换 active 状态。但实际上一旦 stop 以后，active 就始终是 false 了

- 当手写 render 函数时，我始终疑惑 h 函数要如何“兼容”string 类型的输入。当学习到 Text 类型的节点时，了解了 vue 的做法：虽然用户写的是 string，但是会通过编译的手段来为 string 包裹一层 createTextVNode。收获就是，不要一开始就想让一个函数做过多的事情，兼容很多种情况，有很多场景或许有别的更优雅的实现方案。
