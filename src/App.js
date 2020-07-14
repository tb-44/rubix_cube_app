import React, { Component } from "react";
import "./App.css";
import "babel-polyfill";
import { Provider, connect } from "react-redux";
import reducers from "./reducers";
import actions from "./actions";
import sagas from "./sagas";
import { createStore, bindActionCreators, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import Puzzle from "./Puzzle";

class App extends Component {
  constructor(props) {
    super(props);

    const sagaMiddleware = createSagaMiddleware();
    this.store = createStore(reducers, applyMiddleware(sagaMiddleware));
    this.Connected = connect(reducers, (dispatch) => ({
      actions: bindActionCreators(actions, dispatch),
    }))(Puzzle);
    this.mainTask = sagaMiddleware.run(sagas);
  }
  componentWillUnmount() {
    this.mainTask.cancel();
  }
  render() {
    return (
      <div className="App">
        <Provider store={this.store}>
          <this.Connected />
        </Provider>
      </div>
    );
  }
}

export default App;
