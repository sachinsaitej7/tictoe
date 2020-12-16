import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Aux from '../hoc/Aux';
import Player from '../containers/Player';
import Board from '../containers/Board';
import {pushData,syncData,setConnection} from '../redux/modules/peer';
import { toast } from 'react-toastify';

import './game.css';


export default connect(
  store => ({
    data: store.peer.data,
    conn: store.peer.connection
  }),
  dispatch => bindActionCreators({
    pushData,
    syncData,
    setConnection,
  }, dispatch))(class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            player1: "",
            player2: "",
            currentPlayer: "player1",
            value: "",
            board: [1,2,3,4,5,6,7,8,9],
            size: 3,
            lineSize: 3,
            selectedBlocks: {},
            matchResult: "",
            turn: "",
        };
        this.wholeBoard = [];
    }

    componentDidMount () {
        this.generateBoard(this.state.size);
        if(this.props.peer){
            this.props.peer.on('connection', (conn) => {
                if(conn){
                    conn.on('open', () => {
                        conn.on('data', (data) => {
                          this.syncData(data);
                        });
                      
                    });
                    this.props.setConnection(conn);
                }
            });
        }

    }

    changePlayer = () => {
        this.setState(prevState => {
            if(this.state.multiPlayer)
                this.props.conn.send({
                    currentPlayer: prevState.currentPlayer === "player1" ? "player2" : "player1"
                })
            return{
                currentPlayer: prevState.currentPlayer === "player1" ? "player2" : "player1"
            }
        })
    }

    connectOther = (otherId) => {
        const conn = this.props.peer.connect(otherId);
        conn.on('open', () => {
            this.setState({
                multiPlayer: true,
                turn: "player1"
            });
            this.props.setConnection(conn);
            conn.on('data', (data) => {
                this.syncData(data);
            });
            conn.send({
                multiPlayer: true,
                ...this.state,
                wholeBoard: this.wholeBoard,
                currentPlayer: "player2",
                turn: "player1",
            });
          });
        conn.on('error', (err) => {
            toast.error("Error in connection");
        })
    }

    syncData = (data) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                ...data,
            }
        })
        if(data.wholeBoard)
            this.wholeBoard = data.wholeBoard;
    }

    generateBoard = (value) => {
        const nums = [];
        this.wholeBoard = [];
        for(let i = 0; i < value;i++){
            const row = [];
            for(let j = 0; j < value;j++)
                row.push("");
            this.wholeBoard.push(row);
        }

        for(let i = 1; i <= (value*value); i++)
            nums.push(i);

        this.setState({
            board: nums,
            size: value
        })
        if(this.props.conn)
            this.props.conn.send({
                wholeBoard: this.wholeBoard,
                board: nums,
                size: value
            })
    }

    checkWinner = () => {
        const n = this.wholeBoard.length;
        for(let i = 0; i < n;i++){
            for(let j = 0; j < n;j++){
                const block = this.wholeBoard[i][j];
                if(block !== ""){
                    const directions = ["right","down","cross"]
                    for(let k = 0; k < 3;k++)
                        if(this.dfsSearch(i,j,this.state.lineSize-1,n,block,directions[k]))
                            return true;
                } 
            }  
        }
        return false;
    }

    dfsSearch = (i,j,k,n,key,direction) => {
        if(i < 0 || j < 0 || i >= n || j >= n)
            return false;
        if(k === 0)
            return true;
        if(j+1 < n && direction === "right" && this.wholeBoard[i][j+1] === key)
            if(this.dfsSearch(i,j+1,k-1,n,key,direction))
                return true;
        if(i+1 < n && direction === "down" && this.wholeBoard[i+1][j] === key)
            if(this.dfsSearch(i+1,j,k-1,n,key,direction))
                return true;
        if(j+1 < n && direction === "cross" && i+1 < n && this.wholeBoard[i+1][j+1] === key)
            if(this.dfsSearch(i+1,j+1,k-1,n,key,direction))
                return true;
        return false;
    }

    changeName = (key,value) => {
        this.setState({
            [key]:value
        });
        if(this.props.conn)
            this.props.conn.send({
                wholeBoard: this.wholeBoard,
                [key]:value
            })
    }

    resetGame = () => {
        const payload = {
            player1: "",
            player2: "",
            currentPlayer: "player1",
            value: "",
            board: [1,2,3,4,5,6,7,8,9],
            size: 3,
            lineSize: 3,
            selectedBlocks: {},
            matchResult: "",
        }
        this.setState(payload);
        this.generateBoard(3);
        if(this.state.multiPlayer)
            this.props.conn.send({
                ...payload
            })
    }

    onClick = (row, symbol) => {
        let i = parseInt((row-1)/(this.state.size));
        let j = (row-1)%(this.state.size);
        this.wholeBoard[i][j] = symbol;
        var newBlocks = {
            ...this.state.selectedBlocks,
            [row]: symbol
        };
        this.setState(prevState => {
            newBlocks = {
                ...prevState.selectedBlocks,
                [row]: symbol
            }
            if(this.state.multiPlayer)
                this.props.conn.send({
                    selectedBlocks: newBlocks,
                    wholeBoard: this.wholeBoard
                })
            return {
                selectedBlocks: newBlocks
            }
        })
        if(this.checkWinner()){
            if(this.state.multiPlayer)
                this.props.conn.send({
                    matchResult: `${this.state.currentPlayer} won`
                })
            this.setState({
                matchResult: `${this.state.currentPlayer} won`
            })
            return 
        }
        else if(Object.keys(newBlocks).length === (this.state.size*this.state.size)){
            if(this.state.multiPlayer)
                this.props.conn.send({
                    matchResult: `Match is Drawn`
                })
            this.setState({
                matchResult: `Match is Drawn`
            })
            return 
        }   
        this.changePlayer();
    }

    render () {
        const currentPlayer = this.state.currentPlayer;
        return (
            <Aux>
                <div className="game">
                    <Player currentPlayer={currentPlayer} multiPlayer={this.state.multiPlayer}  playerNo={!this.state.multiPlayer ? "player1":currentPlayer} name={!this.state.multiPlayer ? this.state.player1: this.state.player2} changeName={this.changeName}></Player>
                    <Board blocks={this.state.board} 
                        size={this.state.size} 
                        lineSize={this.state.lineSize}
                        selectedBlocks={this.state.selectedBlocks}
                        currentPlayer={currentPlayer} 
                        generateBoard={this.generateBoard}
                        onClick={this.onClick}
                        changeName={this.changeName}
                        resetGame={this.resetGame}
                        matchResult={this.state.matchResult}
                        peerId={this.props.peerId}
                        connectOthers={this.connectOther}>
                    </Board>
                    {
                        !this.state.multiPlayer && 
                        <Player currentPlayer={currentPlayer} playerNo="player2" name={this.state.player2} changeName={this.changeName}></Player>
                    }
                </div>
            </Aux>
        );
    }
})
