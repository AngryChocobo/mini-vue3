# mini-vue3

吼，又一个 mini-vue 项目我的老伙计

## 未解之谜~

### stop

- 这个 api 是干什么用的？

> 暂时来看，它可以暂停被收集依赖对象的 trigger。实际有哪些功能是通过它实现的，需要日后研究 [TODO]()

- 为什么 ReactiveEffect 类要使用一个 active 字段来控制是否需要 stop？ 没有这个字段其实也是可以的吧？(至少我的单元测试是通过的)

  > 是用来避免多次 stop，多次 cleanupEffect 的，属于一个性能优化

- 那这个 active 字段为什么不叫 isStoped 呢，听起来似乎更合理，或许 active 有更多的其他用途？

- 一旦 stop 了以后，重新调用 runner 会将 active 置为 true 吗？换句话说，是否 stop 状态是可以恢复到 active 状态？
  > 从 vue 源码角度来看，并没有 active = true 的逻辑，我一开始也理解为先 stop、后调用 runner，就可以重新 active。至于为什么这么设计，了解相关 api 的使用目标才能理解了 [TODO]()

### extends

- ReactiveEffect 类的 options，vue 源码并没有显式地传递，而是通过封装了 Object.assign 为 ReactiveEffect 实例直接"增加"对应的值，这不是一种反模式吗？
