import {
  h,
  createTextVNode,
  ref,
} from "../../packages/vue/dist/mini-vue.esm.js";
export const App = {
  render() {
    return h("div", { id: "title" }, [
      createTextVNode(this.count),
      h("button", { onClick: this.onClick }, "+"),
    ]);
  },
  setup() {
    let count = ref(1);
    function onClick() {
      count.value++;
    }
    return {
      count,
      onClick,
    };
  },
};
