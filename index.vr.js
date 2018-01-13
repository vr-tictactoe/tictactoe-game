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
  Image
} from 'react-vr';

import axios from 'axios'

import { db } from './firebase'

export default class tictactoe_game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      boxFocus: [false, false, false, false, false, false, false, false, false],
      board: ['', '', '', '', '', '', '', '', ''],
      uid: '',
      gameId: '',
      player: [],
      type: '',
      games: [],
      winner: '',
      player1Avatar: '',
      player2Avatar: '',
      player1Type: '',
      player2Type: '',
      player1Name: '',
      player2Name: '',
      boxTimer: null,
      boardDisplayed: true,
      gameOver: false,
      gameOverMessage: '',
      boardOpacity: 1,
      bounceValue: new Animated.Value(0),
      fadeAnim: new Animated.Value(0.1),
      alertBoardPositionY: new Animated.Value(-8),
    }
  }

  boxFocused(index) {
    const itemFocus = this.state.boxFocus
    itemFocus[index] = true

    let timerFocused = setTimeout(() => {
      this.clickBoard(index)
    }, 2000); 

    this.setState({ 
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

  showGameoverBoard() {
    console.log(`========== SHOW GAMEOVER BOARD`)

    Animated.timing(
      this.state.fadeAnim,
      { toValue: 1 }
    ).start();

    Animated.timing(
      this.state.alertBoardPositionY,
      { toValue: 10 }
    ).start();
  }

  checkWinner(message) {
    this.showGameoverBoard();
    
    this.setState({
      gameOverMessage: message,
      boardDisplayed: false,
      gameOver: true,
      boardOpacity: 0
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
    NativeModules.LinkingManager.openURL('http://vrtoe.septianfujianto.com/')
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
          this.checkWinner(`${this.state.player1Name} - (${this.state.player1Type}) Winner`)

          db.ref('games').child(this.state.gameId).update({
            winner: snapshotGame.val().player1.uid
          })

          this.setState({
            board: ['', '', '', '', '', '', '', '', '']
          })
        }

        if (checkBoard[0].indexOf('OOO') !== -1) {
          this.checkWinner(`${this.state.player2Name} - (${this.state.player2Type}) Winner`)

          db.ref('games').child(this.state.gameId).update({
            winner: snapshotGame.val().player2.uid
          })

          this.setState({
            board: ['', '', '', '', '', '', '', '', '']
          })
        }

        if (this.state.board.indexOf('') === -1 &&
          checkBoard[0].indexOf('XXX') === -1 &&
          checkBoard[0].indexOf('OOO') === -1) {
          
          this.checkWinner('DRAW - Good Game')

          db.ref('games').child(this.state.gameId).update({
            winner: 'DRAW'
          })          

          this.setState({
            board: ['', '', '', '', '', '', '', '', '']
          })
        }

      })
    }
  }

  clickBoard(index) {   
    console.log(`========================CLICKBOARD`)
    console.log(JSON.stringify(this.state.player))
    db.ref('games').child(this.state.gameId).once('value',checkPlayer => {
      if(checkPlayer.val().player2.uid !== ''){
        db.ref('games').child(this.state.gameId).child('turn').once('value', checkTurn => {
          console.log(checkTurn.val())

          if (checkTurn.val() === this.state.uid) {
            this.fillBoard(index)
          }
        })
      }else{
        this.setState({
          message: 'Waiting second player'
        })
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
          if (snapshot.val().winner !== ''){

            if(snapshot.val().winner === this.state.uid){
              this.checkWinner(`${this.state.player.name} Win` )
              axios.post('https://us-central1-vtitu-191706.cloudfunctions.net/createHistory', {
                gameId: this.state.gameId,
                player1: this.state.player1Name,
                player2: this.state.player2Name,
                winner: this.state.player.name,
              })

            }else{
              this.checkWinner(`${this.state.player.name} Lose`)
            }
          }

          if (snapshot.val().player2.uid === '') {
            this.setState({
              message: 'Waiting for Second Player'
            })
          } else if(snapshot.val().turn === this.state.uid){
            this.setState({
              message: 'Your Turn'
            })
          } else{
            this.setState({
              message: 'Waiting Opponent Turn'
            })
          }

          snapshot = snapshot.val()
          this.setState({
            board: snapshot.board,
            player1Avatar: snapshot.player1.avatar,
            player2Avatar: snapshot.player2.avatar,
            player1Name: snapshot.player1.name,
            player2Name: snapshot.player2.name,
            player1Type: snapshot.player1.type,
            player2Type: snapshot.player2.type,
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
        fontWeight: 'bold',
        left: '35%'
      },

      label: {
        color: 'crimson',
        fontSize: 0.5,
        marginBottom: 0.7
      },

      resetButton: {
        backgroundColor: '#FFA000',
        fontSize: 0.5,
        paddingLeft: 0.1,
        paddingRight: 0.1,
        paddingTop: 0.1,
        paddingBottom: 0.1,
      },

      container: {
        position: 'relative',
        opacity: this.state.boardOpacity,
        layoutOrigin: [0.5, 0.5],
        transform: [{ translate: [-1, 3.5, -11] }],
        flex: 1,
        backgroundColor: 'rgba(221,221,221, 0.6)',
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
        opacity: this.state.fadeAnim,
        transform: [
          { translate: [-1, this.state.alertBoardPositionY, -10] },
          { scale: 1.5 }
        ],
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(221,221,221, 0.6)',
        padding: 0.1,
      },

      topArea: {
        width: 12,
        height: 4,
        layoutOrigin: [0, 0],
        transform: [
          { translate: [-7, 7.7, -10] },
        ],
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(221,221,221, 0.6)',
        padding: 0.1,
      },

      topItem: {
        width: 2,
        height: 3,
        alignItems: 'center',
        justifyContent: 'center',
      },

      labelVs: {
        fontSize: 0.5,
        margin: 1,
        fontStyle: 'italic'
      },

      labelTop: {
        textAlign: 'center',
        fontSize: 0.3,
        color: 'crimson'
      }
    }
    
    return (
      <View>
        <Pano source={asset('winter.jpg')}/>
        <View style={styles.topArea}>
                 
          <View style={styles.topItem}>
            <Image style={styles.topItem} source={asset(this.state.player1Avatar)} />
            <Text style={styles.labelTop}>{this.state.player1Name} - {this.state.player1Type}</Text>
          </View>

         
          <VrButton>
            <Text style={styles.labelVs}>VS</Text>
          </VrButton>

          <View style={styles.topItem}>
            <Image style={styles.topItem} source={asset(this.state.player2Avatar)} />
            <Text style={styles.labelTop}>{this.state.player2Name} - {this.state.player2Type}</Text>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.title}>{this.state.message}</Text>
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

        <Animated.View style={styles.messageBoard}>
          <Text style={styles.label}>{this.state.gameOverMessage}</Text>

          <VrButton onEnter={() => this.resetGame() }>
            <Text style={styles.resetButton}>Play Again</Text>
          </VrButton>
        </Animated.View>
        
      </View>
    );
  }
};

AppRegistry.registerComponent('tictactoe_game', () => tictactoe_game);
