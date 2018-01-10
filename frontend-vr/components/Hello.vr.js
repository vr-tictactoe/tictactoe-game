import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  Text,
  View,
  Animated,
  VrButton
} from 'react-vr';

export default class HelloWorld extends React.Component {this
  constructor (props) {
    super (props)
    this.state = {
      message: 'Wait'
    }
  }

  handleClick () {
    this.setState({message: 'You have click the Button'})
    console.log('====================================');
    console.log('Diclick lho ya');
    console.log('====================================');
  }

  render () {
    return (
      <View>
        <View
          style={{
            width: 2,
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            transform: [{translate: [0, 0, -5]}],
            layoutOrigin: [0.5, 0.5, 0.5]
          }}
        > 
          <View style={{ margin: 0.1, height: 0.3, backgroundColor: '#CF3C7E' }}>
            <Text style={{ fontSize: 0.2, textAlign: 'center' }}>Arizona</Text>
          </View>
          <View style={{ margin: 0.1, height: 0.3, backgroundColor: '#CF3C7E' }}>
            <Text style={{ fontSize: 0.2, textAlign: 'center' }}>New Hampshire</Text>
          </View>
          <View style={{ margin: 0.1, height: 0.3, backgroundColor: '#CF3C7E' }}>
            <Text style={{ fontSize: 0.2, textAlign: 'center' }}>California</Text>
          </View>
          <View style={{ margin: 0.1, height: 0.3, backgroundColor: '#CF3C7E' }}>
            <Text style={{ fontSize: 0.2, textAlign: 'center' }}>Hawaii</Text>
          </View>
          <View style={{ margin: 0.1, height: 0.3, backgroundColor: '#CF3C7E' }}>
            <Text style={{ fontSize: 0.2, textAlign: 'center' }}>Texas</Text>
          </View>
        </View>
      </View>  
    )
  }
}