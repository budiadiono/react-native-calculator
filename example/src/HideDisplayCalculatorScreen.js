import React from 'react'
import { ScrollView, Text } from 'react-native'
import { Calculator } from 'react-native-calculator'

export default class HideDisplayCalculatorScreen extends React.Component {
  static navigationOptions = {
    title: 'Hide Display'
  }

  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
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
        <Calculator
          width={300}
          height={400}
          hideDisplay
          onTextChange={text => this.setState({ text })}
        />
        <Text style={{ marginTop: 20, fontSize: 18 }}>{this.state.text}</Text>
      </ScrollView>
    )
  }
}
