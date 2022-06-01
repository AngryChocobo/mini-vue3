import { h } from "../../lib/mini-vue.esm.js";
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
  setup(props) {
    if (props) {
      console.log(props.dogName);
      props.dogName = "小猫猫";
    }
    return {};
  },
};

export default Dog;
