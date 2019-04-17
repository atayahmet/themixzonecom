import { GET_SERIES, GET_SERIES_SUCCESS } from '@music/actions/actionTypes';
import { ISeriesAction } from '@music/actions/series';
import { IKeyValueObject, ISeries } from '@music/interfaces';

const defaultState: IKeyValueObject = {
  loading: false,
  loaded: false,
  data: [] as ISeries[]
};

export default function seriesReducer(state = defaultState, action: ISeriesAction) {
  const { type, loaded, loading, data } = action;

  switch (type) {
    case GET_SERIES: {
      return {
        ...state
      }
    }

    case GET_SERIES_SUCCESS: {
      return {
        ...state,
        loaded,
        loading,
        data
      }
    }

    default:
      return state;
  }
}
