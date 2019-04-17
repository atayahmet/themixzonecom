import * as React from 'react';
import loader from '@music/images/loader.svg';

export function PlayerLoader({active = false, width = 13}: {active: boolean, width?: number}) {
  return !active ? null : (
    <img className="player-loader" src={loader} width={width} />
  )
}
