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

type TodoFilter = "all" | "active" | "completed";

interface TodoItemData {
  id: string;

  text: string;

  selected: boolean;
}

interface TodoList {
  currentText: string;
  activeFilter: TodoFilter;
  todoItems: TodoItemData[];
}

interface AppProps {}

class App extends Component<AppProps, TodoList> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      currentText: "",
      todoItems: [],
      activeFilter: "all"
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

  renderItems = () => {
    if (this.state.todoItems.length === 0) {
      return null;
    }

    return (
      <div className="todo-item-section todo-section">
        {this.renderTodoItems()}
      </div>
    );
  };

  renderFooter = () => {
    if (this.state.todoItems.length === 0) {
      return null;
    }

    return (
      <TodoFooterSection
        filterSelection={this.state.activeFilter}
        todoCount={this.state.todoItems.length}
      />
    );
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

          {this.renderItems()}
          {this.renderFooter()}
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
        <label className="toggle-all-label" htmlFor="todo-input">
          ❯
        </label>
        <input
          className="todo-input"
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
      <span className="todo-item">
        <input type="checkbox" />
        <span> {this.props.text} </span>
      </span>
    );
  }
}

interface TodoFooterSectionProps {
  todoCount: number;

  filterSelection: TodoFilter;
}

class TodoFooterSection extends Component<TodoFooterSectionProps> {
  calculateClassName = (labelFor: TodoFilter) => {
    return `todo-filter-selection ${
      labelFor === this.props.filterSelection ? "active" : ""
    }`;
  };

  render() {
    return (
      <div className="todo-footer-section todo-section">
        <span className="todo-item-count">{this.props.todoCount} items</span>

        <span className="todo-filter-selection">
          <span className={this.calculateClassName("all")}>All</span>
          <span className={this.calculateClassName("active")}>Active</span>
          <span className={this.calculateClassName("completed")}>
            Completed
          </span>
        </span>
      </div>
    );
  }
}

export default App;
