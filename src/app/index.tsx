import React from 'react';
import { hot } from 'react-hot-loader';

import Keyboard from './game/Keyboard'
// import { KeyboardDemo, NotePage } from './components'
import { NotePage } from './components'

const keyboard = new Keyboard()

// render react DOM
export const App = hot(module)(() => (
  <>
    {/* <KeyboardDemo keyboard={keyboard} /> */}
    <NotePage keyboard={keyboard} />
  </>
));
