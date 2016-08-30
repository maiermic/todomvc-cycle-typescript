import {Stream} from 'xstream';
import {DOMSource} from "../../cycle-dom-xstream";
import {VNode} from '@cycle/dom';
import intent from './intent';
import model, {TaskProperties} from './model';
import view from './view';
import {TaskAction} from "./actions";

interface TaskSources {
  DOM: DOMSource<any>,
  props$: Stream<TaskProperties>
}

interface TaskSinks {
  DOM: Stream<VNode>,
  action$: Stream<TaskAction>
}

// THE TODO ITEM FUNCTION
// This is a simple todo item component,
// structured with the MVI-pattern.
function Task(sources: TaskSources): TaskSinks {
  let action$ = intent(sources.DOM);
  let state$ = model(sources.props$, action$);
  let vtree$ = view(state$);

  return {
    DOM: vtree$,
    action$,
  };
}

export default Task;
