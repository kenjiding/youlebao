import events from 'events';

export default class AutoResetEvent {
  // event对象
  eventEmitter;
  // 事件名称
  eventName = 'autoResetEvent';

  constructor() {
    this.eventEmitter = new events.EventEmitter();
  }

  /**
   * 重置事件
   */
  reset() {
    this.eventEmitter.removeAllListeners(this.eventName);
  }

  set() {
    this.eventEmitter.emit(this.eventName);
  }

  waitOnce(time = 0) {
    return new Promise((resolve) => {
      let eventCallback;
      const timer = setTimeout(() => {
        this.eventEmitter.removeListener(this.eventName, eventCallback);
        resolve();
      }, time);

      eventCallback = () => {
        timer && clearTimeout(timer);
        resolve();
      };

      this.eventEmitter.once(this.eventName, eventCallback);
    });
  }
}
