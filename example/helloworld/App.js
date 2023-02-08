import { h } from "../../packages/vue/dist/mini-vue.esm.js";
import Dog from "./Dog.js";
export const App = {
  render() {
    return h("div", { id: "title", class: "red" }, [
      h(Dog, {
        dogName: "小狗狗",
        onLoad(msg) {
          const child = document.createTextNode(msg);
          document.body.appendChild(child);
        },
        onLoadData(msg) {
          const child = document.createTextNode(msg);
          document.body.appendChild(child);
        },
      }),
      h("span", { id: "dynamic-content" }, this.msg),
    ]);
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
