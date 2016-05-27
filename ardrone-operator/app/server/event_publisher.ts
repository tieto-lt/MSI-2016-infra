import events = require('events');

export class EventPublisher {

  private static eventEmitter = new events.EventEmitter()

  static onEvent(event: string, callback) {
    this.eventEmitter.on(event, callback)
  }

  static emit(event: string, data: any) {
    this.eventEmitter.emit(event, data)
  }

  static emitNoData(event: string) {
    EventPublisher.emit(event, undefined)
  }
}
