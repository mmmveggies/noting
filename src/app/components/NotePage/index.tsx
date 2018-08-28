import React from 'react';
import Vex, { Flow as VF } from 'vexflow'
import { observer } from 'mobx-react'
import * as Note from 'tonal-note'

// import Keyboard, { NoteEvent } from 'app/game/Keyboard'
import Keyboard from 'app/game/Keyboard'
import { randomNotes } from 'app/generators'
import { autorun } from 'mobx';

// import classNames from 'classnames';

// import style from './style.css';

export interface NotePageProps {
  keyboard: Keyboard
}

export interface NotePageState {
  renderer?: VF.Renderer
  lines?: VF.StaveNote[][][]
  start?: Date
}

@observer
export class NotePage extends React.Component<NotePageProps, NotePageState> {
  state: NotePageState = {}

  el: HTMLDivElement | null = null

  componentWillReceiveProps() {
    this.start()
  }

  componentDidMount() {
    const renderer = new VF.Renderer(this.el, Vex.Flow.Renderer.Backends.SVG);
    renderer.resize(this.el!.clientWidth, 700);

    const lines: VF.StaveNote[][][] = []
    for (let l = 0; l < 3; l++) {
      const line: VF.StaveNote[][] = []
      for (let b = 0; b < 3; b++) {
        line.push(randomNotes("C"))
      }
      lines.push(line)
    }

    this.setState({ renderer, lines, start: new Date() }, () => {
      autorun(() => {
        if (this.props.keyboard.notes.size !== NaN) {
          this.start()
        }
      })
    })
  }

  start = () => {
    const renderer = this.state.renderer!
    const lines = this.state.lines!

    renderer.getContext().clear()

    lines.forEach((line, l) => {
      line.forEach((bar, b) => {
        const x = 10 + (400 * b)
        const y = 40 + (125 * l)

        const stave = new VF.Stave(x, y, 400)
        if (b === 0) {
          stave.addClef('treble').addTimeSignature('4/4')
        }

        for (const note of bar) {
          const [ key ] = note.getKeys()
          const keyValue = key.replace('/', '')
          const midiValue = Note.midi(keyValue)
          if (this.props.keyboard.notes.has(midiValue)) {
            note.setStyle({ fillStyle: 'red', shadowColor: 'red', shadowBlur: 15 as any })
          } else {
            note.setStyle({ fillStyle: 'black', shadowColor: 'black', shadowBlur: 15 as any })
          }
        }

        const voice = new VF.Voice({ num_beats: 4, beat_value: 4 })
        voice.addTickables(bar)
      
        new VF.Formatter()
        .joinVoices([ voice ])
        .format([ voice ], 400)

        voice.draw(renderer.getContext(), stave)
        stave.setContext(renderer.getContext()).draw()
      })
    })

    const keys = Array.from(this.props.keyboard.notes.values())
    .sort((a, b) => a.note.number - b.note.number)
    .map((event) => {
      return event.note.name + '/' + event.note.octave
    })

    if (keys.length) {
      const stave = new VF.Stave(10, 125 * 4, 400)
      stave.addKeySignature('F')
      stave.addClef('treble').addTimeSignature('4/4')
      const voice = new VF.Voice({ num_beats: 4, beat_value: 4 })
      const note = new VF.StaveNote({
        clef: 'treble',
        keys,
        duration: 'w'
      })

      voice.addTickables([ note ])
    
      new VF.Formatter()
      .joinVoices([ voice ])
      .format([ voice ], 400)

      voice.draw(renderer.getContext(), stave)
      stave.setContext(renderer.getContext()).draw()
    }

    this.forceUpdate()
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.state.renderer != nextState.renderer
  // }

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
