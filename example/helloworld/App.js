import { h } from "../../lib/mini-vue.esm.js";
import Dog from "./Dog.js";
export const App = {
  render() {
    return h("div", { id: "title", class: "red" }, [
      h(Dog, {
        dogName: "小狗狗",
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
