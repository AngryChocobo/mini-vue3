import { h, createTextVNode, ref } from "../../lib/mini-vue.esm.js";
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
      count++;
    }
    return {
      count,
      onClick,
    };
  },
};
