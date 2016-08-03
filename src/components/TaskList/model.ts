import xs, {Stream} from 'xstream';
import {
  TaskListAction,
  isChangeRouteAction,
  isClearInputAction,
  isInsertTodoAction,
  isToggleTodoAction,
  isDeleteTodoAction,
  isEditTodoAction,
  isToggleAllAction,
  isDeleteCompletedsAction,
} from './actions';
import {TaskProperties} from "../Task/model";
import {VNode} from '@cycle/dom';
import {TaskAction} from "../Task/actions";

type FilterFn = (properties: TaskProperties) => boolean

export type TodosList = TodosListItem[]

export interface TodosListItem extends TaskProperties {
  id: number
  todoItem?: {
    DOM: Stream<VNode>,
    action$: Stream<TaskAction>
  }
}

export interface TodosData {
  filter: string,
  filterFn: FilterFn,
  list: TodosList
}

// A helper function that provides filter functions
// depending on the route value.
function getFilterFn(route: string): FilterFn {
  switch (route) {
    case '/active': return (task => task.completed === false);
    case '/completed': return (task => task.completed === true);
    default: return () => true; // allow anything
  }
}

// This search function is used in the `makeReducer$`
// function below to retrieve the index of a todo in the todosList
// in order to make a modification to the todo data.
function searchTodoIndex(todosList: TodosList, todoid: number): number | null {
  let pointerId: number;
  let index: number;
  let top = todosList.length;
  let bottom = 0;
  for (let i = todosList.length - 1; i >= 0; i--) { // binary search
    index = bottom + ((top - bottom) >> 1);
    pointerId = todosList[index].id;
    if (pointerId === todoid) {
      return index;
    } else if (pointerId < todoid) {
      bottom = index;
    } else if (pointerId > todoid) {
      top = index;
    }
  }
  return null;
}

// MAKE REDUCER STREAM
// A function that takes the actions on the todo list
// and returns a stream of "reducers": functions that expect the current
// todosData (the state) and return a new version of todosData.
function makeReducer$(action$: Stream<TaskListAction>) {
  let clearInputReducer$ = action$
    .filter(isClearInputAction)
    .mapTo(function clearInputReducer(todosData: TodosData) {
      return todosData;
    });

  let insertTodoReducer$ = action$
    .filter(isInsertTodoAction)
    .map(action => function insertTodoReducer(todosData: TodosData) {
      let lastId = todosData.list.length > 0 ?
        todosData.list[todosData.list.length - 1].id :
        0;
      todosData.list.push({
        id: lastId + 1,
        title: action.payload,
        completed: false
      });
      return todosData;
    });

  let editTodoReducer$ = action$
    .filter(isEditTodoAction)
    .map(action => function editTodoReducer(todosData: TodosData) {
      let todoIndex = <number> searchTodoIndex(todosData.list, action.id);
      todosData.list[todoIndex].title = action.title;
      return todosData;
    });

  let toggleTodoReducer$ = action$
    .filter(isToggleTodoAction)
    .map(action => function toggleTodoReducer(todosData: TodosData) {
      let todoIndex = <number> searchTodoIndex(todosData.list, action.id);
      let previousCompleted = todosData.list[todoIndex].completed;
      todosData.list[todoIndex].completed = !previousCompleted;
      return todosData;
    });

  let toggleAllReducer$ = action$
    .filter(isToggleAllAction)
    .mapTo(function toggleAllReducer(todosData: TodosData) {
      let allAreCompleted = todosData.list
        .reduce((x, y) => x && y.completed, true);
      todosData.list.forEach((todoData) => {
        todoData.completed = allAreCompleted ? false : true;
      });
      return todosData;
    });

  let deleteTodoReducer$ = action$
    .filter(isDeleteTodoAction)
    .map(action => function deleteTodoReducer(todosData: TodosData) {
      let todoIndex = <number> searchTodoIndex(todosData.list, action.id);
      todosData.list.splice(todoIndex, 1);
      return todosData;
    });

  let deleteCompletedsReducer$ = action$
    .filter(isDeleteCompletedsAction)
    .mapTo(function deleteCompletedsReducer(todosData: TodosData) {
      todosData.list = todosData.list
        .filter(todoData => todoData.completed === false);
      return todosData;
    });

  let changeRouteReducer$ = action$
    .filter(isChangeRouteAction)
    .map(a => a.payload)
    .startWith('/')
    .map(path => {
      let filterFn = getFilterFn(path);
      return function changeRouteReducer(todosData: TodosData) {
        todosData.filter = path.replace('/', '').trim();
        todosData.filterFn = filterFn;
        return todosData;
      };
    });

  return xs.merge(
    clearInputReducer$,
    insertTodoReducer$,
    editTodoReducer$,
    toggleTodoReducer$,
    toggleAllReducer$,
    deleteTodoReducer$,
    deleteCompletedsReducer$,
    changeRouteReducer$
  );
}

// THIS IS THE MODEL FUNCTION
// It expects the actions coming in from the todo items and
// the initial localStorage data.
function model(action$: Stream<TaskListAction>, sourceTodosData$: Stream<TodosData>) {
  // THE BUSINESS LOGIC
  // Actions are passed to the `makeReducer$` function
  // which creates a stream of reducer functions that needs
  // to be applied on the todoData when an action happens.
  let reducer$ = makeReducer$(action$);

  // RETURN THE MODEL DATA
  return sourceTodosData$.map(sourceTodosData =>
    reducer$.fold((todosData, reducer) => reducer(todosData), sourceTodosData)
  ).flatten()
  // Make this remember its latest event, so late listeners
  // will be updated with the latest state.
  .remember();
}

export default model;
