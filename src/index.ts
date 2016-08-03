import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';
import 'todomvc-common/base.js';

import {run} from "@cycle/xstream-run";
import {makeDOMDriver} from "@cycle/dom";
import {makeHistoryDriver} from "@cycle/history";
import {createHistory} from "history";
import {makeStorageDriver} from "cyclejs-storage";
import TaskList from "./components/TaskList";
// THE MAIN FUNCTION
// This is the todo list component.

const main = TaskList;


// THE ENTRY POINT
// This is where the whole story starts.
// `run` receives a main function and an object
// with the drivers.
run(main, {
  // THE DOM DRIVER
  // `makeDOMDriver(container)` from Cycle DOM returns a
  // driver function to interact with the DOM.
  DOM: makeDOMDriver('.todoapp', { transposition: true }),
  // THE HISTORY DRIVER
  // A driver to interact with browser history
  History: makeHistoryDriver(createHistory() as any, {capture: true}),
  // THE STORAGE DRIVER
  // The storage driver which can be used to access values for
  // local- and sessionStorage keys as streams.
  storage: makeStorageDriver()
});
