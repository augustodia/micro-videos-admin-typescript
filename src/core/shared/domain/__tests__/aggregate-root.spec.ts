import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { IDomainEvent } from '@core/shared/domain/events/domain-event.interface';
import { ValueObject } from '@core/shared/domain/value-object';

class StubEvent implements IDomainEvent {
  aggregate_id: Uuid;
  name: string;
  event_version: number = 1;
  occurred_on: Date;

  constructor(aggregate_id: Uuid, name: string) {
    this.aggregate_id = aggregate_id;
    this.occurred_on = new Date();
    this.name = name;
  }
}

class StubAggregateRoot extends AggregateRoot {
  aggregate_id: Uuid;
  name: string;
  properties: any;

  constructor(props: { name: string; id: Uuid }) {
    super();
    this.aggregate_id = props.id;
    this.name = props.name;
    this.registerHandler(StubEvent.name, this.onStubEvent.bind(this));
  }

  operation() {
    this.name = this.name.toUpperCase();
    this.applyEvent(new StubEvent(this.aggregate_id, this.name));
  }

  onStubEvent(event: StubEvent) {
    this.properties = { name: event.name }; // Mudança qualquer no agregado
  }

  get entity_id(): ValueObject {
    return this.aggregate_id;
  }

  toJSON(): any {}
}

describe('Aggregate Root Unit Tests', () => {
  test('dispatches events', () => {
    const id = new Uuid();
    const aggregate = new StubAggregateRoot({ name: 'test name', id });
    aggregate.operation();

    expect(aggregate.properties).toEqual({ name: 'TEST NAME' });
  });
});
