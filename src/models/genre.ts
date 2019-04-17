import BaseModel from './base';
import { IGenre } from '../interfaces';

class Genre extends BaseModel {
  constructor(attribute: IGenre = {} as IGenre) {
    super([], attribute);
  }

  public getCollection(): string {
    return 'genres';
  }
}

export default new Genre;
