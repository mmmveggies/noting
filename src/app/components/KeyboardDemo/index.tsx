import React from 'react'
import { observer } from 'mobx-react'

import Keyboard, { NoteEvent } from '../../game/Keyboard'

interface Props {
  keyboard: Keyboard
}

@observer
export class KeyboardDemo extends React.Component<Props> {
  componentDidMount() {
    this.run()
  }

  run = () => {
    this.forceUpdate()
    requestAnimationFrame(this.run)
  }

  renderNote = (midiValue: number, event: NoteEvent) => {
    const seconds = Date.now() - event.timestamp
    const h = 256 - event.rawVelocity*2
    const color = `hsl(${h}, 100%, 50%)`

    return (
      <li
        key={midiValue}
        style={{
          fontFamily: 'Helvetica',
          fontSize: `${12 + seconds/600}px`,
          fontWeight: (event.velocity * 800),
          backgroundColor: color
        }}
      >
        {midiValue} -- {seconds/1000} seconds
      </li>
    )
  }


  render() {
    const {
      keyboard: { ready, notes, error }
    } = this.props

    if (error) {
      return (
        <>
          <h1>ERROR</h1>
          <code><pre>{error}</pre></code>
        </>
      )
    }

    if (!ready) {
      return (<h1>Loading...</h1>)
    }

    if (notes.size === 0) {
      return <h1>No notes are playing!</h1>
    }

    return (
      <ul>
        {Array.from(notes.entries(), ([ midiValue, noteEvent ]) => (
          this.renderNote(midiValue, noteEvent)
        ))}
      </ul>
    )
  }
}