import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  Text,
  View,
  Animated,
  NativeModules,
  VrButton,
  Model,
  Box
} from 'react-vr';

import { db } from './firebase'

export default class tictactoe_game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      message: 'Player X Turn',
      boxFocus: [false, false, false, false, false, false, false, false, false],
      board: ['', '', '', '', '', '', '', '', ''],
      currentPlayer: 'X',
      uid: '',
      gameId: '',
      player: [],
      type: '',
      games: [],

      boxTimer: null,
      boardDisplayed: true,
      bounceValue: new Animated.Value(0),
    }
  }

  bounceItem = () => {
    this.state.bounceValue.setValue(0);
    Animated.spring(
      this.state.bounceValue, {
        toValue: 1,
        friction: 3,
      }
    ).start();
  }

  boxFocused(index) {
    const itemFocus = this.state.boxFocus
    itemFocus[index] = true

    let timerFocused = setTimeout(() => {
      /* const itemSelected = this.state.board
      itemSelected[index] = this.state.currentPlayer */

      this.clickBoard(index)

      this.setState({ 
        message: `Box ${index} selected`, 
      })
    }, 2000); 

    this.setState({ 
      message: `Box ${index} focused`, 
      boxFocus: itemFocus,
      boxTimer: timerFocused
    })    
  }

  boxLeave(index) {
    const itemFocus = this.state.boxFocus
    itemFocus[index] = false
    clearTimeout(this.state.boxTimer)

    this.setState({
      boxFocus: itemFocus
    })
  }

  checkWinner(message) {
    // this.bounceItem()
    console.log(`=======================WINNNER ${message}`)

    this.setState({
      message: message,
      boardDisplayed: false
    })
  }

  setBoxContent(index) {
    if (this.state.boxFocus[index]) {
      return {
        backgroundColor: 'rgba(237, 20, 61, 0.4117647058823529)',
        margin: 0.1,
        height: 2,
        width: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }
    } else {
      return { 
        backgroundColor: 'gold', 
        margin: 0.1, height: 2, width: 2, 
        alignItems: 'center', justifyContent: 'center', 
      }
    }

    if (this.state.board[index]) {
      return {
        backgroundColor: 'teal',
        margin: 0.1,
        height: 2,
        width: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }
    }
  }

  resetGame() {
    NativeModules.LinkingManager.openURL('http://kaskus.co.id')
  }

  fillBoard(index) {

    if (this.state.board[index] === '' || this.state.board[index] === null) {
      db.ref('games').child(this.state.gameId).once('value', snapshotGame => {
        if (snapshotGame.val().player1.uid === this.state.uid) {
          this.state.board.splice(index, 1, snapshotGame.val().player1.type)
          db.ref('games').child(this.state.gameId).update({
            board: this.state.board,
            turn: snapshotGame.val().player2.uid
          })
        }
        if (snapshotGame.val().player2.uid === this.state.uid) {
          this.state.board.splice(index, 1, snapshotGame.val().player2.type)
          db.ref('games').child(this.state.gameId).update({
            board: this.state.board,
            turn: snapshotGame.val().player1.uid
          })
        }

        let checkBoard = [`${this.state.board[0] + this.state.board[1] + this.state.board[2]},
        ${this.state.board[0] + this.state.board[3] + this.state.board[6]},
        ${this.state.board[0] + this.state.board[4] + this.state.board[8]},
        ${this.state.board[2] + this.state.board[4] + this.state.board[6]},
        ${this.state.board[2] + this.state.board[5] + this.state.board[8]},
        ${this.state.board[3] + this.state.board[4] + this.state.board[5]},
        ${this.state.board[6] + this.state.board[7] + this.state.board[8]},
        ${this.state.board[1] + this.state.board[4] + this.state.board[7]}`]

        if (checkBoard[0].indexOf('XXX') !== -1) {
          this.checkWinner('X Winner')
          db.ref('games').child(this.state.gameId).update({
            winner: snapshotGame.val().player1.name
          })
          this.setState({
            board: ['', '', '', '', '', '', '', '', '']
          })
        }

        if (checkBoard[0].indexOf('OOO') !== -1) {
          this.checkWinner('O Winner')
          db.ref('games').child(this.state.gameId).update({
            winner: snapshotGame.val().player2.name
          })
          this.setState({
            board: ['', '', '', '', '', '', '', '', '']
          })
        }

        if (this.state.board.indexOf('') === -1 &&
          checkBoard[0].indexOf('XXX') === -1 &&
          checkBoard[0].indexOf('OOO') === -1) {
          this.checkWinner('DRAW')
          this.setState({
            board: ['', '', '', '', '', '', '', '', '']
          })
        }

      })
    }
  }

  clickBoard(index) {    
    db.ref('games').child(this.state.gameId).child('turn').once('value', checkTurn => {
      console.log(checkTurn.val())

      if (checkTurn.val() === this.state.uid) {
        this.fillBoard(index)
      }
    })
  }

  componentDidMount() {
    let queryString = NativeModules.Location.search;
    let splitString = queryString.split('&');
    let gameId = splitString[0].split('=')[1];
    let playerUID = splitString[1].split('=')[1]

    this.setState({
      gameId : gameId,
      uid: playerUID
    })

    db.ref('users').orderByChild('uid').equalTo(playerUID).once('value', snaphotUser => {
      snaphotUser.forEach(snapUser => {
        this.state.player = snapUser.val()
      })
    })

    if (gameId !== '') {
      db.ref('games').child(gameId).on('value', snapshot => {
        if (snapshot.val() !== null) {
          snapshot = snapshot.val()
          this.setState({
            board: snapshot.board
          })
        }
      })
    }
  }

  render() {
    const styles = {
      boardSymbol: {
        fontSize: 0.8,
        textAlignVertical: 'center',
        textAlign: 'center'
      },

      title: {
        fontSize: 0.5,
        position: 'absolute',
        top: -1,
        left: '30%'
      },

      label: {
        color: 'crimson',
        fontSize: 0.5,
        marginBottom: 0.2
      },

      resetButton: {
        backgroundColor: '#FFA000',
        fontSize: 0.5,
        paddingLeft: 0.1,
        paddingRight: 0.1,
        paddingTop: 0.1,
        paddingBottom: 0.1
      },

      container: {
        position: 'relative',
        layoutOrigin: [0.5, 0.5],
        transform: [{ translate: [-1, 0.5, -9] }],
        flex: 1,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 'auto'
      },

      board: {
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 'auto',
        width: 8
      },

      box: {
        backgroundColor: 'gold',
        margin: 0.1,
        height: 2,
        width: 2,
        alignItems: 'center',
        justifyContent: 'center',
      },

      boxFocus: {
        backgroundColor: 'rgba(237, 20, 61, 0.4117647058823529)',
        margin: 0.1,
        height: 2,
        width: 2,
        alignItems: 'center',
        justifyContent: 'center',
      },

      boxSelected: {
        backgroundColor: 'teal',
        margin: 0.1,
        height: 2,
        width: 2,
        alignItems: 'center',
        justifyContent: 'center',
      },

      messageBoard: {
        width: 8,
        height: 4,
        layoutOrigin: [0.5, 0.5],
        transform: [
          { translate: [-1, 0, -10] },
          { scale: 1.5 }
        ],
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFECB3',
        padding: 0.1,
      }
    }
    
    return (
      <View>
        <Pano source={asset('winter.jpg')}/>
        { 
         this.state.boardDisplayed && <View style={styles.container}>
            <Text style={styles.title}>{this.state.message} {JSON.stringify(this.props)}</Text>
            <View style={styles.board}>
              {
                this.state.board.map((box, index) => {
                  return (
                    <VrButton key={index} style={this.setBoxContent(index)} 
                      onEnter={() => this.boxFocused(index)} onExit={() => this.boxLeave(index)}>
                      <Text style={styles.boardSymbol}> {box !== null ? box : ''} </Text>
                    </VrButton>
                  )
                })
              }
            </View>
          </View>
        }

        <Animated.View style={styles.messageBoard}>
          <Text style={styles.label}>PLAYER X WIN</Text>

          <VrButton onEnter={() => this.resetGame() }>
            <Text style={styles.resetButton}>Play Again</Text>
          </VrButton>
        </Animated.View>
        
      </View>
    );
  }
};

AppRegistry.registerComponent('tictactoe_game', () => tictactoe_game);
