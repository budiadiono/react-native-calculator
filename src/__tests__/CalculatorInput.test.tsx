import { shallow } from 'enzyme'
import * as React from 'react'
import { NativeModules } from 'react-native'
import { CalculatorInput } from '../CalculatorInput'

NativeModules.UIManager = {
  measureLayoutRelativeToParent: jest.fn()
}

it('renders calculator input correctly', () => {
  const wrapper = shallow(<CalculatorInput />)
  expect(wrapper).toMatchSnapshot()
})
