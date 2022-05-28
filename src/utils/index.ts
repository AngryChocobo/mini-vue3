export function isObject(params) {
  return typeof params === "object" && params !== null;
}
export const extend = Object.assign;

export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue);
