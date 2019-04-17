export type CallableType = (args?: any) => void;

export interface IKeyValueObject {
  [prop: string]: any;
}

export interface IActionPayload extends IKeyValueObject {
  type: string;
};

export interface IGenreAction extends IActionPayload {
  loading?: boolean;
  loaded?: boolean;
  data?: IGenre[]
}

export interface IPlayerAction extends IActionPayload {
  loading?: boolean;
  loaded?: boolean;
  data?: MainMixType;
}

export interface IMix extends IStore {
  count: number;
  createdAt: {seconds: number};
  image: string;
  sourceId: string;
  sourceUrl: string;
  seriesId: IReferenceId;
  duration: number;
  cues: ITrackCue[];
}

export interface IGenre extends IStore {
  name: string;
  slug: string;
  icon: string;
  detail?: string;
}

export interface ILabel extends IStore {
  name: string;
  slug: string;
  detailUrl: string;
  imageUrl: string;
}

export interface ISeries extends IStore {
  name: string;
  slug: string;
  count: number;
  genres: string[];
  icon: string;
}

export interface ITrack extends IStore {
  name: string;
  detailUrl: string;
  imageUrl: string;
  labelId: string;
  label?: ILabel;
  releaseDate: IFirebaseTimestampInt;
  genres: string[]|IKeyValueObject[];
}

export interface ITrackCue extends IKeyValueObject {
  startTime: number;
  endTime: number;
  orderNumber: number;
  trackId: string;
  track?: ITrack;
}

export interface ITrackCueExtra {
  name: string;
  detail?: string;
  image?: string;
  label?: string;
  releaseDate?: string;
  genres: string[];
}

export interface IFirebaseTimestampInt {
  seconds: number;
  nanoseconds: number;
}

export interface IShowcaseProps {
  mix: IMix;
  genres: IGenre[];
  series: ISeries;
}

export interface IStore extends IKeyValueObject {
  id: string;
}

export interface IReferenceId extends IObjectId {}
export interface IObjectId {
  toString(): string;
  get(): string;
}

export type MainMixType = {
  mix: IMix;
  playing: boolean;
  loading: boolean;
  loaded: boolean;
  forcePlay?: boolean;
  currentTime?:number;
  duration?: number;
};

export interface IState {
  player: MainMixType,
  genres: {data: IGenre[]};
  series: {data: ISeries[]};
  mixContainer: { data: IMix[] };
  currentTrack: ITrack;
}
