import { IReferenceId, IObjectId, IKeyValueObject } from './interfaces';
import { IMix, ISeries } from '@music/interfaces';

export function moveIdToDoc(doc: any) {
  return {
    id: doc.id,
    ...doc.data()
  }
}

export function addSeries(series: ISeries[], mix: IMix) {
  return mix;
}

export function ObjectId(id: string): IObjectId {
  return {
    toString: () => id,
    get: () => id
  }
}

export function ReferenceId(id: string): IReferenceId {
  return {
    toString: () => id,
    get: () => id
  }
}

export const parseDuration = (duration: number): IKeyValueObject => {
  let times = {};
  const unitOfTimesAsSeconds = {
    _hour: 60 * 60,
    _minute: 60,
    _second: 1,
  };

  for (const key in unitOfTimesAsSeconds) {
    const seconds = unitOfTimesAsSeconds[key];
    const unit = Math.floor(duration / seconds);

    if (unit >= 1) {
      times = {
        ...times,
        [key]: ('0'+String(unit)).substr(-2),
        get [key.substr(1)]() {
          return this[key] || '';
        }
      };
      duration -= (unit * seconds);
    }
  }

  return {...times};
}

export function has(path: string, data: object): boolean {
  return !!get(path, data)
}

export function get(path: string, data: object): any {
  return path.split('.').reduce((result, key) => result ? result[key] : {}, data);
}

export function timeFormat(time: number): string
{
  // Hours, minutes and seconds
  var hrs = ~~(time / 3600);
  var mins = ~~((time % 3600) / 60);
  var secs = ~~time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";

  if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}

export function parseTrack(track: string): IKeyValueObject {
  const [producer, name] = track.split(/\s\-\s/);
  return {producer, name};
}
