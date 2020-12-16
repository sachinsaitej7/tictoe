import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import './App.css';
import { ToastContainer } from 'react-toastify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';  // material ui components require a theme
import 'bootstrap/dist/css/bootstrap.min.css';
import Game from './containers/Game';
import Peer from 'peerjs';


export default connect(
  store => ({

  }),
  dispatch => bindActionCreators({

  },dispatch))
(class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      peerId: ""
    }
    this.peer = {};
  }

  componentWillMount() {
    this.peer = new Peer();
    this.peer.on('open', (id) => {
      this.setState({
        peerId: id
      })
    });

  }


  componentDidCatch(error, errorInfo) {

  }

  componentWillReceiveProps(nextProps) {
    
  }

  

  render() {

    return (
      <MuiThemeProvider>
        <div className="App">
            <Game peer={this.peer} peerId={this.state.peerId}></Game>
        </div>
      </MuiThemeProvider>
    );
  }
})
