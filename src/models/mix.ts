import BaseModel from './base';
import { IMix } from '../interfaces';

class Mix extends BaseModel {
  protected attribute: IMix;

  constructor(attribute: IMix = {} as IMix) {
    super([], attribute);
  }

  // public series(seriesId?: IObjectId): ISeries {
  //   return seriesModel.findByObjectId(seriesId || this.attribute.seriesId) as ISeries;
  // }

  public getCollection(): string {
    return 'mixes';
  }

  public getLastMix(limit: number = 1): Promise<any> {
    return this.base().where('status', '==', 1).orderBy("count", "desc").limit(limit).get();
  }

  public getLastMixesByLimit(field: string, limit: number = 1): Promise<any> {
    return this.base().where('status', '==', 1).orderBy(field, "desc").limit(limit).get();
  }
}

export default new Mix;
