import * as React from 'react';
import { Subject, interval } from 'rxjs';
import { takeWhile, switchMap } from 'rxjs/operators';
import { IKeyValueObject, MainMixType, ITrackCue, ITrack, ISeries } from '@music/interfaces';
import { Icon, Grid, GridRow, GridColumn } from 'semantic-ui-react';
import { PlayerTimeline } from './PlayerTimeline';
import { SoundWaves } from './SoundWaves';
import { PlayerLoader } from './PlayerLoader';
import playerService from 'src/_services/playerService';
import { timeFormat } from '@music/utils';
import config from '@music/config';

export interface IPlayerProps {
  mix: MainMixType;
  currentTrack: ITrackCue|undefined;
  series: ISeries;
};

export interface IPlayerState {
  duration: string;
  elapsedTime: string;
  progress: number;
};

class Player extends React.Component<IPlayerProps & IKeyValueObject, IPlayerState> {
  public state: Readonly<IPlayerState> = {
    duration: '',
    elapsedTime: '',
    progress: 0
  };
  private intervalSubject$: Subject<any> = new Subject;
  constructor(props: IPlayerProps) {
    super(props);
    this.intervalSubject$.asObservable()
      .pipe(switchMap((ev) => interval(1000).pipe(takeWhile(() => this.isPlaying))))
      .subscribe(() => this.setTime());
  }

  public get isLoading(): boolean {
    return this.props.mix.loading === true;
  }

  public get isPlaying(): boolean {
    return this.props.mix.playing === true;
  }

  public get duration(): number {
    return playerService.element().duration || (this.props.mix.duration || 0);
  }

  public get track(): ITrack {
    return !this.props.currentTrack ? {} as ITrack : (this.props.currentTrack.track || {} as ITrack);
  }

  public componentDidMount() {
    const { currentTime, duration } = this.props.mix;

    if (currentTime && duration) {
      this.setTime({ currentTime, duration });
    }
  }

  public componentDidUpdate() {
    this.intervalSubject$.next();
  }

  public render() {
    return (
      <>
      <div className="player-bar">
        <Grid columns={5}>
          <GridRow verticalAlign="middle">
            <GridColumn width="1">
              <img
                className="track-cover"
                width="53"
                src={config(`images.${this.props.series.slug}.${this.props.mix.mix.image}`)}
              />
            </GridColumn>
            <GridColumn textAlign="center" width="1" style={{marginRight: '3px', height: '43px'}}>
              <PlayerLoader width={30} active={this.isLoading} />
              {!this.isLoading &&
                <a href="javascript:;" onClick={(this.isPlaying ? this.pause : this.play)}>
                  <Icon name={this.isPlaying ? 'pause' : 'play'} />
                </a>
              }
            </GridColumn>
            <GridColumn className="elapsed" textAlign="center" style={{width: '3%'}}>{this.state.elapsedTime}</GridColumn>
            <GridColumn width="11" style={{marginLeft: '10px'}}>
              <Grid columns={2}>
                <GridRow style={{top: '-8px'}}>
                  <GridColumn width="1" verticalAlign="top">
                    <SoundWaves active={this.isPlaying} />
                  </GridColumn>
                  <GridColumn width="14">
                    <div className="song">
                      {(this.props.currentTrack && this.isPlaying) &&
                        <>
                        <span>{this.props.currentTrack.orderNumber}. {this.track.name}</span>
                        {' - '}
                        <a href="javascript:;" onClick={this.info}>more</a>
                        </>
                      }
                    </div>
                  </GridColumn>
                </GridRow>
              </Grid>
              <PlayerTimeline
                {...this.props.mix}
                onSeek={this.seekHandler}
                progress={this.state.progress}
              />
            </GridColumn>
            <GridColumn textAlign="center" width="1">{timeFormat(this.duration)}</GridColumn>
          </GridRow>
        </Grid>
      </div>
      </>
    );
  }

  private play = () => {
    playerService.play();
  };

  private pause = () => {
    playerService.pause();
  };

  private setTime = (time: IKeyValueObject = playerService.element()) => {
    const { duration, currentTime } = time;
    this.setState({
      duration: timeFormat(duration),
      elapsedTime: timeFormat(currentTime),
      progress: ((currentTime / duration) * 100)
    });

    if (~~currentTime % 2) {
      localStorage.setItem('incomplete', JSON.stringify({duration, currentTime, ...this.props.mix}));
    }
  };

  private seekHandler = (e: any) => {
    const event = {...e};
    const offset = event.target.getClientRects()[0];
    const posLeft = event.clientX - offset.left;
    const clientWidth = event.target.clientWidth;
    const { duration } = playerService.element();
    const percent = ((posLeft / clientWidth) * 100);

    this.setTime({
      duration,
      currentTime: ((duration * percent) / 100) - 47
    });
    playerService.element().currentTime = ((duration / 100) * percent) - 10;
  };

  private info = () => {
    console.log(this.props.currentTrack);
  };
}

export default Player;
