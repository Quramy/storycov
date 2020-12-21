type EventType = any;
type Handler = any;

interface CommonEventEmitter {
  on(event: EventType, handler: Handler): CommonEventEmitter;
  off(event: EventType, handler: Handler): CommonEventEmitter;
  /* To maintain parity with the built in NodeJS event emitter which uses removeListener
   * rather than `off`.
   * If you're implementing new code you should use `off`.
   */
  addListener(event: EventType, handler: Handler): CommonEventEmitter;
  removeListener(event: EventType, handler: Handler): CommonEventEmitter;
  emit(event: EventType, eventData?: any): boolean;
  once(event: EventType, handler: Handler): CommonEventEmitter;
  listenerCount(event: string): number;

  removeAllListeners(event?: EventType): CommonEventEmitter;
}

export const debugError = (...args: any[]) => {};

export interface PuppeteerEventListener {
  emitter: CommonEventEmitter;
  eventName: string | symbol;
  handler: (...args: any[]) => void;
}

function addEventListener(
  emitter: CommonEventEmitter,
  eventName: string | symbol,
  handler: (...args: any[]) => void,
): PuppeteerEventListener {
  emitter.on(eventName, handler);
  return { emitter, eventName, handler };
}

function removeEventListeners(
  listeners: Array<{
    emitter: CommonEventEmitter;
    eventName: string | symbol;
    handler: (...args: any[]) => void;
  }>,
): void {
  for (const listener of listeners) listener.emitter.removeListener(listener.eventName, listener.handler);
  listeners.length = 0;
}

export const helper = {
  addEventListener,
  removeEventListeners,
};
