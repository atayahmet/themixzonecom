import { GET_GENRES_START, GET_GENRES_SUCCESS, GET_GENRES_FAILED } from '@music/actions/actionTypes';
import { IGenreAction, CallableType } from '@music/interfaces';
import { genreModel } from '@music/models';


/* ------------------------------------------------------
 * action creators
 * ------------------------------------------------------
 */
export function genreRequest() {
  return (dispatch: CallableType) => {
    dispatch(fetchSeriesAttempt());

    setTimeout(() => {
      genreModel.all().then((result) => {
        console.log('resultx', result.docs.map((doc: any) => doc.data()));
        dispatch(fetchSeriesSuccess(result.docs.map((doc: any) => doc.data())))
      }).catch(error => {
        dispatch(fetchSeriesFailed());
      })
      // authService.login(formData).then(({ data }) => {
      //   const { user, access_token } = data.data;
      //   loginAfterEvent(data.data);
      //   dispatch(loginSuccess(user));
      //   console.log('access_token', access_token);
      // }).catch((response) => {
      //   if (response.status === 404) {
      //     dispatch(loginFailed({username: ['Kullanıcı adınızı ya da şifrenizi hatalı girdiniz.']}));
      //   }
      //   console.error('response error', response);
      // });
    }, 500);
  };
}

/* ------------------------------------------------------
 * actions
 * ------------------------------------------------------
 */
export function fetchSeriesAttempt(): IGenreAction {
  return {type: GET_GENRES_START};
}

export function fetchSeriesSuccess(data: any): IGenreAction {
  return {
    type: GET_GENRES_SUCCESS,
    loading: false,
    loaded: true,
    data
  };
}

export function fetchSeriesFailed(): IGenreAction {
  return {
    type: GET_GENRES_FAILED,
    loading: false,
    loaded: false
  };
}

export function genreInitialState(data: any) {
  return {
    type: GET_GENRES_SUCCESS,
    loading: false,
    loaded: true,
    data
  };
}
