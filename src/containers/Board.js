import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {SYMBOLS} from '../constants';
import {pushData} from '../redux/modules/peer';

import './game.css';

export default connect(
  store => ({

  }),
  dispatch => bindActionCreators({

  }, dispatch))(class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendId: ""
        }
    }

    componentDidMount () {

    }

    render () {
        const blocks = this.props.blocks;
        const size = this.props.size;
        const length = this.props.lineSize;
        const value = SYMBOLS[this.props.currentPlayer];
        const selectedBlocks = this.props.selectedBlocks;
        const peerId = this.props.peerId;
        return (
            <div>
                <h4 className="board-heading">
                    TIC TAC TOE
                    {
                        peerId &&
                        <span style={{marginLeft:"10px",color:"green"}}>
                            (ID: {peerId})
                        </span>
                    }

                </h4>
                <div className="board-wrapper">
                    {
                        
                        blocks.map(row => {
                            return (
                                <button key={row} disabled={this.props.matchResult || selectedBlocks[row]} 
                                className='block' style={{height:`${100/size}%`, width:`${100/size}%`}} 
                                onClick={() => this.props.onClick(row,value)}>
                                {selectedBlocks[row] === "undefined" ? "": selectedBlocks[row]}
                                </button>
                            )
                        })
                    }
                </div>
                <div className="board-footer">
                    <div style={{display:"flex", flexDirection:"column"}}>
                        <label>
                            Board Size(Min 3X3):
                            <input type="number" min="3" max="20" placeholder="Size" value={size} onChange={e => this.props.generateBoard(e.target.value)}></input>
                        </label>
                        <label>
                            Line Size(Min 3):
                            <input type="number" min="3" max={size} placeholder="Line" value={length} onChange={e => this.props.changeName("lineSize",e.target.value)}></input>
                        </label>
                        <label>
                         Other ID:
                            <input type="text" placeholder="Friend ID" value={this.state.friendId} onChange={e => this.setState({friendId: e.target.value})}></input>
                            <button disabled={!this.state.friendId} style={{marginLeft:"4px"}} onClick={() => this.props.connectOthers(this.state.friendId)}>Connect</button>
                        </label>
                    </div>
                    <div className="match-result">
                        <div>Match Result: {this.props.matchResult && <span > {this.props.matchResult}!!</span>}</div>
                        <button onClick={() => this.props.resetGame()}> Reset Game</button>
                    </div>
                </div>
            </div>
        );
    }
})
