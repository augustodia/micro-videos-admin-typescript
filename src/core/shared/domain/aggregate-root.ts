import { Entity } from './entity';
import { IDomainEvent } from '@core/shared/domain/events/domain-event.interface';
import EventEmitter from 'eventemitter2';

export abstract class AggregateRoot extends Entity {
  events: Set<IDomainEvent> = new Set<IDomainEvent>();
  localMediator: EventEmitter = new EventEmitter();

  applyEvent(event: IDomainEvent) {
    this.events.add(event);
    this.localMediator.emit(event.constructor.name, event);
  }

  registerHandler(event: string, handler: (event: IDomainEvent) => void) {
    this.localMediator.on(event, handler);
  }
}
