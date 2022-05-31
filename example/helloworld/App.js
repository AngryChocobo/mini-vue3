import { h } from "../../lib/mini-vue.esm.js";
export const App = {
  render() {
    return h("div", { id: "title", class: "red" }, [
      h("span", { id: "icon", class: ["iconfont"] }, "🐕"),
      h("span", { id: "content", class: ["red", "center"] }, "修狗~"),
    ]);
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
