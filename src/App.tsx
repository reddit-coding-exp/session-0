import React, {
  Component,
  ChangeEvent,
  KeyboardEvent,
  Ref,
  RefObject
} from "react";
import logo from "./logo.svg";
import "./App.css";

function generateId() {
  return String(Math.floor(Math.random() * 10000000));
}

interface TodoItemData {
  id: string;

  text: string;

  selected: boolean;
}

interface TodoList {
  currentText: string;

  todoItems: TodoItemData[];
}

interface AppProps {}

class App extends Component<AppProps, TodoList> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      currentText: "",
      todoItems: []
    };
  }

  renderTodoItems = () => {
    return this.state.todoItems.map(todoItem => {
      return <TodoItem key={todoItem.id} text={todoItem.text} />;
    });
  };

  onHeaderCurrentTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ currentText: event.target.value });
  };

  onHeaderTextAccepted = () => {
    const newTodoItem: TodoItemData = {
      id: generateId(),
      text: this.state.currentText,
      selected: false
    };

    const newTodoItemArray = [...this.state.todoItems, newTodoItem];

    this.setState({ todoItems: newTodoItemArray, currentText: "" });
  };

  render() {
    return (
      <div className="todo-list">
        <div className="todo-list-container">
          <TodoHeaderSection
            currentText={this.state.currentText}
            onEnterPressed={this.onHeaderTextAccepted}
            onChange={this.onHeaderCurrentTextChange}
          />

          <div className="todo-items-section todo-section">
            {this.renderTodoItems()}
          </div>

          <TodoFooterSection />
        </div>
      </div>
    );
  }
}

interface TodoHeaderSectionProps {
  currentText: string;
  onChange(event: ChangeEvent<HTMLInputElement>): void;
  onEnterPressed(): void;
}

class TodoHeaderSection extends Component<TodoHeaderSectionProps> {
  inputRef: RefObject<HTMLInputElement>;

  constructor(props: TodoHeaderSectionProps) {
    super(props);
    this.inputRef = React.createRef();
  }

  handleKeypress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      this.props.onEnterPressed();
    }
  };

  componentDidMount() {
    this.inputRef.current && this.inputRef.current.focus();
  }

  render() {
    return (
      <div className="todo-header-section todo-section">
        <label className="toggle-all-label" htmlFor="todo-input">❯</label>
        <input
          className='todo-input'
          name="todo-input"
          ref={this.inputRef}
          onChange={this.props.onChange}
          placeholder="What needs to be done?"
          value={this.props.currentText}
          onKeyPress={this.handleKeypress}
        />
      </div>
    );
  }
}

interface TodoItemProps {
  text: string;
}

class TodoItem extends Component<TodoItemProps> {
  render() {
    return (
      <div className="todo-item">
        <input type="checkbox" />
        <span> {this.props.text} </span>
      </div>
    );
  }
}

class TodoFooterSection extends Component {
  render() {
    return (
      <div className="todo-footer-section todo-section">
        <span>n items</span>

        <span>All</span>
        <span>Active</span>
        <span>Completed</span>
      </div>
    );
  }
}

export default App;
