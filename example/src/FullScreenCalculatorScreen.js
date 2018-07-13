import React from 'react'
import { View } from 'react-native'
import { Calculator } from 'react-native-calculator'

export default class FullScreenCalculatorScreen extends React.Component {
  static navigationOptions = {
    title: 'Full Size'
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Calculator
          style={{ flex: 1 }}
          onTextChange={text => {
            console.log(text)
          }}
        />
      </View>
    )
  }
}
