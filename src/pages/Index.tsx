import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SidebarComponent from './../layouts/Sidebar';
import { IKeyValueObject, IMix, ISeries, IState, MainMixType, ITrack } from '@music/interfaces';
import { IGenre } from '../interfaces';
import MixBox from '@music/components/MixBox';
import { mixModel } from '@music/models';
import { moveIdToDoc, addSeries } from '../utils';
import { prepareMix } from '@music/actions/mix';
import playerService from 'src/_services/playerService';
import { setMainMix } from '@music/actions/player';
import { setCurrentTrack } from '@music/actions/currentTrack';
import { addMix } from '../_actions/mixContainer';
import { firstLoad } from '@music/components/PlayerContainer';


interface IIndexPageProps extends IKeyValueObject {
  mainMix: IMix;
  series: { data: ISeries[] };
  genres: {data: IGenre[] };
  container: IMix[];
  addMix: (mix: IMix) => any;
  prepareMix: (mix: IMix, addToContainer: boolean) => any;
  setMainMix: (mix: MainMixType) => any;
  setCurrentMix: (track: ITrack) => any;
  updateLastMix: (mix: IMix) => any;
  play: () => any;
  load: (src: string) => any;
}

interface IIndexPageState {
  from: string;
  currentMainMixId: string;
  topMixes: IMix[];
  mainMix: MainMixType;
  currentMainMixState: IKeyValueObject;
}

class IndexPage extends React.Component<IIndexPageProps & any, IIndexPageState> {
  public state: IIndexPageState = {
    from: '',
    topMixes: [],
    currentMainMixId: '',
    mainMix: {} as MainMixType,
    currentMainMixState: {} as IKeyValueObject
  };

  constructor(props: IIndexPageProps) {
    super(props);
  }

  public componentDidMount() {
    mixModel.getLastMixesByLimit('createdAt', 5).then(({ docs } : {docs: any[]}) => {
      const series = this.props.series.data;
      const topMixes = docs.map(moveIdToDoc).map(addSeries.bind(null, series)) as IMix[];
      const mainMix = JSON.parse(localStorage.getItem('incomplete') || '{}') as MainMixType;

      if (mainMix.mix) {
        this.setState({
          mainMix,
          topMixes,
          currentMainMixId: mainMix.mix.id,
          currentMainMixState: {...firstLoad()}
        }, () => {
          this.props.setMainMix({...mainMix, ...firstLoad()});
          this.props.addMix(mainMix.mix);
          playerService.element().currentTime = (mainMix.currentTime || 0);
          playerService.load(mainMix.mix.sourceUrl);
          playerService.addCues(mainMix.mix.cues);
        });
      } else {
        this.setState({ topMixes});
      }
    });
  }

  public render() {
    return (
      <div>
        <SidebarComponent>
          {/* {this.props.series.data.length > 0 && 'id' in this.props.lastMix.data &&
            <Showcase
              mix={this.state.lastMix}
              series={findOne(this.props.series.data, { id: this.props.lastMix.data.seriesId }) as ISeries}
              genres={this.props.genres.data}
            />
          } */}

          {/* Top mixes section */}
          <React.Suspense fallback={<div>Yükleniyor...</div>}>
            { this.state.topMixes &&
              <MixBox data={[...this.state.topMixes]} />
            }
          </React.Suspense>
        </SidebarComponent>
      </div>
    )
  }
}

const mapStateToProps = (state: IState) => {
  return {
    series: {...state.series},
    genres: {...state.genres},
    mainMix: {...state.player},
    container: [...state.mixContainer.data]
    // lastMix: {...state.lastMix},
  };
};

const mapDispatchToProps = (dispatch: CallableFunction) => {
  return {
    prepareMix: (mix: IMix, addToContainer: boolean) => dispatch(prepareMix(mix, addToContainer)),
    setMainMix: (mix: MainMixType) => dispatch(setMainMix({...mix})),
    setCurrentMix: (track: ITrack) => dispatch(setCurrentTrack({...track})),
    addMix: (mix: IMix) => dispatch(addMix({...mix}))
  }
};

const IndexPageComponent = connect(mapStateToProps, mapDispatchToProps)(withRouter(IndexPage));

export default IndexPageComponent;
