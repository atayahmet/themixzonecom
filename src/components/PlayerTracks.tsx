import * as React from 'react';
import { Container } from 'semantic-ui-react';
import Slider, { Settings } from 'react-slick';
import { ITrackCue } from '@music/interfaces';
import { get, parseTrack } from '@music/utils';

const settings = {
  speed: 500,
  dots: false,
  touchMove: true,
  infinite: false,
  slidesToShow: 5,
  slidesToScroll: 5
} as Settings;

export default function PlayerTracks({ current, items }: {current: ITrackCue, items: ITrackCue[]|undefined}) {
  return (
    <Container className="tracks-container">
      <Slider {...settings}>
        {(items || []).map((cue, index: number) => (
          <div key={index} className={'track-item' + (current.trackId === cue.trackId ? ' shadow' : '')}>
            <div className="track-cover">
              <img src={get('track.source.imageUrl', cue)} height="100%" />
            </div>
            <div className="track-info">
              <h3>{parseTrack(get('track.name', cue)).name}</h3>
              <span>{parseTrack(get('track.name', cue)).producer}</span>
            </div>
          </div>
        ))}
      </Slider>
    </Container>
  );
}
