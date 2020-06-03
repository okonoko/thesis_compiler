import React from 'react';
import Tokenizer from './components/Tokenizer';
import Ast from './components/Ast';
import Parser from './components/Parser';
import Wat from './components/Wat';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const initialState = { rawCode: '', tokenized: '', parsed: '', ast: '',};
function reducer(state = initialState, action){
  console.log(state);
  switch (action.type) {
    case "RAW_CODE_INPUT":
      return {
        ...state,
        rawCode: action.value
      }
    case "TOKENIZED":
      return {
        ...state,
        tokenized: action.value
      }
    case "PARSED":
      return {
        ...state,
        parsed: action.value
      }
    case "AST":
      return {
        ...state,
        ast: action.value
      }
    default:
      return state;
  }

}
const store = createStore(reducer);
store.dispatch({ type: "SET_RAW_CODE",})
function App() {
  return (
    <Provider store={store}>
      <Tokenizer/>
      <Parser/>
      <Ast/>
      <Wat/>
    </Provider>
  );
}

export default App;
