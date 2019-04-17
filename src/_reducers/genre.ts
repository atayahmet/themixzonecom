import { GET_GENRES, GET_GENRES_SUCCESS } from '@music/actions/actionTypes';
import { IGenreAction, IKeyValueObject, IGenre } from '@music/interfaces';

const defaultState: IKeyValueObject = {
  loading: false,
  loaded: false,
  data: [] as IGenre[]
};

export default function genresReducer(state = defaultState, action: IGenreAction) {
  const { type, loaded, loading, data } = action;

  switch (type) {
    case GET_GENRES: {
      return {
        ...state
      }
    }

    case GET_GENRES_SUCCESS: {
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
