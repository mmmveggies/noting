import React from 'react';
import Vex, { Flow as VF } from 'vexflow'

import { demo } from 'app/generators'
// import classNames from 'classnames';

// import style from './style.css';

export interface NotePageProps {
}

export interface NotePageState {
  renderer?: VF.Renderer
}

export class NotePage extends React.Component<NotePageProps, NotePageState> {
  state: NotePageState = {}

  el: HTMLDivElement | null = null

  componentDidMount() {
    const renderer = new VF.Renderer(this.el, Vex.Flow.Renderer.Backends.SVG);
    renderer.resize(500, 500);

    this.setState({ renderer }, () => demo(this.state.renderer))
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.renderer != nextState.renderer
  }

  render() {
    // if (this.state.renderer) {
    //   demo(this.state.renderer)
    // }

    return (
      <div
        style={{ border: '1px solid green' }}
        ref={(el) => this.el = el}
      />
    )
  }
}

export default NotePage;
