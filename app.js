import { React, ReactDOM } from './ureact.js';
const mountNode = document.getElementById('main');

//

class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [{ text: 'Item #1', id: Math.random() * 10000 }, { text: 'Item #2', id: Math.random() * 10000, doneAt: new Date() }, { text: 'Item #3', id: Math.random() * 10000 }],
      text: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleDone = this.toggleDone.bind(this);
    this.remove = this.remove.bind(this);
  }

  toggleDone(item) {
    item.doneAt = item.doneAt ? null : new Date();

    this.forceUpdate();
  }

  remove(item) {
    this.state.items.splice(this.state.items.indexOf(item), 1);

    this.forceUpdate();
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.state.text.length) {
      return;
    }

    const newItem = {
      text: this.state.text,
      id: Date.now()
    };

    this.setState(prevState => ({
      items: prevState.items.concat(newItem),
      text: ''
    }));
  }

  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        null,
        React.createElement(
          'h3',
          null,
          'TODO'
        ),
        React.createElement(TodoList, {
          onToggleDone: this.toggleDone,
          onRemove: this.remove,
          items: this.state.items }),
        React.createElement(
          'form',
          { onSubmit: this.handleSubmit },
          React.createElement(
            'label',
            { htmlFor: 'new-todo' },
            'What needs to be done?'
          ),
          React.createElement('input', {
            id: 'new-todo',
            onChange: this.handleChange,
            value: this.state.text
          }),
          React.createElement(
            'button',
            null,
            'Add #',
            this.state.items.length + 1
          )
        )
      )
    );
  }
}

class TodoList extends React.Component {
  render() {
    return React.createElement(
      'ul',
      null,
      this.props.items.map(item => React.createElement(
        'li',
        { key: item.id },
        React.createElement(
          'small',
          { style: 'margin-right: 1em;' },
          React.createElement(
            'a',
            {
              'class': 'pure-button pure-button-primary',
              onclick: () => this.props.onToggleDone(item) },
            '\u2713'
          ),
          '\xA0',
          React.createElement(
            'a',
            {
              'class': 'pure-button',
              onclick: () => this.props.onRemove(item) },
            '\u2715'
          )
        ),
        item.text,
        item.doneAt ? ` (Done at ${item.doneAt.toLocaleString()})` : ''
      ))
    );
  }
}

ReactDOM.render(React.createElement(TodoApp, null), mountNode);
