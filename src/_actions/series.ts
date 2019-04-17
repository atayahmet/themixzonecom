import { GET_SERIES_START, GET_SERIES_SUCCESS, GET_SERIES_FAILED } from '@music/actions/actionTypes';
import { IActionPayload, ISeries, CallableType } from '@music/interfaces';
import { seriesModel } from '@music/models';

export interface ISeriesAction extends IActionPayload {
  loading?: boolean;
  loaded?: boolean;
  data?: ISeries[]
}

/* ------------------------------------------------------
 * action creators
 * ------------------------------------------------------
 */
export function seriesRequest() {
  return (dispatch: CallableType) => {
    dispatch(fetchSeriesAttempt());

    setTimeout(() => {
      seriesModel.all().then((result) => {
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

// export function logoutRequest() {
//   return (dispatch: CallableType) => {
//     dispatch(logoutAttempt());

//     setTimeout(() => {
//       localStorage.removeItem('userData');
//       localStorage.removeItem('token');
//       dispatch(logoutSuccess());
//     }, 500)
//   };
// }

/* ------------------------------------------------------
 * actions
 * ------------------------------------------------------
 */
export function fetchSeriesAttempt(): ISeriesAction {
  return {type: GET_SERIES_START};
}

export function fetchSeriesSuccess(data: any): ISeriesAction {
  return {
    type: GET_SERIES_SUCCESS,
    loading: false,
    loaded: true,
    data
  };
}

export function fetchSeriesFailed(): ISeriesAction {
  return {
    type: GET_SERIES_FAILED,
    loading: false,
    loaded: false
  };
}

export function seriesInitialState(data: any) {
  return {
    type: GET_SERIES_SUCCESS,
    loading: false,
    loaded: true,
    data
  };
}
// export const loginAttempt = (data: IUserLoginData) => {
//   return {
//     type: LOGIN_REQUEST,
//     isFetching: true,
//     isLoggedIn: false,
//     data,
//   };
// }

// export const loginSuccess = (data: IUser)  => {
//   return {
//     type: LOGIN_SUCCESS,
//     isFetching: false,
//     isLoggedIn: true,
//     data
//   };
// }

// export const loginFailed = (errors: IKeyValueType) => {
//   return {
//     type: LOGIN_FAILED,
//     isFetching: false,
//     isLoggedIn: false,
//     errors
//   };
// };
