import * as React from 'react';
import { IKeyValueObject, MainMixType, ISeries, IMix, ITrackCue } from '@music/interfaces';
import { Container, Grid, Divider, GridRow, GridColumn, Icon, Popup, Button, Modal, Table } from 'semantic-ui-react';
import Player from './Player';
import { get } from '@music/utils';
import { timeFormat } from '../utils';
import { findOne } from '@music/filters';
import { SoundWaves } from './SoundWaves';
import PlayerTracks from './PlayerTracks';
// import playerService from 'src/_services/playerService';
import { setCurrentTrack } from '../_actions/currentTrack';
import { ITrack } from '../interfaces';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { isEqual } from 'lodash';
import playerService from 'src/_services/playerService';
import { connect } from 'react-redux';
import { setMainMix } from '../_actions/player';

export interface IPlayerContainerProps {
  mix: MainMixType;
  series: ISeries[];
  currentTrack: ITrackCue|undefined;
  container: IMix[];
}

export interface IPlayerContainerState  extends IKeyValueObject{
  series: ISeries|undefined;
  showTrackListModal: boolean;
}

export const firstLoad = () => ({ playing: false, loaded: false, loading: false });
export const loadingState = () => ({ playing: false, loaded: false, loading: true });
export const loadedState = () => ({ playing: false, loaded: true, loading: false });
export const pauseState = () => ({ playing: false });
export const playingState = () => ({ playing: true, loaded: true, loading: false });

class PlayerContainer extends React.Component<IPlayerContainerProps & IKeyValueObject, IPlayerContainerState> {
  constructor(props: IPlayerContainerProps) {
    super(props);
    this.state = {
      series: undefined,
      showTrackListModal: false
    };

    playerService.onLoadedData().subscribe(this.loadedEventHandler);
    playerService.onPause().subscribe(this.pauseEventHandler);
    playerService.onPlay().subscribe(this.playEventHandler);
    playerService.onEnter().subscribe(this.songEnterEventHandler);
  }

  public get hasMix(): boolean {
    return !!this.props.mix && !!this.props.mix.mix && !!this.state.series;
  }

  public get mix(): IMix {
    return this.props.mix.mix;
  }

  public get showTrackList(): boolean {
    return this.state.showTrackListModal;
  }

  public get readyState(): number {
    return playerService.element().readyState;
  }

  public componentDidMount() {
    const series = (findOne((this.props.series || []), { id: this.props.mix.mix.seriesId }) || {}) as ISeries;
    this.setState({ series });
  }

  public componentDidUpdate(prevProps: IPlayerContainerProps) {
    console.log('did update', this.props, prevProps);
    if (isEqual(prevProps.mix, this.props.mix) === false) {
      const mainMix = {...this.props.mix} as MainMixType;
      this.setState({ mainMix });

      const {currentTime = 0} = this.props.mix;

      if(this.props.mix.playing === false && this.props.mix.loading === false) {
        playerService.pause();
      }
      else if (!!this.state.mainMix && this.props.mix.playing === true && (currentTime > 0 || this.readyState >= 2)) {
        playerService.play();
      }
      else if(this.props.mix.loading === true) {
        alert('loading');
        playerService.load(this.props.mix.mix.sourceUrl);
      }
    }
  }

  public render() {
    return  !this.hasMix ? null : (
      <Container fluid className="player-bar-container">
        <Grid columns={3}>
          <Grid.Row verticalAlign="middle" className="container-inside-wrapper">
            <Grid.Column width="3">
              <Grid columns={2} style={{margin: 0}}>
                <GridRow style={{padding: 0}}>
                  <GridColumn width="16">
                    {!!this.state.series && <h3>{this.state.series.name} #{this.mix.count} by DARK</h3>}
                  </GridColumn>
                </GridRow>
              </Grid>
              <Divider style={{height: '50%'}} className="divider-left" vertical />
            </Grid.Column>
            <Grid.Column width="8" className="player-wrapper">
              {this.props.mix &&
                <Player
                  mix={this.props.mix}
                  series={{...this.state.series} as ISeries}
                  currentTrack={this.props.currentTrack ? {...this.props.currentTrack} : undefined}
                />
              }
            </Grid.Column>
            <Grid.Column width="4" style={{height: '100%'}}>
              <div className="player-actions-container">
                <Divider fitted className="divider-right" vertical />
                <Grid relaxed={false} columns={2} padded={false} style={{margin: 0}}>
                  <GridRow style={{height: '100%', padding: 0}}>
                    <GridColumn width="15">
                      <Grid relaxed={false} columns={1} padded={false} style={{margin: 0}}>
                        <GridRow verticalAlign="middle" style={{height: '100%', padding: 0}}>
                          <GridColumn width="16" style={{height: '100%'}} className="player-actions">
                            <Popup trigger={
                                <a onClick={this.modal.bind(this, 'showTrackListModal', true)} href="javascript:;">
                                  <Icon link name="list alternate outline" />
                                </a>
                              } content='Track List' inverted
                            />
                            <Popup trigger={
                                <a onClick={this.download} href="javascript:;">
                                  <Icon link name="download" />
                                </a>
                              } content='Download' inverted
                            />
                            <Popup trigger={
                                <Icon link name="share alternate" />
                              } content={
                                <span>
                                  <Button circular color='facebook' icon='facebook' />
                                  <Button circular color='twitter' icon='twitter' />
                                </span>
                              }
                              inverted
                              on='click'
                            />
                          </GridColumn>
                        </GridRow>
                      </Grid>
                    </GridColumn>
                  </GridRow>
                </Grid>
                <Divider fitted className="divider-left" vertical />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <PlayerTracks
          items={this.props.mix.mix.cues}
          current={{...(this.props.currentTrack || {} as ITrackCue)}}
        />
        <Modal closeOnDimmerClick closeOnEscape dimmer="blurring" size="small" open={this.showTrackList}>
          <Modal.Header>Track List</Modal.Header>
          <Modal.Content>
            <Table basic='very'>
              <Table.Body>
                {this.props.mix.mix.cues.map((cue: ITrackCue, index: number) => (
                  <Table.Row active={cue.trackId === get('currentTrack.trackId', this.props)} key={cue.trackId}>
                    <Table.Cell>{cue.orderNumber}</Table.Cell>
                    <Table.Cell>{get('track.name', cue)}</Table.Cell>
                    <Table.Cell>
                      <SoundWaves
                        color="#0cc5be"
                        active={cue.trackId === get('currentTrack.trackId', this.props)}
                      />
                    </Table.Cell>
                    <Table.Cell>{timeFormat(cue.startTime)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Modal.Content>
          <Modal.Actions>
            <Button positive icon='checkmark' onClick={this.modal.bind(this, 'showTrackListModal', false)} labelPosition='right' content='Close' />
          </Modal.Actions>
        </Modal>
      </Container>
    );
  }

  private download = () => {
    window.open(this.props.mix.mix.sourceUrl, '_blank');
  }

  private modal = (prop: string, val: boolean) => {
    this.setState({[prop]: val});
  }

  private loadedEventHandler = () => {
    const mainMix = {
      mix: {...this.props.mix.mix},
      ...loadedState(),
    } as MainMixType;

    this.setState({mainMix});

    playerService.addCues(this.props.mix.mix.cues);

    if (this.props.mix.forcePlay === true) {
      playerService.play();
    }
  };

  private pauseEventHandler = () => {
    const mainMix = {
      ...this.props.mix,
      ...pauseState()
    } as MainMixType;
    this.setState({mainMix}, () => this.props.setMainMix({...mainMix}));
  };

  private playEventHandler = () => {
    const mainMix = {
      mix: {...this.props.mix.mix},
      ...playingState()
    } as MainMixType;
    this.setState({mainMix}, () => this.props.setMainMix({...mainMix}));
  };

  private songEnterEventHandler = (result: TextTrackCue) => {
    const track = this.props.mix.mix.cues.find((c: ITrackCue) => c.trackId === result.id);
    console.log('enter', track, result);
    if (!!track) {
      this.props.setCurrentMix(track);
    }
  }
}

// export default PlayerContainer;
const mapDispatchToProps = (dispatch: CallableFunction) => {
  return {
    setCurrentMix: (track: ITrack) => dispatch(setCurrentTrack({...track})),
    setMainMix: (mix: MainMixType) => dispatch(setMainMix({...mix})),
  }
};

export default connect(null, mapDispatchToProps)(PlayerContainer);

