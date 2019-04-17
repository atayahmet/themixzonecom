import { GET_LAST_MIX, FETCH_TRACKS_OF_MIX } from '@music/actions/actionTypes';
import { IPlayerAction, IMix, ITrackCue, ITrack, ILabel, MainMixType } from '@music/interfaces';
import { trackModel, labelModel, mixModel } from '@music/models';
import { genresBySeriesGenres } from '../filters';
import { IKeyValueObject } from '@music/interfaces';
import { addMix } from './mixContainer';


/* ------------------------------------------------------
 * action creators
 * ------------------------------------------------------
 */
// Step 1
export function prepareMix(mix: IMix, addToContainer: boolean = false): CallableFunction {
  return (dispatch: CallableFunction, getState: CallableFunction) => {
    dispatch(fetchTracksAttempt());
    Promise.all([...mix.cues.map(async (cue: ITrackCue): Promise<ITrackCue> => {
      const track = {...(await trackModel.base().doc(cue.trackId).get()).data()} as ITrack
      return {...cue, track};
    })]).then(cues => addGenresIfNotExists({...mix, addToContainer, cues})(dispatch, getState));
  };
}

// Step 2
export function addGenresIfNotExists(mix: IMix) {
  return (dispatch: CallableFunction, getState: CallableFunction) => {
    const { genres } = getState();
    const newMix: IMix = {...mix};
    const cues = [...newMix.cues].map((cue: any) => {
      console.log('ERR', genres, cue);
      cue.track.genres = genres.data.filter(genresBySeriesGenres(cue.track.genres));
      return {...cue} as ITrackCue;
    });

    dispatch(addLabelIfNotExists({...mix, cues}));
  }
}

// Step 3
export function addLabelIfNotExists(mix: IMix): CallableFunction {
  return (dispatch: CallableFunction, getState: CallableFunction) => {
    const newMix: IMix = {...mix};
    Promise.all(newMix.cues.map(async (cue: IKeyValueObject) => {
      cue.track.label = {...(await labelModel.base().doc(cue.track.labelId).get()).data()} as ILabel;
      return {...cue} as ITrackCue;
    })).then( cues => {
      const clone = {...mix} as IMix;
      if (clone.addToContainer === true) {
        delete clone.addToContainer;
        dispatch(addMix(clone));
      }
      return clone;
    })
    .then((mix: IMix) => {
      console.log('addLabelIfNotExists', mix);
      // dispatch({...mix, cues})
    })
    .catch(console.error)
  };
}

export function getMixesByLimitRequest(limit: number = 1, orderBy: string = 'desc') {
  return (dispatch: CallableFunction) => {
    mixModel.getLastMixesByLimit('createdAt', 5).then(result => {
      console.log('getMixesByLimitRequest', result);
    });
  };
}

/* ------------------------------------------------------
 * actions
 * ------------------------------------------------------
 */
export function fetchTracksAttempt() {
  return {type: FETCH_TRACKS_OF_MIX};
}

export function fetchLastMix(data: MainMixType): IPlayerAction {
  return {type: GET_LAST_MIX, data };
}

// export function updateLastMix(mix: IMixActionProps): IPlayerAction {
//   return {
//     type: UPDATE_LAST_MIX,
//     ...mix
//   };
// }
