import { SET_CURRENT_TRACK, GET_CURRENT_TRACK } from '@music/actions/actionTypes';
import { ITrack } from '@music/interfaces';

interface ICurrentTrackAction {
  type: string;
  data: ITrack;
}

const defaultState = {} as ITrack;

export default function currentTrack(state = defaultState, action: ICurrentTrackAction) {
  const { type, data = {} } = action;

  switch (type) {
    case SET_CURRENT_TRACK: {
      return {
        ...data
      }
    }
    case GET_CURRENT_TRACK: {
      return state
    }
    default:
      return state;
  }
}
