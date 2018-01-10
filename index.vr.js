import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  Text,
  View,
  VrButton
} from 'react-vr';

export default class tictactoe_game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      message: 'Player X Turn',
      focus: false
    }
  }

  boxFocused() {
    this.setState({ message: 'Button 1 clicked', focus: true })
  }

  boxLeave() {
    
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
        backgroundColor: 'gold',
        borderColor: 'crimson',
        margin: 0.1,
        height: 2,
        width: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }
    }

    let boxStyle;

    if (this.state.focus) {
      boxStyle = styles.box
    } else {
      boxStyle = styles.boxFocus
    }

    return (
      <View>
        <Pano source={asset('winter.jpg')}/>
        
        <View style={styles.container}>
          <Text style={styles.title}>{this.state.message}</Text>
          <View style={styles.board}>
            <VrButton style={boxStyle} onEnter={() => this.boxFocused()}>
              <Text style={styles.boardSymbol}> 1 </Text>
            </VrButton>

            <VrButton style={boxStyle} onEnter={() => this.setState({ message: 'Button 2 clicked' })}>
              <Text style={styles.boardSymbol}> 2 </Text>
            </VrButton>

            <VrButton style={boxStyle} onEnter={() => this.setState({ message: 'Button 3 clicked' })}>
              <Text style={styles.boardSymbol}> 3 </Text>
            </VrButton>

            <VrButton style={boxStyle} onEnter={() => this.setState({ message: 'Button 4 clicked' })}>
              <Text style={styles.boardSymbol}> 4 </Text>
            </VrButton>

            <VrButton style={boxStyle} onEnter={() => this.setState({ message: 'Button 5 clicked' })}>
              <Text style={styles.boardSymbol}> 5 </Text>
            </VrButton>

            <VrButton style={boxStyle} onEnter={() => this.setState({ message: 'Button 6 clicked' })}>
              <Text style={styles.boardSymbol}> 6 </Text>
            </VrButton>

            <VrButton style={boxStyle} onEnter={() => this.setState({ message: 'Button 7 clicked' })}>
              <Text style={styles.boardSymbol}> 7 </Text>
            </VrButton>

            <VrButton style={boxStyle} onEnter={() => this.setState({ message: 'Button 8 clicked' })}>
              <Text style={styles.boardSymbol}> 8 </Text>
            </VrButton>
            
            <VrButton style={boxStyle} onEnter={() => this.setState({ message: 'Button 9 clicked' })}>
              <Text style={styles.boardSymbol}> 6 </Text>
            </VrButton>
          </View>
        </View>
        
      </View>
    );
  }
};

AppRegistry.registerComponent('tictactoe_game', () => tictactoe_game);
