import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  Text,
  View,
  VrButton
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
      player: 'X',
      boxTimer: null
    }
  }

  boxFocused(index) {
    const itemFocus = this.state.boxFocus
    itemFocus[index] = true
    let t = setTimeout(() => {
      const itemSelected = this.state.boxSelection
      itemSelected[index] = this.state.player
      console.log(this.state.boxSelection)
      this.setState({ message: `Box ${index} selected`, boxSelection: itemSelected })
    }, 2000); 

    this.setState({ 
      message: `Box ${index} focused`, 
      boxFocus: itemFocus,
      boxTimer: t
    })

    /* Select Box when focused 2 seconds or more  */
    
  }

  boxLeave(index) {
    const itemFocus = this.state.boxFocus
    itemFocus[index] = false
    clearTimeout(this.state.boxTimer)

    this.setState({
      boxFocus: itemFocus
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
      }
    }

    return (
      <View>
        <Pano source={asset('winter.jpg')}/>
        
        <View style={styles.container}>
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
        
      </View>
    );
  }
};

AppRegistry.registerComponent('tictactoe_game', () => tictactoe_game);
