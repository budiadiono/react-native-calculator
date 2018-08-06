import { shallow } from 'enzyme'
import * as React from 'react'
import { NativeModules } from 'react-native'
import { Display } from '../Display'

NativeModules.UIManager = {
  measureLayoutRelativeToParent: jest.fn()
}

it('renders display correctly', () => {
  const wrapper = shallow(
    <Display
      width={400}
      height={100}
      value={'1.000'}
      style={{ color: '#000' }}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
