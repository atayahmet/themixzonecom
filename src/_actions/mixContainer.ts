import { ADD_MIX_TO_CONTAINER, REMOVE_MIX_FROM_CONTAINER } from './actionTypes';
import { IMix } from '@music/interfaces';

export function addMix(mix: IMix) {
  return {
    type: ADD_MIX_TO_CONTAINER,
    data: mix
  };
}

export function removeMix(id: string) {
  return {
    type: REMOVE_MIX_FROM_CONTAINER,
    data: { id }
  };
}
