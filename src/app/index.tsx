import React from 'react';
import { hot } from 'react-hot-loader';

// import { NotePage, KeyboardDemo } from './components'
import Keyboard from './game/Keyboard'
import { KeyboardDemo } from './components'


// render react DOM
export const App = hot(module)(() => (
  <KeyboardDemo keyboard={new Keyboard()} />
));
