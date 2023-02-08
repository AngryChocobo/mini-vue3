import { h } from "../../packages/vue/dist/mini-vue.esm.js";
const Dog = {
  render() {
    return h("div", { id: "title", class: "red" }, [
      h(
        "span",
        {
          id: "icon",
          class: ["iconfont"],
          onClick() {
            console.log("旺旺");
          },
        },
        "🐕"
      ),
      h(
        "span",
        { id: "content", class: ["red", "center"] },
        "name" + this.dogName
      ),
    ]);
  },
  setup(props, { emit }) {
    if (props) {
      console.log(props.dogName);
      props.dogName = "小猫猫";
    }
    console.log(emit);
    emit("load", "Dog loaded");
    emit("load-data", "Dog loaded2");
    return {};
  },
};

export default Dog;
