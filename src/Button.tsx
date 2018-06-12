import * as React from 'react'
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'

export interface ButtonProps {
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  text?: string
  onPress?: (event: GestureResponderEvent) => void
}

export class Button extends React.Component<ButtonProps> {
  render() {
    const { style, text, textStyle, onPress } = this.props

    return (
      <TouchableOpacity style={[style]} onPressIn={onPress}>
        <View style={styles.container}>
          <Text style={textStyle}>{text}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
