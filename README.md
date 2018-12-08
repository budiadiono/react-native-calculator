# React Native Calculator

[![npm version](https://badge.fury.io/js/react-native-calculator.svg)](https://badge.fury.io/js/react-native-calculator)
[![build status](https://travis-ci.org/budiadiono/react-native-calculator.svg)](https://travis-ci.org/budiadiono/react-native-calculator)

Simple react native calculator and calculator input component.

## Installation

Using npm:

```
npm i -S react-native-calculator
```

or yarn:

```
yarn add react-native-calculator
```

## Demo

<a href="https://snack.expo.io/@budiadiono/react-native-calculator-example" target="_blank">
<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=exp://expo.io/@budiadiono/react-native-calculator-example">
</a>

## Calculator Component

<img alt="react-native-gifted-chat" src="https://thumbs.gfycat.com/EnchantingVainFallowdeer-size_restricted.gif" width="261" height="464" /> <img alt="react-native-gifted-chat" src="https://thumbs.gfycat.com/BeautifulTimelyAmoeba-size_restricted.gif" width="261" height="464" />

### Usage

```javascript
import React from 'react'
import { View } from 'react-native'
import { Calculator } from 'react-native-calculator'

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Calculator style={{ flex: 1 }} />
      </View>
    )
  }
}
```

### Props

All props in [common props](#common-props) and...

| Prop Name       | Data Type                                   | Default Value | Description                         |
| --------------- | ------------------------------------------- | ------------- | ----------------------------------- |
| hasAcceptButton | boolean                                     | false         | Show accept button after calculate. |
| style           | ViewStyle                                   |               | Container style.                    |
| onCalc          | `(value : number , text : string ) => void` |               | Calculate button click event.       |
| onAccept        | `(value : number , text : string ) => void` |               | Accept button click event.          |
| hideDisplay     | boolean                                     | false         | Hide display text field.            |

## Calculator Input Component

<img alt="react-native-gifted-chat" src="https://thumbs.gfycat.com/DismalSpotlessAcaciarat-size_restricted.gif" width="261" height="464" />

### Usage

```javascript
import React from 'react'
import { View } from 'react-native'
import { CalculatorInput } from 'react-native-calculator'

export default class App extends React.Component {
  render() {
    return (
      <View>
        <CalculatorInput
          fieldTextStyle={{ fontSize: 24 }}
          fieldContainerStyle={{ height: 36 }}
        />
      </View>
    )
  }
}
```

### Props

All props in [common props](#common-props) and...

| Prop Name           | Data Type                                               | Default Value | Description                                                                              |
| ------------------- | ------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------- |
| modalAnimationType  | 'none'                                                  | 'slide'       | 'fade'                                                                                   | slide | Modal animation type. |
| modalBackdropStyle  | ViewStyle                                               |               | Style of modal backdrop.                                                                 |
| fieldContainerStyle | ViewStyle                                               |               | Text field container style.                                                              |
| fieldTextStyle      | TextStyle                                               |               | Text style.                                                                              |
| onChange            | `(value : number , text : string ) => void`             |               | Value change event.                                                                      |
| prefix              | string                                                  |               | Prefix.                                                                                  |
| suffix              | string                                                  |               | Suffix.                                                                                  |
| onBeforeChange      | `(value : number , text : string ) => boolean`          |               | Called before changes applied. Return true if changes are accepted.                      |
| onBeforeChangeAsync | `(value : number , text : string ) => Promise<boolean>` |               | Called asynchronously before changes applied. Resolve with true if changes are accepted. |

## Common Props

| Prop Name                    | Data Type                                          | Default Value | Description                                             |
| ---------------------------- | -------------------------------------------------- | ------------- | ------------------------------------------------------- |
| decimalSeparator             | string                                             | .             | Decimal separator sign.                                 |
| thousandSeparator            | string                                             | ,             | Thousand separator sign.                                |
| numericButtonBackgroundColor | string                                             | #ffffff       | Numeric button background color.                        |
| numericButtonColor           | string                                             | #aaaaaa       | Numeric text button color.                              |
| actionButtonBackgroundColor  | string                                             | #e7e5e3       | Action button background color.                         |
| actionButtonColor            | string                                             | #000000       | Action text button color.                               |
| calcButtonBackgroundColor    | string                                             | #ff8d00       | Calculate button background color.                      |
| calcButtonColor              | string                                             | #ffffff       | Calculator text button color.                           |
| acceptButtonBackgroundColor  | string                                             | #14CC60       | Accept button background color.                         |
| acceptButtonColor            | string                                             | #ffffff       | Accept text button color.                               |
| displayBackgroundColor       | string                                             | #ffffff       | Digit display background color.                         |
| displayColor                 | string                                             | #000000       | Digit display text color.                               |
| borderColor                  | string                                             | #52525B       | Border color.                                           |
| fontSize                     | number                                             | 18            | Button text font size.                                  |
| value                        | number                                             | 0             | Initial value.                                          |
| width                        | number                                             | (auto)        | Calculator component width.                             |
| height                       | number                                             | (auto)        | Calculator component height.                            |
| displayHeight                | number                                             | (auto)        | Digit display container height.                         |
| keyboardHeight               | number                                             | (auto)        | Keyboard container height.                              |
| onTextChange                 | (text: string) => void                             |               | Text change event.                                      |
| displayTextAlign             | `"auto" / "left" / "right" / "center" / "justify"` | `"left"`      | Digit align display.                                    |
| noDecimal                    | boolean                                            | false         | Hide decimal separator button to disable decimal value. |
| roundTo                      | number                                             | 2             | How many decimal places to round the value              |

## License

MIT
