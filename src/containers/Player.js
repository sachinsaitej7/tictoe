import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {SYMBOLS} from '../constants';

import './game.css';

export default connect(
  store => ({

  }),
  dispatch => bindActionCreators({

  }, dispatch))(class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount () {

    }

    render () {
        const key = this.props.playerNo;
        const name = this.props.name || "Name";
        const currentPlayer = this.props.currentPlayer;
        return (
            <div className="player">
                <h4> {name.substring(0,1).toUpperCase()+name.substring(1)} {currentPlayer === key && <span style={{color:"red"}}><i className="fa fa-star" aria-hidden="true"></i></span>}</h4>
                <label>
                    {key === "player1" ? "Player 1":"Player 2"}
                    <input type="text" placeholder="Name" value={this.props.name} onChange={e => this.props.changeName(key,e.target.value)}></input>
                </label>
                {
                    this.props.multiPlayer && <p style={{fontSize:"24px"}}>You are Playing MultiPlayer Game</p>
                }
                <p>{SYMBOLS[key]}</p>
            </div>
        );
    }
})
