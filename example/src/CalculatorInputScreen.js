import React from 'react'
import { View } from 'react-native'
import { CalculatorInput } from 'react-native-calculator'

export default class CalculatorInputScreen extends React.Component {
  static navigationOptions = {
    title: 'Input'
  }

  render() {
    return (
      <View>
        <CalculatorInput
          fieldTextStyle={{ fontSize: 24 }}
          fieldContainerStyle={{ height: 36 }}
        />
      </View>
    )
  }
}
