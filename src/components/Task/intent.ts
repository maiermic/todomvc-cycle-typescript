import xs, {Stream} from 'xstream';
import {DOMSource} from "../../cycle-dom-xstream";
import {ENTER_KEY, ESC_KEY} from '../../utils';
import {InputEvent} from '../../events';
import {TaskAction, DoneEditAction} from "./actions";

// THE TODO ITEM INTENT
// This intent function returns a stream of all the different,
// actions that can be taken on a todo.
function intent(DOMSource: DOMSource<any>): Stream<TaskAction> {
  // THE INTENT MERGE
  // Merge all actions into one stream.
  return xs.merge<TaskAction>(
    // THE DESTROY ACTION STREAM
    DOMSource.select('.destroy').events('click')
      .mapTo(<TaskAction> {type: 'destroy'}),

    // THE TOGGLE ACTION STREAM
    DOMSource.select('.toggle').events('change')
      .mapTo(<TaskAction> {type: 'toggle'}),

    // THE START EDIT ACTION STREAM
    DOMSource.select('label').events('dblclick')
      .mapTo(<TaskAction> {type: 'startEdit'}),

    // THE ESC KEY ACTION STREAM
    DOMSource.select('.edit').events('keyup')
      .filter(ev => ev.keyCode === ESC_KEY)
      .mapTo(<TaskAction> {type: 'cancelEdit'}),

    // THE ENTER KEY ACTION STREAM
    DOMSource.select('.edit').events('keyup')
      .filter(ev => ev.keyCode === ENTER_KEY)
      .compose(s => xs.merge(s, DOMSource.select('.edit').events('blur', true)))
      .map((ev: InputEvent) => <DoneEditAction> {title: ev.target.value, type: 'doneEdit'})
  );
}

export default intent;
