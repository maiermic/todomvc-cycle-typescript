import xs, {Stream} from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import * as cycleHistory from '@cycle/history'
import {DOMSource} from "../../cycle-dom-xstream";
import {ENTER_KEY, ESC_KEY} from '../../utils';
import {AnchorEvent, InputEvent} from '../../events';
import {
  TaskListAction,
  ChangeRouteAction, isChangeRouteAction,
  UrlAction, isUrlAction,
  ClearInputAction, isClearInputAction,
  InsertTodoAction, isInsertTodoAction,
  ToggleTodoAction, isToggleTodoAction,
  DeleteTodoAction, isDeleteTodoAction,
  EditTodoAction, isEditTodoAction,
  ToggleAllAction, isToggleAllAction,
  DeleteCompletedsAction, isDeleteCompletedsAction,
  toTaskListAction,
} from './actions';
import {TaskAction, isToggleAction, isDestroyAction, isDoneEditAction} from "../Task/actions";

// THE INTENT FOR THE LIST
export default function intent(DOMSource: DOMSource<any>, History: Stream<cycleHistory.Location>, itemAction$: Stream<TaskAction>): Stream<TaskListAction> {
  return xs.merge<TaskListAction>(
    // THE ROUTE STREAM
    // A stream that provides the path whenever the route changes.
    History
      .startWith({pathname: '/'})
      .map(location => location.pathname)
      .compose(dropRepeats<string>())
      .map(payload => <ChangeRouteAction> {type: 'changeRoute', payload}),

    // THE URL STREAM
    // A stream of URL clicks in the app
    DOMSource.select('a').events('click')
      .map(event =>  event.target.hash.replace('#', ''))
      .map(payload => <UrlAction> {type: 'url', payload}),

    // CLEAR INPUT STREAM
    // A stream of ESC key strokes in the `.new-todo` field.
    DOMSource.select('.new-todo').events('keydown')
      .filter(ev => ev.keyCode === ESC_KEY)
      .map(payload => <ClearInputAction> {type: 'clearInput', payload}),

    // ENTER KEY STREAM
    // A stream of ENTER key strokes in the `.new-todo` field.
    DOMSource.select('.new-todo').events('keydown')
      // Trim value and only let the data through when there
      // is anything but whitespace in the field and the ENTER key was hit.
      .filter(ev => {
        let trimmedVal = String(ev.target.value).trim();
        return ev.keyCode === ENTER_KEY && !!trimmedVal;
      })
      // Return the trimmed value.
      .map(ev => String(ev.target.value).trim())
      .map(payload => <InsertTodoAction> {type: 'insertTodo', payload}),

    // TOGGLE STREAM
    // Create a stream out of all the toggle actions on the todo items.
    itemAction$.filter(isToggleAction)
      .map<ToggleTodoAction>(toTaskListAction),

    // DELETE STREAM
    // Create a stream out of all the destroy actions on the todo items.
    itemAction$.filter(isDestroyAction)
      .map<DeleteTodoAction>(toTaskListAction),

    // EDIT STREAM
    // Create a stream out of all the doneEdit actions on the todo items.
    itemAction$.filter(isDoneEditAction)
      .map<EditTodoAction>(toTaskListAction),

    // TOGGLE ALL STREAM
    // Create a stream out of the clicks on the `.toggle-all` button.
    DOMSource.select('.toggle-all').events('click')
      .mapTo<ToggleAllAction>({type: 'toggleAll'}),

    // DELETE COMPLETED TODOS STREAM
    // A stream of click events on the `.clear-completed` element.
    DOMSource.select('.clear-completed').events('click')
      .mapTo<DeleteCompletedsAction>({type: 'deleteCompleteds'})
  );
};
