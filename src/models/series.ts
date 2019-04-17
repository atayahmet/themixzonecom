import BaseModel from './base';
import { ISeries } from '../interfaces';

class Series extends BaseModel {
  constructor(attribute: ISeries = {} as ISeries) {
    super([], attribute);
  }

  public getCollection(): string {
    return 'series';
  }
}

export default new Series;
