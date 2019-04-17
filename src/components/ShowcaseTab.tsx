import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import { IKeyValueObject } from '../interfaces';

export default function ShowcaseTab(props: IKeyValueObject) {
  return (
    <div className="showcase-tabs-container">
      <Menu pointing secondary>
        {props.items.map((item: IKeyValueObject, index: number) => {
          return (
            <a className={(item.key === props.active) ? 'active' : ''} href="" key={item.key}>{item.name.toUpperCase()}</a>
          );
        })}
      </Menu>
    </div>
  );
}
