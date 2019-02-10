import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">

        <TodoHeaderSection />

        <TodoItem text='foo 1' />
        <TodoItem text='foo 1' />
        <TodoItem text='foo 1' />
        <TodoItem text='foo 1' />

        <TodoFooterSection />

      </div>
    );
  }
}


class TodoHeaderSection extends Component {
  render(){
    return (
        <div className='todo-header-section'>
          <span>\/</span>
          <input placeholder='What needs to be done?'></input>
        </div>
    )
  }
}


interface TodoItemProps {
  text: string
}

class TodoItem extends Component<TodoItemProps> {
  render(){
    return (
        <div className='todo-item'>
          <input type='checkbox' />
          <span> {this.props.text} </span>
        </div>
    )
  }
}


class TodoFooterSection extends Component {
  render(){
    return (
        <div className='todo-footer-section'>
          <span>n items</span>

          <span>All</span>
          <span>Active</span>
          <span>Completed</span>
        </div>
    )
  }
}



export default App;
