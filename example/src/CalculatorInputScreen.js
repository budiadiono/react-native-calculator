import React from 'react'
import { View, Alert, Text } from 'react-native'
import { CalculatorInput } from 'react-native-calculator'

export default class CalculatorInputScreen extends React.Component {
  static navigationOptions = {
    title: 'Input'
  }

  render() {
    return (
      <View>
        <Field title="Basic">
          <CalculatorInput
            fieldTextStyle={{ fontSize: 24 }}
            fieldContainerStyle={{ height: 36 }}
          />
        </Field>

        <Field title="Prefix">
          <CalculatorInput
            prefix={'$'}
            fieldTextStyle={{ fontSize: 24 }}
            fieldContainerStyle={{ height: 36 }}
          />
        </Field>

        <Field title="Suffix">
          <CalculatorInput
            suffix={'%'}
            fieldTextStyle={{ fontSize: 24 }}
            fieldContainerStyle={{ height: 36 }}
          />
        </Field>

        <Field title="onBeforeChange - try enter value more than 100">
          <CalculatorInput
            fieldTextStyle={{ fontSize: 24 }}
            fieldContainerStyle={{ height: 36 }}
            onBeforeChange={value => {
              if (value > 100) {
                Alert.alert('No more than 100 please!')
                return false
              }

              return true
            }}
          />
        </Field>

        <Field title="onBeforeChangeAsync - try enter value more than 200">
          <CalculatorInput
            fieldTextStyle={{ fontSize: 24 }}
            fieldContainerStyle={{ height: 36 }}
            onBeforeChangeAsync={value => {
              return new Promise(resolve => {
                if (value > 200) {
                  Alert.alert('No more than 200 please!')
                  resolve(false)
                } else {
                  resolve(true)
                }
              })
            }}
          />
        </Field>
      </View>
    )
  }
}

const Field = ({ title, children }) => (
  <View style={{ marginBottom: 20, marginTop: 10 }}>
    <Text style={{ marginHorizontal: 10 }}>{title}</Text>
    {children}
  </View>
)
