import React from 'react'
import { ScrollView } from 'react-native'
import { Calculator } from 'react-native-calculator'

export default class FixedSizeCalculatorScreen extends React.Component {

  static navigationOptions = {
    title: 'Custom Size'
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Calculator width={300} height={400} />
      </ScrollView>
    )
  }
}
