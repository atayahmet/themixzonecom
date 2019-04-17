import * as React from 'react';
import { Sidebar, Menu, Container, Responsive, Icon } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';

import { IGenre, ISeries } from '@music/interfaces';
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';
import { connect } from 'react-redux';

class SidebarComponent extends React.Component<any, any> {
  public series: any;

  constructor(props: any) {
    super(props);

    this.state = {
      visible: !(window.innerWidth < 900),
      fluid: false,
      genres: props.genres,
      series: props.series
    };
  }

  public handleItemClick = (e: any) => {
    console.log('handleItemClick', e);
  }

  public toggleClick = () => this.setState({ visible: !this.state.visible });
  public handleSidebarHide = () => this.setState({ visible: false, fluid: true });
  public handleSidebarShow = () => this.setState({ visible: true, fluid: false });
  public handleSiderbarUpdate = (e: any, data: any) => {
    if (data.width < 900) {
      this.setState({ visible: false, fluid: true });
    } else {
      this.setState({ visible: true, fluid: false });
    }
    // console.log(e, data.width);
  }

  public render() {
    const { visible, fluid } = this.state;
    return (
      <div className="sidebar-container">
        {/* <Button.Group>
          <Button disabled={visible} onClick={this.handleShowClick}>
            Show sidebar
          </Button>
          <Button disabled={!visible} onClick={this.handleHideClick}>
            Hide sidebar
          </Button>
        </Button.Group> */}
          <Sidebar.Pushable>
            <Icon onClick={this.toggleClick} name="bars" link />
            <Responsive onUpdate={this.handleSiderbarUpdate}>
              <Sidebar
                onHide={this.handleSidebarHide}
                onShow={this.handleSidebarShow}
                as={Menu}
                animation='push'
                icon='labeled'
                vertical
                visible={visible}
                width='thin'>
                <Menu.Item position="left">
                  <NavLink key={'home'} exact={true} to={'/go'}>
                    <Icon style={{color: '#7986CB'}} link={true} size="large" name="home" />
                    Home
                  </NavLink>
                </Menu.Item>
                <Menu.Header>Mix Series</Menu.Header>
                {this.state.series && this.state.series.data.map((series: ISeries, index: number) => {
                    return (
                      <Menu.Item key={series.id} position="left">
                        <NavLink exact={true} to={`/series/${series.slug}`}>
                          <Icon style={{color: '#7986CB'}} link={true} size="large" name={series.icon as SemanticICONS} />
                          {series.name}
                        </NavLink>
                      </Menu.Item>
                    )
                  }
                )}
                <Menu.Header>Genres</Menu.Header>
                { this.state.genres && this.state.genres.data.map((genre: IGenre, index: number) => {
                    return (
                      <Menu.Item key={genre.id} position="left">
                        <NavLink exact={true} to={`/genres/${genre.slug}`}>
                          <Icon style={{color: '#7986CB'}} link={true} size="large" name={genre.icon as SemanticICONS} />
                          {genre.name}
                        </NavLink>
                      </Menu.Item>
                    );
                  })
                }
                <Menu.Header>Lastly Added Items</Menu.Header>
              </Sidebar>
            </Responsive>

            <Sidebar.Pusher fluid={fluid} as={Container}>
              {this.props.children}
            </Sidebar.Pusher>

          </Sidebar.Pushable>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    genres: {...state.genres},
    series: {...state.series},
  };
};

export default connect(mapStateToProps)(withRouter(SidebarComponent));
