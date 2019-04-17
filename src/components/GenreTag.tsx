import * as React from 'react';
import { Label } from 'semantic-ui-react';

export default function GenreTag(props: any) {
  return (<Label className="genre-tag">{props.text}</Label>)
}
