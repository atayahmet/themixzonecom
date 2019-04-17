import sift from 'sift';
import { IKeyValueObject } from '@music/interfaces';

/**
 * Filter genres by genre id of series
 * @param genres string[]
 */
export const genresBySeriesGenres = (genres: string[]) => {
  return sift({
    id: { $in: genres}
  } as any);
}

export const findOne = (data: any[], selector: IKeyValueObject = {}): IKeyValueObject => {
  return data.filter(sift(selector as any))[0];
};
