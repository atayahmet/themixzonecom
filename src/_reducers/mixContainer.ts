import { ADD_MIX_TO_CONTAINER, REMOVE_MIX_FROM_CONTAINER } from '@music/actions/actionTypes';
import { IActionPayload, IMix } from '@music/interfaces';

const defaultState = {
  data: [] as IMix[]
};

export default function mixContainer(state = defaultState, action: IActionPayload) {
  const { type, data, id } = action;
  switch (type) {
    case ADD_MIX_TO_CONTAINER: {
      return {
        ...state,
        data: [
          ...state.data,
          {...data}
        ]
      }
    }
    case REMOVE_MIX_FROM_CONTAINER: {
      const newData = state.data.filter(m => m.id !== id);
      return {
        ...state,
        data: [
          ...newData
        ]
      }
    }
    default:
      return state;
  }
}
