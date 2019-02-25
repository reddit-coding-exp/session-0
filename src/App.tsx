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

const storageKey = "todoAppKey";

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
  completedState: Record<string, boolean | undefined>;
}

interface AppProps {}

class App extends Component<AppProps, TodoList> {
  constructor(props: AppProps) {
    super(props);

    const persistedState = localStorage.getItem(storageKey);

    if (persistedState === null) {
      this.state = {
        currentText: "",
        todoItems: [],
        activeFilter: "all",
        completedState: {}
      };
    } else {
      this.state = JSON.parse(persistedState)
    }
  }

  shouldComponentUpdate(nextProps: AppProps, nextState: TodoList) {
    localStorage.setItem(storageKey, JSON.stringify(this.state));
    return true;
  }

  onTodoItemStateChange = (event: TodoItemChangeEvent) => {
    this.setState({
      completedState: {
        ...this.state.completedState,
        [event.id]: event.completed
      }
    });
  };

  getFilteredTodoItems = () => {
    return this.state.todoItems.filter(todoItem => {
      const isChecked = this.state.completedState[todoItem.id];
      if (this.state.activeFilter === "active") {
        if (isChecked === true) {
          return false;
        } else {
          return true;
        }
      } else if (this.state.activeFilter === "completed") {
        if (isChecked === true) {
          return true;
        } else {
          return false;
        }
      }

      return true;
    });
  };

  renderTodoItems = () => {
    return this.getFilteredTodoItems().map(todoItem => {
      return (
        <TodoItem
          completed={!!this.state.completedState[todoItem.id]}
          onStateToggle={this.onTodoItemStateChange}
          key={todoItem.id}
          todoItem={todoItem}
        />
      );
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
    const sortedItems = bubbleSort(newTodoItemArray)

    this.setState({ todoItems: sortedItems, currentText: "" });
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

  onFilterClicked = (activeFilter: TodoFilter) => {
    this.setState({ activeFilter });
  };

  renderFooter = () => {
    if (this.state.todoItems.length === 0) {
      return null;
    }

    return (
      <TodoFooterSection
        onFilterClicked={this.onFilterClicked}
        filterSelection={this.state.activeFilter}
        todoCount={this.getFilteredTodoItems().length}
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

interface TodoItemChangeEvent {
  completed: boolean;
  id: string;
}

interface TodoItemProps {
  todoItem: TodoItemData;
  completed: boolean;
  onStateToggle(event: TodoItemChangeEvent): void;
}

class TodoItem extends Component<TodoItemProps> {
  onCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onStateToggle({
      id: this.props.todoItem.id,
      completed: event.target.checked
    });
  };

  render() {
    return (
      <span className="todo-item">
        <input
          checked={this.props.completed}
          onChange={this.onCheckboxChange}
          type="checkbox"
        />
        <span> {this.props.todoItem.text} </span>
      </span>
    );
  }
}

interface TodoFooterSectionProps {
  todoCount: number;

  filterSelection: TodoFilter;

  onFilterClicked(filter: TodoFilter): void;
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
          <span
            className={this.calculateClassName("all")}
            onClick={() => this.props.onFilterClicked("all")}
          >
            All
          </span>
          <span
            className={this.calculateClassName("active")}
            onClick={() => this.props.onFilterClicked("active")}
          >
            Active
          </span>
          <span
            className={this.calculateClassName("completed")}
            onClick={() => this.props.onFilterClicked("completed")}
          >
            Completed
          </span>
        </span>
      </div>
    );
  }
}

export default App;








// Create our own bubble sort

function bubbleSort(numbersToSort: TodoItemData[]){
  const copiedNumbers = [...numbersToSort]

  for(let i = 0; i < copiedNumbers.length; i++){

    for(let j = 0; j < copiedNumbers.length - 1; j++){
      const n1 = copiedNumbers[j]
      const n2 = copiedNumbers[j+1]

      if ( n1.text <= n2.text){
        continue
      } else {
        copiedNumbers[j] = n2
        copiedNumbers[j + 1] = n1
      }
    }

  }

  return copiedNumbers
}






