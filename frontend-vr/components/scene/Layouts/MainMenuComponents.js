import React from 'react';
import {
  Text,
  View,
} from 'react-vr';

export default class MainMenuComponents extends React.Component {
  render () {
    return (
      <View style={{
        flex: 1,
        width: 5,
        flexDirection: 'column',
        alignItems: 'center',
        layoutOrigin: [0.5, 0.5],
        transform: [{ translate: [0, 0, -5] }]
      }}>
      <Title />
      <Button />
    </View>
    )
  }
}