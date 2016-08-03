export interface AnchorEvent extends Event {
  target: EventTarget & HTMLAnchorElement
}

export interface InputEvent extends Event {
  target: EventTarget & HTMLInputElement
}
