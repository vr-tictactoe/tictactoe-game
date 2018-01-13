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
      player1Avatar: 'astro.png',
      player2Avatar: 'alien.png',
      boxTimer: null,
      boardDisplayed: true,
      gameOver: false,
      bounceValue: new Animated.Value(0),
      fadeAnim: new Animated.Value(0.1),
      alertBoardPositionY: new Animated.Value(-8),
      timeout: null
    }
  }


  gameOver = (duration) => {
    let { timeout } = this.state
    var timer = duration, seconds;
    
    setInterval(() => {
        seconds = parseInt(timer % 60, 10);

        seconds = seconds < 10 ? "0" + seconds : seconds;

        // console.log('waktu akan habis dalam: ' + seconds )
        console.log('ini waktu', seconds)
        this.setState({timeout: timer})
        if (--timer < 0) {
            timer = duration;
            clearInterval(10)
        }
    }, 1000);
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
      message: message,
      boardDisplayed: false,
      gameOver: true
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
    this.gameOver(10)

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
          if (snapshot.val().player2.uid === '') {
            this.setState({
              message: 'Waiting for Player O'
            })
          } else if(snapshot.val().turn === this.state.uid){
            this.setState({
              message: 'Your Turn'
            })
          } else{
            this.setState({
              message: 'Wait Opponent Turn'
            })
          }

          snapshot = snapshot.val()
          this.setState({
            board: snapshot.board
          })
        }
      })
    }
  }

  componentWillMount() {
    // this.gameOver(10)
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
        height: 2.5,
        alignItems: 'center',
        justifyContent: 'center',
      },

      labelVs: {
        fontSize: 0.5,
        margin: 1,
        fontStyle: 'italic'
      },

      labelTop: {
        fontSize: 0.35,
        color: 'crimson'
      }
    }
    
    return (
      <View>
        <Pano source={asset('winter.jpg')}/>
        <View style={styles.topArea}>
        
          {/* <Image style={styles.topItem} source={{uri: 'http://placeimg.com/500/500'}} /> */}
         
          <View style={styles.topItem}>
            <Image style={styles.topItem} source={asset(this.state.player1Avatar)} />
            <Text style={styles.labelTop}>You are X</Text>
            <Text style={styles.labelTop}>ini timeout {this.state.timeout}</Text>
          </View>

         
          <VrButton>
            <Text style={styles.labelVs}>VS</Text>
          </VrButton>

          <View style={styles.topItem}>
            <Image style={styles.topItem} source={asset(this.state.player2Avatar)} />
            <Text style={styles.labelTop}>Opponent O</Text>
            <Text style={styles.labelTop}>ini timeout {this.state.timeout}</Text>
          </View>
        </View>

        { 
         this.state.boardDisplayed && <View style={styles.container}>
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
