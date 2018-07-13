import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Constants } from 'expo'
import { createBottomTabNavigator } from 'react-navigation'
import FullScreenCalculatorScreen from './FullScreenCalculatorScreen'
import FixedSizeCalculatorScreen from './FixedSizeCalculatorScreen'
import CalculatorInputScreen from './CalculatorInputScreen'
import HideDisplayCalculatorScreen from './HideDisplayCalculatorScreen'

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.statusBar} />
        <MainNav />
      </View>
    )
  }
}

const MainNav = createBottomTabNavigator(
  {
    FullScreen: FullScreenCalculatorScreen,
    FixedSize: FixedSizeCalculatorScreen,
    HidDisplay: HideDisplayCalculatorScreen,
    CalculatorInput: CalculatorInputScreen,    
  },
  {
    tabBarOptions: {
      style: {
        justifyContent: 'center',
        alignItems: 'center'
      },
      labelStyle: {
        fontSize: 14
      },
      showIcon: false
    }
  }
)

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: '#ff8d00',
    height: Constants.statusBarHeight
  }
})