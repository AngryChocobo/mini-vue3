import { toHandlerKey } from "../shared";
import { ComponentInternalInstance } from "./component";

export function emit(
  instance: ComponentInternalInstance,
  eventName: string,
  ...args: any
) {
  //  const  toHandlerKey =
  const handlerName = toHandlerKey(eventName);
  const handler = instance.props[handlerName];
  if (handler) {
    handler(args);
  }
}
