import BaseModel from './base';
import { ITrack } from '../interfaces';

class Track extends BaseModel {
  constructor(attribute: ITrack = {} as ITrack) {
    super([], attribute);
  }

  public getCollection(): string {
    return 'tracks';
  }
}

export default new Track;
