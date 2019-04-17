import * as React from 'react';
import { Segment, Container, Header, Grid, Dropdown, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { parseDuration, get } from '@music/utils';
import { findOne } from '@music/filters';
import { Date } from '@music/components/helpers';
import { ISeries, IGenre, IMix, IKeyValueObject } from '@music/interfaces';
import { MainMixType, IState } from '../interfaces';
import { connect } from 'react-redux';
import { prepareMix } from '../_actions/mix';
import { setMainMix } from '../_actions/player';
import playerService from 'src/_services/playerService';
import { loadingState, playingState } from './PlayerContainer';
import config from '@music/config';

interface IMixBoxProps {
  data: IMix[];
  series: ISeries[];
  genres: IGenre[];
  mainMix: MainMixType;
  container: IMix[];
  prepareMix: (mix: IMix, addToContainer: boolean) => any;
  setMainMix: (mix: MainMixType) => any;
}

interface IPlayButtonProps {
  onPlay: (mix: IMix, resume: boolean) => any;
  onPause: (mix: IMix) => any;
  current: MainMixType;
  mix: IMix;
  series: ISeries;
}

function PlayButton({onPlay, onPause, current, mix, series}: IPlayButtonProps) {
  const isSameWithCurrentMix = (!!current.mix && current.mix.id === mix.id && current.playing);
  const setPlayerState = (mix: IMix) => () => {
    if (isSameWithCurrentMix) {
      onPause({...mix});
    } else {
      onPlay({...mix}, (get('mix.id', current) === mix.id));
    }
  }

  return (
    <a onClick={setPlayerState(mix)}>
      <Icon
        link
        size="big"
        name={(isSameWithCurrentMix ? 'pause circle' : 'play circle')}
      />
      {series.name} #{mix.count}
    </a>
  )
}

class MixBox extends React.Component<IMixBoxProps, any> {
  public state: Readonly<IKeyValueObject> = {
    data: null,
  };

  constructor(props: any) {
    super(props);
  }

  private get readyState(): number {
    return playerService.element().readyState;
  }

  public isCurrent(mix: IMix): boolean {
    const { mainMix } = this.props;
    return !!mainMix.mix && mainMix.mix.id === mix.id;
  }

  public render() {
    const options = [
      { key: 'user', text: 'Share', icon: 'share' }
    ];

    return (
      <Segment style={{height: '600px'}} className="toptracks-container">
        <Container>
          <Header size='medium'>Top Mixes</Header>
          <Grid columns='equal'>
            {this.props.data && this.props.data.map((mix: IMix, index: number) => {
              const series = (findOne(this.props.series, { id: mix.seriesId }) || {}) as ISeries;
              return (
                <Grid.Row style={(this.isCurrent(mix) ? {backgroundColor: '#e4f5f7'} : {})} key={mix.id} textAlign='center' verticalAlign="middle">
                  <Grid.Column widescreen="1" className="thumbnail">
                    <Segment>
                      <img src={config(`images.${series.slug}.${mix.image}`)} />
                    </Segment>
                  </Grid.Column>
                  <Grid.Column widescreen="1" mobile="1">
                    <Segment>
                      {index + 1}.
                    </Segment>
                  </Grid.Column>
                  <Grid.Column className="title" textAlign="left" tablet="5" widescreen="4" mobile="5">
                    <Segment>
                      <PlayButton
                        mix={mix}
                        series={series}
                        onPlay={this.play}
                        onPause={this.pause}
                        current={this.props.mainMix}
                      />
                    </Segment>
                  </Grid.Column>
                  <Grid.Column className="title" textAlign="left" tablet="3" widescreen="2" mobile="3">
                    <Segment>
                      <Date seconds={mix.createdAt.seconds} icon={true} />
                    </Segment>
                  </Grid.Column>
                  <Grid.Column className="duration" widescreen="2" tablet="2" mobile="1">
                    <Segment textAlign="center">
                      <Icon name="clock outline" size="large" link />
                      {this.duration(mix.duration)}
                    </Segment>
                  </Grid.Column>
                  <Grid.Column className="action" widescreen="1" tablet="2" mobile="2">
                    <Dropdown direction="left" text="..." options={options} pointing='top left' icon={null} />
                  </Grid.Column>
                </Grid.Row>
              )
            })}
          </Grid>
        </Container>
      </Segment>
    );
  }

  private play = (mix: IMix, resume: boolean = false) => {
    const { id } = mix;

    const actionData = (mix: IMix, play: boolean = false) => ({mix: {...mix}, ...(play ? playingState() : loadingState())} as MainMixType);

    // find mix in container
    const preparedMix = findOne((this.props.container || []), {id}) as IMix;

    // If there is no mix in the container.
    // prepare and add the mix to container.
    if (!preparedMix) {
      this.props.prepareMix({...mix}, true);
      setTimeout(() => {
        const mix = findOne((this.props.container || []), {id}) as IMix;
        const ready = (get('mainMix.mix.id', this.props) === mix.id && this.readyState > 2);

        if (ready === true) {
          playerService.play();
        } else {
          const mainMix = actionData(mix);
          this.setState({mainMix}, () => this.props.setMainMix({...mainMix, forcePlay: true}));
          playerService.load(mix.sourceUrl);
        }
      }, 1000);
      return;
    }

    // check the equality desired mix with main mix.
    // if player state greater than 2.
    const isIncompletedMixReady = (!!preparedMix && get('mainMix.mix.id', this.props) === preparedMix.id && this.readyState > 2);

    // update player store
    this.props.setMainMix({
      ...this.props.mainMix,
      forcePlay: true,
      ...actionData(preparedMix, isIncompletedMixReady),
    });
  }

  private pause = () => {
    playerService.pause();
  }

  private duration(duration: number) {
    const { hour, minute, second } = parseDuration(duration);
    return `${(hour || '00')}:${minute}:${second}`;
  }
}

const mapStateToProps = (state: IState) => {
  return {
    mainMix: {...state.player},
    series: [...state.series.data],
    genres: [...state.genres.data],
    container: [...state.mixContainer.data]
  };
};

const mapDispatchToProps = (dispatch: CallableFunction) => {
  return {
    prepareMix: (mix: IMix, addToContainer: boolean) => dispatch(prepareMix(mix, addToContainer)),
    setMainMix: (mix: MainMixType) => dispatch(setMainMix({...mix}))
  }
};

const MixBoxComponent = connect(mapStateToProps, mapDispatchToProps)(withRouter(MixBox));

export default MixBoxComponent;
