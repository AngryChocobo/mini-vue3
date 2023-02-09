export * from "./shapeFlags";

export const def = (obj: object, key: string | symbol, value: any) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value,
  });
};

export function isObject(params) {
  return typeof params === "object" && params !== null;
}
export const extend = Object.assign;

export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue);

export const hasOwn = (val, key) => Object.hasOwnProperty.call(val, key);

export const camelize = (str: string) =>
  str.replace(/-(\w)/, (_, target: string) => {
    return capitalize(target);
  });

export const capitalize = (str: string) =>
  str.charAt(0) ? str.charAt(0).toUpperCase() + str.slice(1) : "";

export function toHandlerKey(str: string) {
  return "on" + camelize(capitalize(str));
}

const onRE = /^on[^a-z]/;
export const isOn = (key: string) => onRE.test(key);
