import {Stream} from "xstream";
import {TodosData} from "./model";

function merge(...args: any[]): any {
  let result: any = {};
  for (let i = 0; i < arguments.length; i++) {
    let object = arguments[i];
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        result[key] = object[key];
      }
    }
  }
  return result;
}

function safeJSONParse(str: string): TodosData | {} {
  return JSON.parse(str) || {};
}

function mergeWithDefaultTodosData(todosData: TodosData): TodosData {
  return merge({
    list: [],
    filter: '',
    filterFn: () => true, // allow anything
  }, todosData);
}

// Take localStorage todoData stream and transform into
// a JavaScript object. Set default data.
export default function deserialize(localStorageValue$: Stream<string>) {
  return localStorageValue$
    .map(safeJSONParse)
    .map(mergeWithDefaultTodosData);
};
