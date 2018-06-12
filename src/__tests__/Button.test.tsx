import { shallow } from 'enzyme'
import * as React from 'react'
import { Button } from '../Button'

it('renders button correctly', () => {
  const spy = jest.fn()
  const wrapper = shallow(<Button text="foo" onPress={spy} />)
  expect(wrapper).toMatchSnapshot()

  // set props tests
  wrapper.setProps({
    text: 'bar',
    style: {
      borderStyle: 'solid',
      borderRightWidth: 1,
      borderBottomWidth: 1
    },
    textStyle: { color: '#fff', fontSize: 1 }
  })
  expect(wrapper).toMatchSnapshot()

  // press button test
  wrapper
    .first()
    .props()
    .onPressIn()
  expect(spy).toBeCalled()
})
