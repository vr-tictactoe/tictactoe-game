import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  Text,
  View,
  Animated
} from 'react-vr';

import MainMenu from './components/scene/MainMenu'

export default class tictactoe_game extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Pano source={asset('fort-night.jpg')}/>
        <MainMenu />
      </View>
    );
  }
};

AppRegistry.registerComponent('tictactoe_game', () => tictactoe_game);
