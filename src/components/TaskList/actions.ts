import {DestroyAction, TaskAction, DoneEditAction, ToggleAction} from "../Task/actions";
export type TaskListAction
  = ChangeRouteAction
  | UrlAction
  | ClearInputAction
  | InsertTodoAction
  | ToggleTodoAction
  | DeleteTodoAction
  | EditTodoAction
  | ToggleAllAction
  | DeleteCompletedsAction

export interface ChangeRouteAction {
  type: 'changeRoute'
  route: string
  payload: string
}

export interface UrlAction {
  type: 'url'
  payload: string
}

export interface ClearInputAction {
  type: 'clearInput'
}

export interface InsertTodoAction {
  type: 'insertTodo'
  payload: string
}

export interface ToggleTodoAction {
  type: 'toggleTodo'
  id: number
}

export interface DeleteTodoAction {
  type: 'deleteTodo'
  id: number
}

export interface EditTodoAction {
  type: 'editTodo'
  id: number
  title: string
}

export interface ToggleAllAction {
  type: 'toggleAll'
}

export interface DeleteCompletedsAction {
  type: 'deleteCompleteds'
}

export function isChangeRouteAction(action: TaskListAction): action is ChangeRouteAction {
  return action.type === 'changeRoute';
}

export function isUrlAction(action: TaskListAction): action is UrlAction {
  return action.type === 'url';
}

export function isClearInputAction(action: TaskListAction): action is ClearInputAction {
  return action.type === 'clearInput';
}

export function isInsertTodoAction(action: TaskListAction): action is InsertTodoAction {
  return action.type === 'insertTodo';
}

export function isToggleTodoAction(action: TaskListAction): action is ToggleTodoAction {
  return action.type === 'toggleTodo';
}

export function isDeleteTodoAction(action: TaskListAction): action is DeleteTodoAction {
  return action.type === 'deleteTodo';
}

export function isEditTodoAction(action: TaskListAction): action is EditTodoAction {
  return action.type === 'editTodo';
}

export function isToggleAllAction(action: TaskListAction): action is ToggleAllAction {
  return action.type === 'toggleAll';
}

export function isDeleteCompletedsAction(action: TaskListAction): action is DeleteCompletedsAction {
  return action.type === 'deleteCompleteds';
}

export function toTaskListAction(action: DestroyAction): DeleteTodoAction
export function toTaskListAction(action: DoneEditAction): EditTodoAction
export function toTaskListAction(action: ToggleAction): ToggleTodoAction
export function toTaskListAction(action: TaskAction): TaskListAction {
  const type: string = ({
    destroy: 'deleteTodo',
    doneEdit: 'editTodo',
    toggle: 'toggleTodo',
  } as any)[action.type];
  return <any> Object.assign({}, action, {type})
}