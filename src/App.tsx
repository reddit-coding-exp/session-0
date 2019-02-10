import React, { Component, ChangeEvent, KeyboardEvent } from "react";
import logo from "./logo.svg";
import "./App.css";

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
      todoItems: [
        {
          id: "hard-coded-1",
          text: "foo bar",
          selected: false
        },
        {
          id: "hard-coded-2",
          text: "foo bar 2",
          selected: false
        }
      ]
    };
  }

  renderTodoItems = () => {
    return this.state.todoItems.map(todoItem => {
      return <TodoItem text={todoItem.text} />;
    });
  };

  onHeaderCurrentTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ currentText: event.target.value });
  };

  onHeaderTextAccepted = () => {
    const newTodoItem: TodoItemData = {
      id: "hardcoded-id-for-new-items",
      text: this.state.currentText,
      selected: false
    };

    const newTodoItemArray = [...this.state.todoItems, newTodoItem];

    this.setState({ todoItems: newTodoItemArray, currentText: "" });
  };

  render() {
    return (
      <div className="App">
        <TodoHeaderSection
          currentText={this.state.currentText}
          onEnterPressed={this.onHeaderTextAccepted}
          onChange={this.onHeaderCurrentTextChange}
        />

        {this.renderTodoItems()}

        <TodoFooterSection />
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
  handleKeypress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      this.props.onEnterPressed();
    }
  };

  render() {
    return (
      <div className="todo-header-section">
        <span>\/</span>
        <input
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
      <div className="todo-footer-section">
        <span>n items</span>

        <span>All</span>
        <span>Active</span>
        <span>Completed</span>
      </div>
    );
  }
}

export default App;
