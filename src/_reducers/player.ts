import { SET_MIX_TO_PLAYER, GET_CURRENT_MIX_FROM_PLAYER } from '@music/actions/actionTypes';
import { IPlayerAction, IKeyValueObject, MainMixType } from '@music/interfaces';

const defaultState: IKeyValueObject = {} as MainMixType;

export default function player(state = defaultState, action: IPlayerAction) {
  const { type, data = {} } = action;

  switch (type) {
    case SET_MIX_TO_PLAYER: {
      return {
        ...data
      }
    }
    case GET_CURRENT_MIX_FROM_PLAYER: {
      return state
    }
    default:
      return state;
  }
}
