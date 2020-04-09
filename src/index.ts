import Observer, { IProps } from "./Observer";

const GLOBAL_KEY = "$__network_observer__";

declare namespace window {
  var $__network_observer__: Observer;
}

export default function getNetworkObserver(props?: IProps) {
  if (!window[GLOBAL_KEY]) {
    window[GLOBAL_KEY] = new Observer(props);
  }
  return window[GLOBAL_KEY];
}
