import { Flow as VF } from 'vexflow'

import * as tnote from 'tonal-note'
// import tchord from 'tonal-chord'
import * as tscale from 'tonal-scale'
// import tdict from 'tonal-dictionary'

const tnotes: string[] = tnote.names()
// const tscales = tscale.names()

export function randomItems<T>(arr: T[], count: number): T[] {
  const src = arr.slice()
  const out: T[] = []

  while(count-- > 0) {
    const idx = Math.floor(Math.random() * src.length)
    out.push(...src.splice(idx, 1))
  }

  return out
}

export function t2v(tnote: string) {
  return `${tnote.toLowerCase()}/4`
}

export function randomNotes(key = randomItems(tnotes, 1)[0]) {
  const scale: string[] = tscale.notes(key, 'major')

  const vnotes = Array.from({ length: 4 }, () => new VF.StaveNote({
    clef: 'treble',
    keys: randomItems(scale, 1).map(t2v),
    duration: 'q'
  }))

  return vnotes
}

export function demo(renderer: VF.Renderer) {
  // const ctx = renderer.getContext()
  renderer.getContext().clear()
  
  const stave = new VF.Stave(10, 40, 400)

  stave.addClef('treble').addTimeSignature('4/4')
  stave.setContext(renderer.getContext()).draw()

  const notes = randomNotes()

  const voice = new VF.Voice({ num_beats: 4, beat_value: 4 })
  voice.addTickables(notes)

  // const formatter = new VF.Formatter()
  new VF.Formatter()
  .joinVoices([ voice ])
  .format([ voice ], 400)


  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      notes.forEach((note, idx) => {
        if (i === idx) {
          note.setStyle({ fillStyle: 'blue', shadowColor: 'blue', shadowBlur: 15 as any })
        } else {
          note.setStyle({ fillStyle: 'black', shadowColor: 'black', shadowBlur: 0 as any })
        }
      })

      voice.draw(renderer.getContext(), stave)
    }, i * 600)
  }

  setTimeout(() => demo(renderer), 4 * 600)
}