import * as React from 'react';

export function PlayerTimeline({playing, progress = 0, onSeek}: {playing: boolean, progress: number, onSeek: (e: any) => any}) {
  return (
    <div className="timeline-container">
      <div  className="bar" style={{width: (progress) + 1+'%'}} />
      <div style={{left: progress+'%'}} className="cursor" />
      <div className="transparent-line" onClick={onSeek} />
    </div>
  )
}
