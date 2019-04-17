import { get } from './utils';

import ProdEnv from './env.prod';
import StageEnv from './env.stage';
import LocalEnv from './env.local';

const environments = {
  'env.prod': ProdEnv,
  'env.stage': StageEnv,
  'env.local': LocalEnv,
};

const statePatterns = {
  'env.prod': /themixzone\.com/,
  'env.local': /localhost:3000/,
  'env.stage': /atayahmet\.com\/music/,
}

let environment = {};

for (const env in statePatterns) {
  if ((new RegExp(statePatterns[env])).test(location.href)) {
    environment = environments[env];
    break;
  }
}

const config = {
  sourceBaseUrl: 'https://drive.google.com/file/d',
  driveUserId: '108551373121068118059',
  sources: [
    {
      name: 'Google Drive',
      type: 1
    },
    {
      name: 'Sound Cloud',
      type: 2
    },
  ],
  firebase: {
    apiKey: "AIzaSyBtr1VFAEhT86xGJahM4NUSXKjyAKMtoqk",
    authDomain: "webplayer-230614.firebaseapp.com",
    databaseURL: "https://webplayer-230614.firebaseio.com",
    projectId: "webplayer-230614",
    storageBucket: "webplayer-230614.appspot.com",
    messagingSenderId: "357191565883"
  },
  images: {
    defaultImage: '/music/pictures/default.jpg'
  },
  ...environment
};

export { config };
export default (path: string) => get(path, config);
