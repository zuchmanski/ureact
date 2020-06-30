import { React, ReactDOM } from './ureact.js';
const mountNode = document.getElementById('main');

//

class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [
        { text: 'Item #1', id: Math.random() * 10000 },
        { text: 'Item #2', id: Math.random() * 10000, doneAt: new Date() },
        { text: 'Item #3', id: Math.random() * 10000 },
      ],
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
    return (
      <div>
        <div>
          <h3>TODO</h3>

          <TodoList
            onToggleDone={this.toggleDone}
            onRemove={this.remove}
            items={this.state.items} />

          <form onSubmit={this.handleSubmit}>
            <label htmlFor="new-todo">
              What needs to be done?
            </label>
            <input
              id="new-todo"
              onChange={this.handleChange}
              value={this.state.text}
              />
            <button>
              Add #{this.state.items.length + 1}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

class TodoList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(item => (
          <li key={item.id}>
            <small style="margin-right: 1em;">
              <a
                class='pure-button pure-button-primary'
                onclick={() => this.props.onToggleDone(item)}>
                ✓
              </a>
              &nbsp;
              <a
                class='pure-button'
                onclick={() => this.props.onRemove(item)}>
                ✕
              </a>
            </small>
            {item.text}
            {item.doneAt ? ` (Done at ${item.doneAt.toLocaleString()})` : ''}
          </li>
        ))}
      </ul>
    );
  }
}

ReactDOM.render(<TodoApp />, mountNode);
