import * as React from 'react'
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native'
import { Calculator } from './Calculator'
import { CalculatorCommonProps, DefaultCommonProps } from './interface'
import { formatNumber } from './utils'

export interface CalculatorInputProps extends CalculatorCommonProps {
  /**
   * Value change event.
   */
  onChange?: (value: number, text: string) => void

  /**
   * Modal animation type.
   */
  modalAnimationType?: 'none' | 'slide' | 'fade'

  /**
   * Style of modal backdrop.
   */
  modalBackdropStyle?: ViewStyle

  /**
   * Text field container style.
   */
  fieldContainerStyle?: ViewStyle

  /**
   * Text style.
   */
  fieldTextStyle?: TextStyle

  /**
   * Prefix text.
   */
  prefix?: string

  /**
   * Suffix text.
   */
  suffix?: string
}

interface State {
  modalVisible: boolean
  value: number
  text: string
}

export class CalculatorInput extends React.Component<
  CalculatorInputProps,
  State
> {
  static defaultProps: Partial<CalculatorInputProps> = {
    ...DefaultCommonProps,
    suffix: '',
    prefix: ''
  }

  constructor(props: CalculatorInputProps) {
    super(props)

    const value = props.value || 0

    this.calculatorModalToggle = this.calculatorModalToggle.bind(this)
    this.state = {
      modalVisible: false,
      value,
      text: formatNumber(
        value,
        props.decimalSeparator as string,
        props.thousandSeparator as string
      )
    }
  }

  render() {
    return (
      <View
        onLayout={() => {
          if (this.state.modalVisible) {
            this.forceUpdate()
          }
        }}
      >
        {this.renderTextField()}
        {this.renderCalulatorModal()}
      </View>
    )
  }

  renderTextField() {
    const { fieldContainerStyle, fieldTextStyle, prefix, suffix } = this.props

    return (
      <View style={[styles.container, fieldContainerStyle]}>
        <TouchableOpacity
          onPress={this.calculatorModalToggle}
          style={styles.innerContainer}
        >
          <Text style={[styles.text, fieldTextStyle]}>
            {prefix + this.state.text + suffix}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderCalulatorModal() {
    const { modalAnimationType, modalBackdropStyle, onChange } = this.props
    const dimension = Dimensions.get('window')

    const height = this.props.height || dimension.height - dimension.height / 3
    const width = this.props.width || dimension.width

    return (
      <Modal
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={this.calculatorModalToggle}
        animationType={modalAnimationType}
      >
        <TouchableWithoutFeedback
          onPress={this.calculatorModalToggle}
          style={styles.modalContainer}
        >
          <View style={[styles.backdrop, modalBackdropStyle]}>
            <Calculator
              hasAcceptButton
              onAccept={(value, text) => {
                this.setState({ value, text }, () => {
                  if (onChange) {
                    onChange(value, text)
                  }
                  this.calculatorModalToggle()
                })
              }}
              {...this.props}
              value={this.state.value}
              height={height}
              width={width}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  calculatorModalToggle() {
    const { modalVisible } = this.state
    this.setState({ modalVisible: !modalVisible })
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    height: 24,
    margin: 10
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  text: {
    fontSize: 16
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  modalContainer: {
    flex: 1
  }
})
