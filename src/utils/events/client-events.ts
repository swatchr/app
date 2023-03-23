// @SEE: https://blog.logrocket.com/using-custom-events-react/

// @NOTE: CustomEvent is not supported in IE11

type CustomEventOptions = CustomEventInit & {
  detail?: Record<string, any>;
};

type ListenerFn<T extends CustomEventOptions> = (
  event: CustomEvent<T> & { target: Document }
) => void;
type SubscribeFn<T extends CustomEventOptions> = (
  eventName: string,
  listener: ListenerFn<T>
) => void;
type UnsubscribeFn<T extends CustomEventOptions> = (
  eventName: string,
  listener: ListenerFn<T>
) => void;
type PublishFn<T extends CustomEventOptions> = (
  eventName: string,
  data?: Record<string, any>
) => void;

export const subscribe: SubscribeFn<CustomEventOptions> = (
  eventName,
  listener
) => {
  document.addEventListener(eventName, listener as EventListener);
};

export const unsubscribe: UnsubscribeFn<CustomEventOptions> = (
  eventName,
  listener
) => {
  document.removeEventListener(eventName, listener as EventListener);
};

export const publish: PublishFn<CustomEventOptions> = (eventName, data) => {
  const options: CustomEventOptions = data ? { detail: data } : {};
  const event = new CustomEvent(eventName, options);
  document.dispatchEvent(event);
};
