import {EventsFnOptions} from '@cycle/dom/lib/DOMSource';
import {Stream, MemoryStream} from 'xstream';

export interface EventWithTarget<T> extends Event {
  target: EventTarget & T
}

type EventStream<Target, E extends Event>
  = Stream<EventWithTarget<Target> & E>

export interface DOMSource<T> {
  select(selector: 'a'): DOMSource<HTMLAnchorElement>;
  select(selector: 'input'): DOMSource<HTMLInputElement>;
  select(selector: string): DOMSource<any>;

  elements(): MemoryStream<Element>;

  events(eventType: 'keydown' | 'keyup', options?: EventsFnOptions): EventStream<T, KeyboardEvent>
  events(eventType: 'click', options?: EventsFnOptions): EventStream<T, MouseEvent>
  events(eventType: string, options?: EventsFnOptions): Stream<Event>;
}
