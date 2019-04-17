import BaseModel from './base';
import { ILabel } from '../interfaces';

class Label extends BaseModel {
  constructor(attribute: ILabel = {} as ILabel) {
    super([], attribute);
  }

  public getCollection(): string {
    return 'labels';
  }
}

export default new Label;
