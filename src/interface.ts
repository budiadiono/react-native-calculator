export interface CalculatorCommonProps {
  /**
   * Decimal separator sign.
   */
  decimalSeparator?: string

  /**
   * Thousand separator sign.
   */
  thousandSeparator?: string

  /**
   * Numeric button background color.
   */
  numericButtonBackgroundColor?: string

  /**
   * Numeric text button color.
   */
  numericButtonColor?: string

  /**
   * Action button background color.
   */
  actionButtonBackgroundColor?: string

  /**
   * Action text button color.
   */
  actionButtonColor?: string

  /**
   * Calculate button background color.
   */
  calcButtonBackgroundColor?: string

  /**
   * Calculator text button color.
   */
  calcButtonColor?: string

  /**
   * Accept button background color.
   */
  acceptButtonBackgroundColor?: string

  /**
   * Accept text button color.
   */
  acceptButtonColor?: string

  /**
   * Digit display background color.
   */
  displayBackgroundColor?: string

  /**
   * Digit display text color.
   */
  displayColor?: string

  /**
   * Border color.
   */
  borderColor?: string

  /**
   * Button text font size.
   */
  fontSize?: number

  /**
   * Calculator component width.
   */
  width?: number

  /**
   * Calculator component height.
   */
  height?: number

  /**
   * Digit display container height.
   */
  displayHeight?: number

  /**
   * Keyboard container height.
   */
  keyboardHeight?: number

  /**
   * Initial value.
   */
  value?: number

  /**
   * Text change event.
   */
  onTextChange?: (text: string) => void

  /**
   * Digit align display.
   */
  displayTextAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify'

  /**
   * Hide decimal separator button to disable decimal value.
   */
  noDecimal?: boolean

  /**
   * How many decimal places to round the value
   */
  roundTo?: number
}

export const DefaultCommonProps: Partial<CalculatorCommonProps> = {
  decimalSeparator: '.',
  thousandSeparator: ',',
  numericButtonBackgroundColor: '#ffffff',
  numericButtonColor: '#aaaaaa',
  actionButtonBackgroundColor: '#e7e5e3',
  actionButtonColor: '#000000',
  calcButtonBackgroundColor: '#ff8d00',
  calcButtonColor: '#ffffff',
  acceptButtonBackgroundColor: '#14CC60',
  acceptButtonColor: '#ffffff',
  displayBackgroundColor: '#ffffff',
  displayColor: '#000000',
  borderColor: '#52525B',
  fontSize: 18,
  value: 0,
  displayTextAlign: 'left'
}
