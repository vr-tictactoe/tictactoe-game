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
  Image,
  Sound
} from 'react-vr';

const AnimatedModel = Animated.createAnimatedComponent(Image);

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
      player1Status: 'Not Ready',
      player2Status: 'Not Ready',
      boxTimer: null,
      boardDisplayed: true,
      gameOver: false,
      gameOverMessage: '',
      boardOpacity: 1,
      timeout: 0,
      gameCountingTime: 0,
      bounceValue: new Animated.Value(0),

      fadeAnim: new Animated.Value(0.1),
      alertBoardPositionY: new Animated.Value(-8),
      timerMessage: '',
      winning: '',
      gameStatus: '',
      background: '',
      backgroundColor: '',
      colorSelected: '',
      transformX: null,
      transformY: null,
      transformZ: null,
      avatarColor: '',
      labelColor: '',
      rotation: new Animated.Value(0),
      player1Color: '' || 'crimson',
      player2Color: '' || 'crimson',
      soundTimer: null,
      soundBox: ''
    }
  }

  rotate = ()  =>{
    this.state.rotation.setValue(0);
    console.log('ini rotate', this.state.rotation)
    Animated.timing(
      this.state.rotation,
      {
        toValue: 360,
        duration: 10000,
        // easing: Easing.linear
      }
    ).start(this.rotate);
  }

  soundFocus() {
    let timerFocused = setTimeout(() => {
      this.setState({soundBox: 'laser.wav'})
    }, 1500); 

    this.setState({ 
      soundTimer: timerFocused
    })    
  }

  soundLeave() {
    clearTimeout(this.state.soundTimer)
  }

  boxFocused(index) {
    const itemFocus = this.state.boxFocus
    itemFocus[index] = true

    let timerFocused = setTimeout(() => {
      this.clickBoard(index)
      this.soundFocus()
    }, 1500); 

    this.setState({ 
      boxFocus: itemFocus,
      boxTimer: timerFocused
    })    
  }

  randomBackground = () => {
    let { background, backgroundColor, transformX, transformY, transformZ, labelColor } = this.state
    
    let backgroundImage = ['ship2.jpg','MilleniumFalcon8K.jpg', 'space2.jpg', 'ship3.jpg']
    let posisiX = [2,-5, -5.5, 30]
    let posisiY = [188, 126, 55, 5]
    let posisiZ = [1, 8, -9, 10]
    let colorBackground = ['rgba(75, 163, 229, 0.62)', 'rgba(58, 135, 234, 0.62)', 'rgba(80, 192, 237, 0.62)', 'rgba(242, 159, 43, 0.62)']
    let selectColour =  ['rgba(75, 163, 229, 0.9)', 'rgba(58, 135, 234, 0.9)', 'rgba(80, 192, 237, 0.9)', 'rgba(242, 159, 43, 0.9)']
    let avatarBackground = ['rgba(75, 163, 229, 0.6)', 'rgba(58, 135, 234, 0.6)', 'rgba(80, 192, 237, 0.6)', 'rgba(242, 159, 43, 0.6)']
    let colorLabel = ['rgb(75, 163, 229)', 'rgb(58, 135, 234)', 'rgb(80, 192, 237)', 'rgb(242, 159, 43)']
    let hasil = Math.floor((Math.random() * backgroundImage.length - 1) + 1)
    console.log('ini hasil random', hasil)
    
    this.setState({
      background: backgroundImage[hasil],
      backgroundColor: colorBackground[hasil],
      colorSelected: selectColour[hasil],
      avatarColor: avatarBackground[hasil],
      rotateX: posisiX[hasil],
      rotateY: posisiY[hasil],
      rotateZ: posisiZ[hasil],
      labelColor: colorLabel[hasil]
    })

    let gambar = [backgroundImage[hasil],colorBackground[hasil], selectColour[hasil],posisiX[hasil], posisiY[hasil], posisiZ[hasil]  ]
    console.log('ini gambar', gambar)
    console.log('ini hasil ke 2', hasil)
  }

  boxLeave(index) {
    const itemFocus = this.state.boxFocus
    itemFocus[index] = false
    clearTimeout(this.state.boxTimer)
    this.soundLeave()

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
      { toValue: 8 }
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
        backgroundColor: this.state.colorSelected,
        borderRadius: 0.1,
        margin: 0.1,
        height: 2,
        width: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }
    } else {
      return { 
        backgroundColor: this.state.backgroundColor, 
        borderRadius: 0.1,
        margin: 0.1, 
        height: 2, 
        width: 2, 
        alignItems: 'center', 
        justifyContent: 'center', 
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

  startTheGame() {    
    console.log('start game nya ')
    db.ref('games').child(this.state.gameId).update({
      gameStatus: 'Ready',
    })    
  }

  gameCountDown(duration) {
     let { gameCountingTime } = this.state
     var timer = duration, seconds;
     var countdownInterval = setInterval(() => {
       seconds = parseInt(timer % 60, 10);
       seconds = seconds < 10 ? 0 + seconds : seconds;

         // console.log('waktu akan habis dalam: ' + seconds )
          this.setState({
            message: `Please Wait`,
            timerMessage: `Game will Start in ${seconds}`
          })

         this.setState({gameCountingTime: timer})

         if (--timer < 0) {
           gameCountingTime = duration;
           clearInterval(10)
           this.startTheGame()
         }
       }, 1000);
     this.setState({
      countdownInterval : countdownInterval
     })    
  }

  gameInterval(duration) {
   let { timeout } = this.state
   console.log(duration)
   var timer = duration, seconds;
   
   var timeInterval = setInterval(() => {
     seconds = parseInt(timer % 60, 10);
     seconds = seconds < 10 ? 0 + seconds : seconds;

       // console.log('waktu akan habis dalam: ' + seconds )
        this.setState({
          timerMessage: `Time remaining ${seconds}`
        })

       this.setState({timeout: timer})
       console.log(timer)
       if (--timer < 0) {
         timer = duration;
         clearInterval(15)
         this.randomBoard()
       }
     }, 1000);
   this.setState({
    timeInterval : timeInterval
   })
 }


 randomBoard() {
   let blankArr = []
   this.state.board.forEach((arr,index) => {
    if(arr === ''){
      blankArr.push(index)
    }
  })
   let randomBoard = Math.floor(Math.random() * blankArr.length);
   console.log(blankArr,randomBoard)
   this.clickBoard(blankArr[randomBoard])
 }

  resetGame() {
    setTimeout(() => {
      NativeModules.LinkingManager.openURL('http://localhost:3000/')
    }, 5000); 
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

  setBoardPieceContent(index, board) {
    let symbol = board

    if (this.state.board[index] !== '') {
      return (
        <Image style={{ width: 1, height: 1 }} source={asset(`${board}.png`)} />
      )
    }
  }

  clickBoard(index) {   
    console.log(`========================CLICKBOARD`,index)
    console.log(JSON.stringify(this.state.player))
    db.ref('games').child(this.state.gameId).once('value',checkPlayer => {
      if(checkPlayer.val().player2.uid !== '' && checkPlayer.val().gameStatus === 'Ready'){
        db.ref('games').child(this.state.gameId).child('turn').once('value', checkTurn => {
          console.log(checkTurn.val())

          if (checkTurn.val() === this.state.uid) {
            this.fillBoard(index)
          }
        })
      }
    })
  }

  componentDidMount() {
    // this.randomBackground()
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
          if(snapshot.val().player1.status === 'Ready' && snapshot.val().player2.status === 'Ready'
             && snapshot.val().gameStatus !== 'Ready'){
            this.gameCountDown(10)
          }

          if (snapshot.val().winner !== ''){

            if(snapshot.val().winner === this.state.uid){
              this.checkWinner(`${this.state.player.name} - WIN` )

              axios.post('https://us-central1-vtitu-191706.cloudfunctions.net/createHistory', {
                gameId: this.state.gameId,
                player1: this.state.player1Name,
                player2: this.state.player2Name,
                winner: this.state.player.name,
              })

            } else if(snapshot.val().winner === 'DRAW') {
              this.checkWinner(`${this.state.player.name} - DRAW`)
          
            } else {
              this.checkWinner(`${this.state.player.name} - LOSE`)
            }
          }

          if (snapshot.val().player2.uid === '') {
            this.setState({
              message: 'Waiting for Second Player'
            })
          }else if(snapshot.val().player2.uid !== '' && snapshot.val().gameStatus !== 'Ready'){
            this.setState({
              message: 'If you Ready Focus Box below your Avatar '
            })
          }else if(snapshot.val().turn === this.state.uid && snapshot.val().gameStatus === 'Ready'){
            clearInterval(this.state.countdownInterval)
            this.gameInterval(15)
            this.setState({
              message: 'Your Turn'
            })
          } else{
            this.setState({
              timerMessage: ``
            })            
            clearInterval(this.state.timeInterval)
            clearInterval(this.state.countdownInterval)
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
            player1Status: snapshot.player1.status,
            player2Status: snapshot.player2.status,
          })
        }
      })
    }
  }

  showGameOverIcon(message) {
    if (message !== '') {
      let winning = message.split('-')[1].trim()

      if (winning == 'WIN') {
        return (
          <Image style={{ width: 3, height: 1.6, marginBottom: 0.2 }} source={asset('win.png')} />
        )
      }

      if (winning == 'LOSE') {
        return (
          <Image style={{ width: 1.5, height: 1.5, marginBottom: 0.2 }} source={asset('lose.png')} />
        )
      }

      if (winning == 'DRAW') {
        return (
          <Image style={{ width: 3, height: 1.6, marginBottom: 0.2 }} source={asset('win.png')} />
        )
      }
    }
  }

  setPlayer1Ready() {     
    console.log('masuk sini player1')
    db.ref('games').child(this.state.gameId).once('value', snapUser => {
      if(snapUser.val().player1.uid === this.state.uid && snapUser.val().player1.status !== 'Ready'){     
        db.ref('games').child(this.state.gameId).child('player1').update({
            status: 'Ready',
          })
        this.setState({player1Color: 'green'})
      }
    })
  }

  

  setPlayer2Ready() {
    console.log('masuk sini player2')
    db.ref('games').child(this.state.gameId).once('value', snapUser => {
      if(snapUser.val().player2.uid === this.state.uid && snapUser.val().player2.status !== 'Ready'){       
        db.ref('games').child(this.state.gameId).child('player2').update({
            status: 'Ready',
          })
        this.setState({player2Color: 'green'})
      }
    })

    console.log('ini player 2', this.state.player2Color)
  }
  
  componentWillMount() {
    this.randomBackground()
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
        fontWeight: 'bold',
        textAlign: 'center',
      },

      timerTitle: {
        fontSize: 0.5,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 0.2
      },

      label: {
        color: 'red',
        fontSize: 0.5,
        marginBottom: 0.2
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
        transform: [{ translate: [0, 0, -13.5] }],
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 'auto',
        flexDirection: 'row',
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
          { translate: [0, this.state.alertBoardPositionY, -10] },
          { scale: 1.5 }
        ],
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(39, 155, 255, 0.7)',
        padding: 0.1,
      },

      topArea: {
        width: 8,
        height: 2,
        // backgroundColor: 'crimson',
        position: 'absolute',
        top: -2,
        left: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0.1,
      },

      avatarItem: {
        width: 2.3,
        height: 3,
        alignItems: 'center',
        justifyContent: 'center',
        // transform: [{translate: [0, 0, -3]}]
      },

      labelVs: {
        fontSize: 0.5,
        margin: 1,
        fontStyle: 'italic'
      },

      labelTop: {
        marginTop: 0.2,
        backgroundColor: this.state.avatarColor,
        padding: 0.1,
        borderRadius: 0.2,
        textAlign: 'center',
        fontSize: 0.3,
        color: '#fff',
        // transform: [{rotateY: this.state.rotation}]
      },

      sideItem: {
        height: '100%',        
        width: 1,
        resizeMode: 'contain',
        alignItems: 'center',
        justifyContent: 'center',
      },

      sideArea: {
        flex: 1,
        alignItems: 'center',
        height: 'auto',
        flexDirection: 'row',  
      },

      playerSide: {
        width: 3.5, 
        alignItems: 'center'
      }
    }
    
    return (
      <View>
        <Pano source={asset(this.state.background)} style={{transform: [{rotateY : this.state.rotateY},{rotateZ : this.state.rotateZ}, {rotateX : this.state.rotateX}]}}/>
        <Sound 
          source={{ mp3: asset('starwars.mp3') }}
          volume={50}
          loop={true}
        />
        <View style={styles.topArea}>
                 
          {/* <View style={styles.topItem}>
            <Image style={styles.topItem} source={asset(this.state.player1Avatar)} />
            <Text style={styles.labelTop}>{this.state.player1Name} - {this.state.player1Type}</Text>
          </View>

         
          <VrButton>
            <Text style={styles.labelVs}>VS</Text>
          </VrButton>

          <View style={styles.topItem}>
            <Image style={styles.topItem} source={asset(this.state.player2Avatar)} />
            <Text style={styles.labelTop}>{this.state.player2Name} - {this.state.player2Type}</Text>
          </View> */}
        </View>

        <View style={styles.container}>
          <View style={styles.sideArea}>
            <View style={styles.playerSide}>
              <AnimatedModel style={styles.avatarItem} source={asset(this.state.player1Avatar)} />
              {
                this.state.player1Name ? <Text style={styles.labelTop}>{this.state.player1Name} - {this.state.player1Type}</Text>
                :
                <Text></Text>
              }

              <VrButton 
                onEnter={() => this.setPlayer1Ready() } 
                onEnterSound={{mp3: asset('ready.mp3')}}
                style={{ backgroundColor: this.state.player1Color, padding: 0.1, marginTop: 0.5 }}

              >
                <Text style={{ fontColor: '#fff', fontSize: 0.5 }}>{ this.state.player1Status }</Text>
              </VrButton>  
            </View>
            <Image style={styles.sideItem} source={asset('left.png')} />        
          </View>

          <View>
            <View style={styles.topArea}>
              <Text style={styles.title}>{this.state.message}</Text>
            </View> 
            
            <View style={styles.board}>
              {
                this.state.board.map((box, index) => {
                  return (
                    <VrButton key={index} style={this.setBoxContent(index)}
                      
                      onEnter={() => this.boxFocused(index)} 
                      onEnterSound={{wav: asset(this.state.soundBox)}}
                      onExit={() => this.boxLeave(index)}
                      >
                      { this.setBoardPieceContent(index, box) }
                    </VrButton>
                  )
                })
              }
            </View>
            <Text style={styles.timerTitle}>{ this.state.timerMessage }</Text>
          </View>
          <View style={styles.sideArea}>
            <Image style={styles.sideItem} source={asset('right.png')} />                    
            <View style={styles.playerSide}>
              <Image style={styles.avatarItem} source={asset(this.state.player2Avatar)} />
              {
                this.state.player2Name ? <Text style={styles.labelTop}>{this.state.player2Name} - {this.state.player2Type}</Text> 
                : 
                <Text></Text>
              }

              <VrButton 
                onEnter={() => this.setPlayer2Ready()} 
                onEnterSound={{mp3: asset('ready.mp3')}}
                style={{ backgroundColor: this.state.player2Color, padding: 0.1, marginTop: 0.5 }}
              >
                <Text style={{ fontColor: '#fff', fontSize: 0.5 }}>{ this.state.player2Status }</Text>
              </VrButton> 
            </View>
          </View>
        </View>

        <Animated.View style={styles.messageBoard}>
          <Text style={styles.label}>{this.state.gameOverMessage}</Text>
          
          {this.showGameOverIcon(this.state.gameOverMessage) }

          <VrButton onEnter={() => this.resetGame() }>
            <Image style={{width: 3, height: 0.8}} source={asset('playagain.png')} />           
          </VrButton>
        </Animated.View>
        
      </View>
    );
  }
};

AppRegistry.registerComponent('tictactoe_game', () => tictactoe_game);