import { getCurrentInstance } from "./component";

export function provide(key, value) {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    let { provides } = currentInstance;
    const parentProvides = currentInstance.parent?.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }

    provides[key] = value;
  }
}
export function inject(key) {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    return currentInstance.parent?.provides[key];
  }
}
