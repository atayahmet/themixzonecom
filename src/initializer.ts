import * as fb from 'firebase';
import config from '@music/config';

const firebase = fb.initializeApp(config('firebase'));

export {
  firebase
}
