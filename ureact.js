const findChild = (tree, child) => {
  if (Array.isArray(tree.children)) {
    return tree.children.filter(c => c.key == child.key)[0];
  }

  return undefined;
};

const attrMap = (obj) => {
  let pairs = [];

  for(let key in obj) {
    if (obj[key]) {
      pairs.push(`${key}=${obj[key]}`);
    }
  }

  return pairs.join(" ");
};

const previewTree = (tree, id) => {
  const element = document.getElementById(id);

  const previewSubtree = (tree, depth = 0) => {
    if(!tree.elemName) return '\n';

    const text = tree.attrs && tree.attrs.text ? tree.attrs.text : '';
    const attrs = tree.attrs ? `(${attrMap(tree.attrs)})` : '';

    let output = Array(depth + 1).join(" ") +
        `<span class="tag">%${tree.elemName}</span><span class="attrs">${attrs}</span> ${text}\n`;

    if(tree.children.length == 0) {
      return output;
    } else {
      return output + tree.children.map((child) => {
        return previewSubtree(child, depth + 1);
      }).join('');
    }
  };

  element.innerHTML = previewSubtree(tree);
};

class uReact {
  constructor(mainComponent, element) {
    this.mainComponent = mainComponent;
    this.element = element;
  }

  render() {
    function applyTree(oldTree = { children: [] }, newTree, parentElement) {
      newTree.children.forEach(child => {
        let element;

        const childInOldTree = findChild(oldTree, child);

        if (childInOldTree) {
          element = childInOldTree.element;

          if(child.component) {
            child.component.state = childInOldTree.component.state;
            child.children = child.component.render().children;

            applyKeys(child, child.key);
          }
        } else {
          element = document.createElement(child.elemName);
          element.setAttribute('key', child.key);
          parentElement.appendChild(element);
        }

        child.element = element;

        for (let key in child.attrs) {
          if (typeof child.attrs[key] === 'function') {
            if (!childInOldTree || childInOldTree.attrs[key].toString() !== child.attrs[key].toString())
              element[key.toLowerCase()] = child.attrs[key];
          } else if (key == 'text') {
            if (!childInOldTree || childInOldTree.attrs.text !== child.attrs.text)
              element.innerHTML = child.attrs.text;
          } else if (key == 'value') {
            if (element.value !== child.attrs[key])
              element.value = child.attrs[key];
          } else {
            if (element.getAttribute(key) !== child.attrs[key])
              element.setAttribute(key, child.attrs[key]);
          }
        };

        applyTree(childInOldTree, child, element);
      });

      oldTree.children.forEach(child => {
        if (!findChild(newTree, child)) child.element.remove();
      });
    }

    function applyKeys(tree, key = '_0') {
      tree.key = tree.attrs && tree.attrs.key ? tree.attrs.key : key;
      tree.children.forEach((child, idx) => applyKeys(child, `${key}.${idx}`));
    }

    if(!this.persistedMainComponent) {
      this.persistedMainComponent = new this.mainComponent.elemName(this.mainComponent.attrs);
    }

    let newTree = this.persistedMainComponent.render();
    newTree.element = this.element;

    applyKeys(newTree);
    applyTree(this.previousTree, newTree, this.element);

    previewTree(this.previousTree || { children: [] }, 'oldTree');
    previewTree(newTree, 'newTree');

    this.previousTree = newTree;
  }
}

export function createElement(elemName, attrs = {}, ...children) {
  if(children && Array.isArray(children[0])) children = children[0];

  let mappedChildren = children.map((child) => {
    if (typeof child !== 'object') {
      return { elemName: 'span', attrs: { text: child }, children: [] };
    } else if (typeof child.elemName === 'function') {
      const component = new child.elemName(child.attrs);

      return { ...component.render(), stateful: true, component: component };
    } else {
      return child;
    }
  });

  return { elemName, attrs, children: mappedChildren };
};

function render(baseCompoenent, element) {
  window.ureact = new uReact(baseCompoenent, element);

  window.ureact.render();
};

class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
  }

  setState(stateChange) {
    Object.assign(
      this.state,
      typeof stateChange === 'function' ? stateChange(this.state) : stateChange
    );

    window.ureact.render();
  }

  forceUpdate() {
    window.ureact.render();
  }

  render() { }
};

export const React = { Component, createElement };
export const ReactDOM = { render };
