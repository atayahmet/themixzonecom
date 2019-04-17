import { SET_CURRENT_TRACK, GET_CURRENT_TRACK } from './actionTypes';
import { ITrack } from '@music/interfaces';

export function setCurrentTrack(data: ITrack) {
  return {
    type: SET_CURRENT_TRACK,
    data
  };
}

export function getCurrentTrack() {
  return {
    type: GET_CURRENT_TRACK
  };
}
