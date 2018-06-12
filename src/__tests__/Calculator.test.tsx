import { shallow } from 'enzyme'
import * as React from 'react'
import { NativeModules } from 'react-native'
import { Calculator } from '../Calculator'

NativeModules.UIManager = {
  measureLayoutRelativeToParent: jest.fn()
}

it('renders calculator correctly', () => {
  const wrapper = shallow(<Calculator />)
  expect(wrapper).toMatchSnapshot()
})
