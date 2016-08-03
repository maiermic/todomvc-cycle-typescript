import {button, div, input, label, li, VNode} from '@cycle/dom';
import {Stream} from 'xstream';
import {TaskModel} from './model';

function view(state$: Stream<TaskModel>) {
  return state$.map(data => {
    let {title, isCompleted, isEditing} = data;
    let todoRootClasses = {
      completed: isCompleted,
      editing: isEditing,
    };

    return li('.todoRoot', {class: todoRootClasses}, [
      div('.view', [
        input('.toggle', {
          props: {type: 'checkbox', checked: isCompleted},
        }),
        label(title),
        button('.destroy')
      ]),
      input('.edit', {
        props: {type: 'text'},
        hook: {
          update: (oldVNode: VNode, vnode: VNode) => {
            let elm = vnode.elm as HTMLInputElement;
            elm.value = title;
            if (isEditing) {
              elm.focus();
              elm.selectionStart = elm.value.length;
            }
          }
        }
      })
    ]);
  });
}

export default view;
