import { combineReducers } from 'redux';
import series from '@music/reducers/series';
import genres from '@music/reducers/genre';
import player from '@music/reducers/player';
import mixContainer from '@music/reducers/mixContainer';
import currentTrack from '@music/reducers/currentTrack'
import { lastMixReducer } from '@music/reducers/mix';

export default combineReducers({
  series,
  genres,
  player,
  mixContainer,
  lastMix: lastMixReducer,
  currentTrack
})
