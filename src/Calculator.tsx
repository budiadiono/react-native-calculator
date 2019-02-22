import * as React from 'react'
import {
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native'
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
  /**
   * Show accept button after calculate.
   */
  hasAcceptButton?: boolean

  /**
   * Container style.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Calculate button click event.
   */
  onCalc?: (value: number, text: string) => void

  /**
   * Accept button click event.
   */
  onAccept?: (value: number, text: string) => void

  /**
   * Hide display text field.
   */
  hideDisplay?: boolean
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
  trailing: string
}

interface ButtonSize {
  width: number
  height: number
  displayHeight: number
}

export class Calculator extends React.Component<CalculatorProps, State> {
  static defaultProps: Partial<CalculatorProps> = DefaultCommonProps

  calculated: boolean = false
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
    const { keyboardHeight, hideDisplay } = this.props
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
      if (displayHeight || hideDisplay) {
        height = ((height as number) - (displayHeight || 0)) / 5
      } else {
        height = (height as number) / 6
      }
    }

    if (!displayHeight) {
      displayHeight = hideDisplay
        ? 0
        : keyboardHeight
          ? containerHeight - keyboardHeight
          : height
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
      hasAcceptButton,
      hideDisplay,
      displayTextAlign,
      noDecimal
    } = this.props

    const done = this.state.done && hasAcceptButton

    if (!btnSize) {
      return null
    }

    return (
      <View>
        {!hideDisplay && (
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
              style={{ color: displayColor, textAlign: displayTextAlign }}
            />
          </View>
        )}
        <View
          style={[
            Styles.row,
            hideDisplay
              ? { borderTopWidth: 1, borderTopColor: borderColor }
              : undefined
          ]}
        >
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
            {noDecimal ? (
              <View style={Styles.row}>
                {this.renderNumberButton(btnSize, '0', true)}
                {this.renderNumberButton(btnSize, '000', false, 2)}
              </View>
            ) : (
              <View style={Styles.row}>
                {this.renderNumberButton(btnSize, '0', true)}
                {this.renderNumberButton(btnSize, '000')}
                {!noDecimal &&
                  this.renderNumberButton(btnSize, decimalSeparator as string)}
              </View>
            )}
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
    mostLeft: boolean = false,
    scaleX: number = 1
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
            width: btnSize.width * scaleX,
            height: btnSize.height
          }
        ]}
        textStyle={{ color: numericButtonColor, fontSize }}
        text={value}
        onPress={() => {
          if (this.calculated) {
            // clear answer replace with entered number
            this.calculated = false
            this.stacks = [
              {
                kind: StackKindEnum.NUMBER,
                value: '',
                text: '',
                trailing: ''
              }
            ]
          }

          let stack = this.stacks[this.stacks.length - 1]

          // add new stack if current tag is a sign
          if (stack.kind === StackKindEnum.SIGN) {
            stack = {
              kind: StackKindEnum.NUMBER,
              value: '',
              text: '',
              trailing: ''
            }
            this.stacks.push(stack)
          }

          // evaluating decimal separator
          if (value === decimalSeparator) {
            if (!stack.value && !stack.text) {
              stack.text = '0'
              stack.value = '0'
            }
            if (
              stack.value.indexOf(decimalSeparator) > -1 ||
              stack.value === 'Infinity' ||
              stack.value === '-Infinity'
            ) {
              return
            }
            stack.trailing = decimalSeparator
          } else if (value === '0' || value === '000') {
            if (
              stack.value.indexOf(decimalSeparator as string) > -1 ||
              stack.trailing !== ''
            ) {
              stack.trailing = stack.trailing + value
              value = ''
            }
          } else {
            if (stack.trailing) {
              value = stack.trailing + value
              stack.trailing = ''
            }
          }

          // get editing value
          const val = parseFloat(
            (stack.value + value).replace(decimalSeparator as string, '.')
          )

          // modify current stack
          stack.value = val.toString()
          stack.text = this.format(val)
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
          if (this.calculated) {
            // continue to use this answer
            this.calculated = false
          }

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
                  let { value, trailing } = stack
                  const { decimalSeparator } = this.props

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

                  if (value === '0' && !trailing) {
                    return
                  }

                  if (trailing !== '') {
                    stack.trailing = trailing.slice(0, trailing.length - 1)
                  } else {
                    if (value.length <= 1) {
                      this.popStack()
                    } else {
                      value = value.slice(0, value.length - 1)

                      while (value.slice(-1) === '0') {
                        value = value.slice(0, value.length - 1)
                        trailing = trailing + '0'
                      }

                      // keep decimal separator displayed
                      let sep = ''
                      if (value[value.length - 1] === '.') {
                        sep = this.props.decimalSeparator as string
                      } else {
                        // skip trailing when no decimal separator found
                        value += trailing
                        trailing = ''
                      }

                      // get editing value
                      const val = parseFloat(
                        value.replace(decimalSeparator as string, '.')
                      )

                      stack.value = val.toString()
                      stack.text = this.format(val)
                      stack.trailing = sep + trailing
                    }
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
    const { onCalc, onAccept, hasAcceptButton, roundTo = 2 } = this.props

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
    const value = Math.round(num * 10 ** roundTo) / 10 ** roundTo
    const text = this.format(value)

    this.stacks = [
      {
        kind: StackKindEnum.NUMBER,
        value: value.toString(),
        text,
        trailing: ''
      }
    ]

    this.setText(true, () => {
      if (onCalc) {
        onCalc(value, text)
      }

      if (hasAcceptButton && onAccept && this.state.done) {
        onAccept(value, text)
      }
      this.calculated = true
    })
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
        text: this.format(value),
        trailing: ''
      }
    ]
    this.setText()
  }

  setSign(sign: string) {
    const stack = this.stacks[this.stacks.length - 1]
    if (stack.kind === StackKindEnum.SIGN) {
      // only '-' sign allowed for first input
      if (this.stacks.length <= 1 && sign !== '-') {
        return
      }
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
        stack.kind = StackKindEnum.SIGN
        stack.text = sign
        stack.value = sign
      } else {
        this.stacks.push({
          kind: StackKindEnum.SIGN,
          text: sign,
          value: sign,
          trailing: ''
        })
      }
    }
    this.setText()
  }

  setText(done: boolean = false, callback?: () => void) {
    const text = this.stacks.map(s => s.text + (s.trailing || '')).join(' ')
    if (!done) {
      done = this.stacks.length === 1
    }

    this.setState({ text, done }, () => {
      const { onTextChange } = this.props
      if (onTextChange) {
        onTextChange(text)
      }

      if (callback) {
        callback()
      }
    })
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
