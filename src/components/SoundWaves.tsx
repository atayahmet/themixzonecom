import * as React from 'react';

export function SoundWaves({active = false, color = '#f3f3f3'}: {active: boolean, color?: string}) {
  return !active ? null : (
    <div className="waves">
      <span style={{backgroundColor: color}}></span>
      <span style={{backgroundColor: color}}></span>
      <span style={{backgroundColor: color}}></span>
      <span style={{backgroundColor: color}}></span>
    </div>
  )
}
