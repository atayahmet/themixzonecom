import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import './App.css';
import IndexPage from './pages/Index';
import PlayerContainer from './components/PlayerContainer';
import { connect } from 'react-redux';
import { IState, IKeyValueObject, ISeries, MainMixType, ITrackCue, IMix } from './interfaces';

interface IAppProps {
  mainMix: MainMixType;
  series: ISeries[];
  currentTrack: ITrackCue|undefined;
  container: IMix[];
}

class App extends React.Component<IAppProps, IKeyValueObject> {
  constructor(props: IAppProps) {
    super(props);
  }

  public get isContainerReady() {
    return (!!this.props.series && !!this.props.mainMix.mix);
  }

  public render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Container fluid>
          <Switch>
            <Route exact path="/" component={IndexPage} />
          </Switch>
          {this.isContainerReady &&
            <PlayerContainer
              series={this.props.series}
              mix={{...this.props.mainMix}}
              container={this.props.container}
              currentTrack={this.props.currentTrack}
            />
          }
        </Container>
      </Router>
    );
  }
}

const mapStateToProps = (state: IState, ownProps: IKeyValueObject) => {
  return {
    mainMix: state.player,
    series: state.series.data,
    container: [...state.mixContainer.data],
    currentTrack: Object.keys(state.currentTrack).length > 0 ? {...state.currentTrack} : undefined,
  }
};

export default connect(mapStateToProps, null)(App as any);
