import { IStore } from '../interfaces';
import { firebase } from '@music/initializer';

type WhereClauseType = [[string, string, any]];

export default abstract class BaseModel {
  protected store: IStore[];
  protected attribute = {} as IStore;
  protected collectionRef: firebase.firestore.CollectionReference;

  constructor(store: IStore[], attribute: IStore) {
    this.store = store;
    this.attribute = attribute;
    this.collectionRef = firebase.firestore().collection(this.getCollection());
  }

  public all(): Promise<any> {
    return this.collectionRef.get();
  }

  public find(whereClauses: WhereClauseType, limit: number = -1): Promise<any> {
    const query = this.whereClause(whereClauses);

    return limit > -1 ? query.limit(limit).get() : query.get();
  }

  public async findOne(query: WhereClauseType): Promise<any> {
    return this.find(query, 1);
  }

  private whereClause(clauses: WhereClauseType) {
    let query = this.collectionRef;

    for (const where of clauses) {
      query = query.where.apply(query, where);
    }

    return query;
  }

  abstract getCollection(): string;

  public setAttributes(attribute: IStore = {} as IStore): void {
    this.attribute = {...attribute};
  }

  public setAttribute(attr: string, value: any): void {
    this.attribute = {...this.attribute, [attr]: value};
  }

  public base() {
    return this.collectionRef;
  }
}
