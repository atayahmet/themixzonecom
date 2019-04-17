import * as React from 'react';
import { Image, SemanticSIZES, SemanticICONS, Icon } from 'semantic-ui-react';
import { IconSizeProp } from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import config from '@music/config';
import * as dayjs from 'dayjs';

export interface IImageProviderProps {
  path: Array<string|number>;
  filename: string;
  ext?: string;
  size?: SemanticSIZES;
}

export function ImageProvider(props: IImageProviderProps) {
  const { path, filename, ext = 'jpg' } = props;
  const defaultImage = config('images.defaultImage');
  return (
    <Image src={(!!filename) === false ? defaultImage : path.join('/')+filename+'.'+ext} />
  );
}

export interface IDateProps {
  icon?: boolean;
  format?: string;
  seconds: number;
  size?: IconSizeProp;
}

export function Date({icon, seconds, size = 'large', format = 'DD MMMM YYYY'}: IDateProps) {
  return (
    <>
      <Icon name={(icon  ? 'calendar alternate outline' : '') as SemanticICONS} size={size} />
      {dayjs(seconds * 1000).format(format)}
    </>
  );
}
