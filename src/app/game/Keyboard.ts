import { observable } from 'mobx'
import WebMidi from 'webmidi'

export interface NoteEvent {
  timestamp: number
  note: {
    number: number
    name: string
    octave: number
  }
  velocity: number
  rawVelocity: number
}


export default class Keyboard {
  @observable ready = false
  @observable error?: string
  @observable input?: any

  readonly notes = observable.map<number, NoteEvent>()

  constructor() {
    WebMidi.enable((err) => {
      if (err) {
        this.error = String(err)
        return
      }

      console.log(WebMidi.inputs)

      this.input = WebMidi.inputs[0]
      this.input.addListener("noteon", undefined, this.handleNoteOn)
      this.input.addListener("noteoff", undefined, this.handleNoteOff)
      this.ready = true
    })
  }

  handleNoteOn = (event) => {
    this.notes.set(event.note.number, { ...event, timestamp: Date.now() })
  }

  handleNoteOff = (event) => {
    this.notes.delete(event.note.number)
  }
}