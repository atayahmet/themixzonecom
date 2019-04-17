import { GET_LAST_MIX, UPDATE_LAST_MIX } from '@music/actions/actionTypes';
import { IKeyValueObject, IMix } from '@music/interfaces';

const defaultState: IKeyValueObject = {
  loading: false,
  loaded: false,
  playing: false,
  data: {} as IMix
};

export function lastMixReducer(state = defaultState, action: any) {
  const { type, data, playing = false } = action;

  switch (type) {
    case GET_LAST_MIX: {
      return {
        ...state,
        loaded: true,
        playing,
        data: {...data}
      }
    }
    case UPDATE_LAST_MIX: {
      return {
        ...state,
        loaded: true,
        playing,
        data: {...data}
      }
    }
    default:
      return state;
  }
}
