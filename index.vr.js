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
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

export default class tictactoe_game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      message: 'Player X Turn',
      boxFocus: [false, false, false, false, false, false, false, false, false],
      boxSelection: [null, null, null, null, null, null, null, null, null],
      currentPlayer: 'X',
      boxTimer: null,
      boardDisplayed: true,
      bounceValue: new Animated.Value(0),
      background: ''
    }
  }

  randomBackground = () => {
    let { background } = this.state
    let backgroundImage = ['Arizona.jpg', 'California.jpg','Texas.jpg', 'New Hampshire.jpg', 'winter.jpg']
    let hasil = Math.floor((Math.random() * backgroundImage.length - 1) + 1)
    this.setState({background: backgroundImage[hasil]})
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
      const itemSelected = this.state.boxSelection
      itemSelected[index] = this.state.currentPlayer

      this.setState({ 
        message: `Box ${index} selected`, 
        boxSelection: itemSelected 
      })

      this.checkWinner()
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

  checkWinner() {
    // Testing
    Array.prototype.allValuesSame = function () {
      for (var i = 1; i < this.length; i++) {
        if (this[i] !== this[0])
          return false;
      }

      return true;
    }

    if (this.state.boxSelection.allValuesSame()) {
      this.bounceItem()
      
      this.setState({
        message: "Player X WIN!",
        boardDisplayed: false
      })
    }
    // Testing End
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

    if (this.state.boxSelection[index]) {
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

  componentDidMount() {
    
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
          { scale: this.state.bounceValue }
        ],
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFECB3',
        padding: 0.1,
      }
    }

    return (
      <View>
        <Pano source={asset(this.state.background)}/>
        { 
         this.state.boardDisplayed && <View style={styles.container}>
            <Text style={styles.title}>{this.state.message}</Text>
            <View style={styles.board}>
              {
                this.state.boxSelection.map((box, index) => {
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

          <VrButton  onClick={() => this.resetGame() }>
            <Text style={styles.resetButton}>Play Again</Text>
          </VrButton>
        </Animated.View>
        
      </View>
    );
  }
};

AppRegistry.registerComponent('tictactoe_game', () => tictactoe_game);
