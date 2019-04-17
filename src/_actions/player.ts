import { SET_MIX_TO_PLAYER, GET_CURRENT_MIX_FROM_PLAYER } from './actionTypes';
import { MainMixType } from '@music/interfaces';

export function setMainMix(data: MainMixType) {
  return {
    type: SET_MIX_TO_PLAYER,
    data
  };
}

export function getMainMix() {
  return {
    type: GET_CURRENT_MIX_FROM_PLAYER
  };
}
