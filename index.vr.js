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
      message: 'Welcome to VR Tictactoe'
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
        layoutOrigin: [0.5, 0.5],
        transform: [{ translate: [0.2, 2.3, -9] }]
      }
    }

    return (
      <View>
        <Pano source={asset('winter.jpg')}/>

        <Text style={styles.title}>{this.state.message}</Text>

        <VrButton style={{
          width: 1,
          height: 1,
          backgroundColor: '#ccc', // textAlignVertical: 'center',
          layoutOrigin: [0.5, 0.5],
          transform: [{translate: [-1, 2, -9]}]
        }} onClick={() => this.setState({
          message: 'Button 1 clicked'
        })}> 
          <Text style={styles.boardSymbol}> 1 </Text> 
        </VrButton>

         <VrButton style={{
          width: 1,
          height: 1,
          backgroundColor: '#ccc', // textAlignVertical: 'center',
          layoutOrigin: [0.5, 0.5],
          transform: [{translate: [0.2, 3, -9]}]
        }} onClick={() => this.setState({
          message: 'Button 2 clicked'
        })}> 
          <Text style={styles.boardSymbol}> 2 </Text> 
        </VrButton>

         <VrButton style={{
          width: 1,
          height: 1,
          backgroundColor: '#ccc', // textAlignVertical: 'center',
          layoutOrigin: [0.5, 0.5],
          transform: [{translate: [1.4, 4, -9]}]
        }} onClick={() => this.setState({
          message: 'Button 3 clicked'
        })}> 
          <Text style={styles.boardSymbol}> 3 </Text> 
        </VrButton>

        <VrButton style={{
          width: 1,
          height: 1,
          backgroundColor: '#ccc', // textAlignVertical: 'center',
          layoutOrigin: [0.5, 0.5],
          transform: [{ translate: [-1, 3.8, -9] }]
        }} onClick={() => this.setState({
          message: 'Button 4 clicked'
        })}>
          <Text style={styles.boardSymbol}> 4 </Text>
        </VrButton>

        <VrButton style={{
          width: 1,
          height: 1,
          backgroundColor: '#ccc', // textAlignVertical: 'center',
          layoutOrigin: [0.5, 0.5],
          transform: [{ translate: [0.2, 4.8, -9] }]
        }} onClick={() => this.setState({
          message: 'Button 5 clicked'
        })}>
          <Text style={styles.boardSymbol}> 5 </Text>
        </VrButton>

        <VrButton style={{
          width: 1,
          height: 1,
          backgroundColor: '#ccc', // textAlignVertical: 'center',
          layoutOrigin: [0.5, 0.5],
          transform: [{ translate: [1.4, 5.8, -9] }]
        }} onClick={() => this.setState({
          message: 'Button 6 clicked'
        })}>
          <Text style={styles.boardSymbol}> 6 </Text>
        </VrButton>

        <VrButton style={{
          width: 1,
          height: 1,
          backgroundColor: '#ccc', // textAlignVertical: 'center',
          layoutOrigin: [0.5, 0.5],
          transform: [{ translate: [-1, 5.6, -9] }]
        }} onClick={() => this.setState({
          message: 'Button 7 clicked'
        })}>
          <Text style={styles.boardSymbol}> 7 </Text>
        </VrButton>

        <VrButton style={{
          width: 1,
          height: 1,
          backgroundColor: '#ccc', // textAlignVertical: 'center',
          layoutOrigin: [0.5, 0.5],
          transform: [{ translate: [0.2, 6.6, -9] }]
        }} onClick={() => this.setState({
          message: 'Button 8 clicked'
        })}>
          <Text style={styles.boardSymbol}> 8 </Text>
        </VrButton>

        <VrButton style={{
          width: 1,
          height: 1,
          backgroundColor: '#ccc', // textAlignVertical: 'center',
          layoutOrigin: [0.5, 0.5],
          transform: [{ translate: [1.4, 7.6, -9] }]
        }} onClick={() => this.setState({
          message: 'Button 9 clicked'
        })}>
          <Text style={styles.boardSymbol}> 9 </Text>
        </VrButton>
      </View>
    );
  }
};

AppRegistry.registerComponent('tictactoe_game', () => tictactoe_game);
