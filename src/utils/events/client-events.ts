import type { Maybe } from '@/types';
// @SEE: https://blog.logrocket.com/using-custom-events-react/

// @NOTE: CustomEvent is not supported in IE11

type listenerFn = ({ ...args }: Maybe['object']) => any;
type EventFn = (eventName: string, listener: EventListener) => void;

function subscribe(eventName: string, listener: listenerFn) {
  document.addEventListener(eventName, listener);
}

function unsubscribe(eventName: string, listener: listenerFn) {
  document.removeEventListener(eventName, listener);
}

function publish(eventName: string, data: Record<string, any>) {
  // @NOTE: publish data is accessible from the options.details property to subscribers
  const options = data && Object.keys(data).length ? { detail: data } : {};
  const event = new CustomEvent(eventName, options);
  document.dispatchEvent(event);
}

export { publish, subscribe, unsubscribe };
