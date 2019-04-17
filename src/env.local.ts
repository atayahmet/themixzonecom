export default {
  envName: 'local',
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
    defaultImage: '/pictures/default.jpg',
    kaboom: {
      '53x53': '/pictures/kaboom/53x53.jpg',
      '300x300': '/pictures/kaboom/300x300.jpg',
    },
    'trance-symphony': {

    }
  }
};
