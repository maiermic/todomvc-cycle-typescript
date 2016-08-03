export type TaskAction
  = CancelEditAction
  | DestroyAction
  | DoneEditAction
  | StartEditAction
  | ToggleAction

export interface CancelEditAction {
  type: 'cancelEdit'
}

export interface DestroyAction {
  type: 'destroy'
}

export interface DoneEditAction {
  type: 'doneEdit',
  title: string
}

export interface StartEditAction {
  type: 'startEdit'
}

export interface ToggleAction {
  type: 'toggle'
}

export function isCancelEditAction(action: TaskAction): action is CancelEditAction {
  return action.type === 'cancelEdit';
}

export function isDestroyAction(action: TaskAction): action is DestroyAction {
  return action.type === 'destroy';
}

export function isDoneEditAction(action: TaskAction): action is DoneEditAction {
  return action.type === 'doneEdit';
}

export function isStartEditAction(action: TaskAction): action is StartEditAction {
  return action.type === 'startEdit';
}

export function isToggleAction(action: TaskAction): action is ToggleAction {
  return action.type === 'toggle';
}
