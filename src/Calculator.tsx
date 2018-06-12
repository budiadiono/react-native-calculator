import * as React from 'react'
import { LayoutRectangle, StyleSheet, View, ViewStyle } from 'react-native'
import { Button } from './Button'
import { Display } from './Display'
import { CalculatorCommonProps, DefaultCommonProps } from './interface'
import { formatNumber } from './utils'

enum ActionEnum {
  CLEAR,
  DIVIDE,
  MULTIPLY,
  BACK,
  MINUS,
  PLUS,
  ENTER
}

enum StackKindEnum {
  NUMBER,
  SIGN
}

export interface CalculatorProps extends CalculatorCommonProps {
  hasAcceptButton?: boolean
  style?: ViewStyle
  onCalc?: (value: number, text: string) => void
  onAccept?: (value: number, text: string) => void
}

interface State {
  text: string
  done: boolean
  btnSize?: ButtonSize
}

interface CalcStack {
  value: string
  kind: StackKindEnum
  text: string
}

interface ButtonSize {
  width: number
  height: number
  displayHeight: number
}

export class Calculator extends React.Component<CalculatorProps, State> {
  static defaultProps: Partial<CalculatorProps> = DefaultCommonProps

  stacks: CalcStack[] = []
  display?: Display

  constructor(props: CalculatorProps) {
    super(props)
    this.calculate = this.calculate.bind(this)
    this.state = {
      text: '',
      done: false
    }
  }

  getButtonSize(window: LayoutRectangle): ButtonSize {
    const { keyboardHeight } = this.props
    let { displayHeight, height, width } = this.props
    if (!height) {
      height = window.height - window.y
    }

    if (!width) {
      width = window.width - window.x
    }

    width = (width as number) / 4
    const containerHeight = height

    if (keyboardHeight) {
      height = keyboardHeight / 5
    } else {
      if (!displayHeight) {
        height = (height as number) / 6
      } else {
        height = ((height as number) - displayHeight) / 5
      }
    }

    if (!displayHeight) {
      displayHeight = keyboardHeight ? containerHeight - keyboardHeight : height
    }

    return {
      width,
      height,
      displayHeight
    }
  }

  componentDidMount() {
    this.clear(this.props.value)
  }

  render() {
    const { style } = this.props
    return (
      <View
        style={style}
        onLayout={e => {
          const btnSize = this.getButtonSize(e.nativeEvent.layout)
          this.setState({ btnSize }, () => {
            if (this.display) {
              this.display.tryNewSize(true)
            }
          })
        }}
      >
        {this.renderMain()}
      </View>
    )
  }

  renderMain() {
    const { text, btnSize } = this.state
    const {
      decimalSeparator,
      calcButtonBackgroundColor,
      calcButtonColor,
      acceptButtonBackgroundColor,
      acceptButtonColor,
      displayBackgroundColor,
      displayColor,
      borderColor,
      fontSize,
      width,
      hasAcceptButton
    } = this.props

    const done = this.state.done && hasAcceptButton

    if (!btnSize) {
      return null
    }

    return (
      <View>
        <View
          style={[
            Styles.displayContainer,
            {
              backgroundColor: displayBackgroundColor,
              borderColor,
              width,
              height: btnSize.displayHeight
            }
          ]}
        >
          <Display
            height={btnSize.displayHeight}
            width={btnSize.width * 4 - 20}
            value={text}
            ref={e => {
              this.display = e as Display
            }}
            style={{ color: displayColor }}
          />
        </View>
        <View style={Styles.row}>
          {this.renderActionButton(btnSize, 'C', ActionEnum.CLEAR, true)}
          {this.renderActionButton(btnSize, '/', ActionEnum.DIVIDE)}
          {this.renderActionButton(btnSize, '*', ActionEnum.MULTIPLY)}
          {this.renderActionButton(btnSize, '❮', ActionEnum.BACK)}
        </View>
        <View style={Styles.row}>
          {this.renderNumberButton(btnSize, '7', true)}
          {this.renderNumberButton(btnSize, '8')}
          {this.renderNumberButton(btnSize, '9')}
          {this.renderActionButton(btnSize, '-', ActionEnum.MINUS)}
        </View>
        <View style={Styles.row}>
          {this.renderNumberButton(btnSize, '4', true)}
          {this.renderNumberButton(btnSize, '5')}
          {this.renderNumberButton(btnSize, '6')}
          {this.renderActionButton(btnSize, '+', ActionEnum.PLUS)}
        </View>
        <View style={Styles.row}>
          <View style={{}}>
            <View style={Styles.row}>
              {this.renderNumberButton(btnSize, '1', true)}
              {this.renderNumberButton(btnSize, '2')}
              {this.renderNumberButton(btnSize, '3')}
            </View>
            <View style={Styles.row}>
              {this.renderNumberButton(btnSize, '0', true)}
              {this.renderNumberButton(btnSize, '000')}
              {this.renderNumberButton(btnSize, decimalSeparator as string)}
            </View>
          </View>
          <Button
            style={[
              Styles.square,
              {
                borderColor,
                height: btnSize.height * 2,
                backgroundColor: done
                  ? acceptButtonBackgroundColor
                  : calcButtonBackgroundColor,
                width: btnSize.width
              }
            ]}
            textStyle={{
              color: done ? acceptButtonColor : calcButtonColor,
              fontSize: (fontSize as number) * 2
            }}
            text={done ? '↲' : '='}
            onPress={this.calculate}
          />
        </View>
      </View>
    )
  }

  renderNumberButton(
    btnSize: ButtonSize,
    value: string,
    mostLeft: boolean = false
  ) {
    const {
      decimalSeparator,
      numericButtonBackgroundColor,
      numericButtonColor,
      borderColor,
      fontSize
    } = this.props

    return (
      <Button
        style={[
          Styles.square,
          {
            borderColor,
            backgroundColor: numericButtonBackgroundColor,
            borderLeftWidth: mostLeft ? 1 : 0,
            width: btnSize.width,
            height: btnSize.height
          }
        ]}
        textStyle={{ color: numericButtonColor, fontSize }}
        text={value}
        onPress={() => {
          let stack = this.stacks[this.stacks.length - 1]

          // add new stack if current tag is a sign
          if (stack.kind === StackKindEnum.SIGN) {
            stack = {
              kind: StackKindEnum.NUMBER,
              value: '',
              text: ''
            }
            this.stacks.push(stack)
          }

          // evaluating decimal separator
          let sepVal = ''
          let sepText = ''

          if (value === decimalSeparator) {
            if (
              stack.value.indexOf(decimalSeparator) > -1 ||
              stack.value === 'Infinity' ||
              stack.value === '-Infinity'
            ) {
              return
            }
            sepVal = '.'
            sepText = decimalSeparator
          }

          // get editing value
          const val = parseFloat(stack.value + value)

          // modify current stack
          stack.value = val.toString() + sepVal
          stack.text = this.format(val) + sepText
          this.setText()
        }}
      />
    )
  }

  renderActionButton(
    btnSize: ButtonSize,
    value: string,
    action: ActionEnum,
    mostLeft: boolean = false
  ) {
    const {
      actionButtonBackgroundColor,
      actionButtonColor,
      borderColor,
      fontSize
    } = this.props

    return (
      <Button
        style={[
          Styles.square,
          {
            borderColor,
            backgroundColor: actionButtonBackgroundColor,
            borderLeftWidth: mostLeft ? 1 : 0,
            width: btnSize.width,
            height: btnSize.height
          }
        ]}
        textStyle={{ color: actionButtonColor, fontSize }}
        text={value}
        onPress={() => {
          // tslint:disable-next-line:switch-default
          switch (action) {
            case ActionEnum.CLEAR:
              this.clear()
              break

            case ActionEnum.PLUS:
              this.setSign('+')
              break

            case ActionEnum.MINUS:
              this.setSign('-')
              break

            case ActionEnum.MULTIPLY:
              this.setSign('*')
              break

            case ActionEnum.DIVIDE:
              this.setSign('/')
              break

            case ActionEnum.BACK:
              if (!this.stacks.length) {
                this.clear()
              } else {
                const stack = this.stacks[this.stacks.length - 1]

                if (stack.kind === StackKindEnum.SIGN) {
                  this.popStack()
                } else {
                  let { value } = stack

                  if (
                    !value ||
                    (value.length === 2 && value.startsWith('-')) ||
                    value === '-' ||
                    value === 'Infinity' ||
                    value === '-Infinity'
                  ) {
                    this.clear()
                    return
                  }

                  if (value === '0') {
                    return
                  }

                  value = value.slice(0, value.length - 1)
                  if (!value) {
                    this.popStack()
                  } else {
                    stack.value = value

                    // keep decimal separator displayed
                    let sep = ''
                    if (value[value.length - 1] === '.') {
                      sep = this.props.decimalSeparator as string
                    }

                    stack.text = this.format(parseFloat(value)) + sep
                  }
                }
              }
              this.setText()

              break
          }
        }}
      />
    )
  }

  calculate() {
    const { onCalc, onAccept, hasAcceptButton } = this.props

    if (!this.stacks.length) {
      this.clear()
      return
    }

    const stack = this.stacks[this.stacks.length - 1]

    if (stack.kind === StackKindEnum.SIGN) {
      this.popStack()
    } else if (this.stacks.length === 1 && stack.value === '-') {
      this.clear()
      return
    }

    // tslint:disable-next-line:no-eval
    const num = eval(this.stacks.map(x => x.value).join('') || '0')
    const value = Math.round(num * 100) / 100
    const text = this.format(value)

    this.stacks = [
      {
        kind: StackKindEnum.NUMBER,
        value: value.toString(),
        text
      }
    ]

    if (onCalc) {
      onCalc(value, text)
    }

    if (hasAcceptButton && onAccept && this.state.done) {
      onAccept(value, text)
    }

    this.setText(true)
  }

  popStack() {
    this.stacks.pop()
    if (!this.stacks.length) {
      this.clear()
    }
  }

  clear(value: number = 0) {
    this.stacks = [
      {
        kind: StackKindEnum.NUMBER,
        value: value.toString(),
        text: this.format(value)
      }
    ]
    this.setText()
  }

  setSign(sign: string) {
    const stack = this.stacks[this.stacks.length - 1]
    if (stack.kind === StackKindEnum.SIGN) {
      stack.text = sign
      stack.value = sign
    } else {
      if (
        !stack.value ||
        stack.value === 'Infinity' ||
        stack.value === '-Infinity'
      ) {
        return
      }
      if (sign === '-' && this.stacks.length === 1 && stack.value === '0') {
        stack.text = sign
        stack.value = sign
      } else {
        this.stacks.push({
          kind: StackKindEnum.SIGN,
          text: sign,
          value: sign
        })
      }
    }
    this.setText()
  }

  setText(done: boolean = false) {
    const text = this.stacks.map(s => s.text).join(' ')
    if (!done) {
      done = this.stacks.length === 1
    }
    this.setState({ text, done })
  }

  format(num: number) {
    const { decimalSeparator, thousandSeparator } = this.props
    return formatNumber(
      num,
      decimalSeparator as string,
      thousandSeparator as string
    )
  }
}

const Styles = StyleSheet.create({
  displayContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 0,
    paddingTop: 0,
    margin: 0
  },
  row: {
    flexDirection: 'row',
    alignContent: 'stretch',
    flexWrap: 'wrap'
  },
  square: {
    borderStyle: 'solid',
    borderRightWidth: 1,
    borderBottomWidth: 1
  }
})
