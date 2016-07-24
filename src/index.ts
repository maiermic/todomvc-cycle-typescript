import {run} from '@cycle/xstream-run';
import {div, label, input, hr, h1, VNode, makeDOMDriver} from '@cycle/dom';
import {Stream} from 'xstream';
import {DOMSource} from "@cycle/dom/xstream-typings";

interface InputEvent extends Event {
  target: EventTarget & HTMLInputElement
}

export type Sources = {
  DOM: DOMSource
}
export type Sinks = {
  DOM: Stream<VNode>
}

function main(sources: Sources): Sinks {
  return {
    DOM: (sources.DOM.select('.myinput').events('input') as Stream<InputEvent>)
      .map(ev => ev.target.value)
      .startWith('')
      .map(name =>
        div([
          label('Name:'),
          input('.myinput', { attrs: { type: 'text' } }),
          hr(),
          h1(`Hello ${name}`)
        ])
      )
  };
}

// THE ENTRY POINT
// This is where the whole story starts.
// `run` receives a main function and an object
// with the drivers.
run(main, {
  // THE DOM DRIVER
  // `makeDOMDriver(container)` from Cycle DOM returns a
  // driver function to interact with the DOM.
  DOM: makeDOMDriver('#root', { transposition: true }),
});
