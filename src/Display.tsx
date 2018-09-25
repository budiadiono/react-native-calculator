import * as React from 'react'
import {
  findNodeHandle,
  NativeModules,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View
} from 'react-native'

const FACTOR = 0.5

interface State {
  size: number
  fixSize: number
  fixValue: string
  complete: boolean
  ready: boolean
  fontHeight: number
}

export interface DisplayProps {
  height: number
  width: number
  value: string
  style: StyleProp<TextStyle>
}

export class Display extends React.Component<DisplayProps, State> {
  _text?: Text | null
  _mounted: boolean = false

  constructor(props: DisplayProps) {
    super(props)
    this.tryNewSize = this.tryNewSize.bind(this)
    this.state = {
      size: props.height - FACTOR,
      fixSize: props.height - FACTOR,
      fixValue: props.value,
      complete: false,
      ready: false,
      fontHeight: FACTOR
    }
  }

  tryNewSize(force?: boolean) {
    if (!this._mounted || Platform.OS === 'ios') {
      return
    }

    if (force) {
      this.setState({ complete: false, ready: false })
    }

    NativeModules.UIManager.measureLayoutRelativeToParent(
      findNodeHandle(this._text as Text),
      () => {
        throw new Error('error')
      },
      (_x: number, _y: number, w: number, h: number) => {
        this.isSizeOk(w, h)
      }
    )
  }

  isSizeOk(w: number, h: number) {
    if (!this._mounted) {
      return
    }

    const { complete } = this.state
    let { size } = this.state
    const { height, width, value } = this.props

    if (h > height || w > width) {
      if (size === FACTOR) {
        this.setState({ complete: true })
      } else {
        this.setState({ size: (size -= FACTOR), complete: true })
        this.tryNewSize()
      }
    } else {
      if (!complete) {
        this.setState({ size: (size += FACTOR) })
        this.tryNewSize()
      } else {
        this.setState({
          ready: true,
          fixSize: size,
          fixValue: value,
          fontHeight: h
        })
      }
    }
  }

  componentDidMount() {
    this._mounted = true
    this.tryNewSize()
  }

  componentWillUnmount() {
    this._mounted = false
  }

  componentDidUpdate(newProps: DisplayProps) {
    if (Platform.OS === 'ios') {
      return
    }

    if (this.props.value !== newProps.value) {
      this.setState({ complete: false }, this.tryNewSize)
    }
  }

  render() {
    return Platform.OS === 'ios' ? this.renderIOS() : this.renderAndroid()
  }

  renderIOS() {
    const { height, style, value } = this.props
    return (
      <View>
        <Text
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          style={[
            styles.displayText,
            style,
            {
              fontSize: height,
              height,
              lineHeight: height,
              // @ts-ignore
              color: style.color
            }
          ]}
        >
          {value}
        </Text>
      </View>
    )
  }

  renderAndroid() {
    const { size, fixSize, fixValue, fontHeight, ready } = this.state
    const { value, height, style } = this.props

    return (
      <View>
        <Text
          ref={component => (this._text = component)}
          style={[styles.hiddenText, { fontSize: size }]}
        >
          {value}
        </Text>
        <Text
          style={[
            // ready ? styles.displayText : styles.hiddenText,
            styles.displayText,
            style,
            {
              fontSize: fixSize,
              height,
              top: (height - fontHeight) / 2,
              // @ts-ignore
              color: ready ? style.color : 'transparent'
            }
          ]}
        >
          {fixValue}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  hiddenText: {
    backgroundColor: 'transparent',
    color: 'transparent'
  },
  displayText: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent'
  }
})
