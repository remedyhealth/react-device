import React from 'react'
import { mount } from 'enzyme'

import Device, { LANDSCAPE, PORTRAIT } from './index'

const map = {}
window.addEventListener = jest.fn((event, cb) => {
  map[event] = cb
})
window.removeEventListener = jest.fn((event, cb) => {
  delete map[event]
})
window.getComputedStyle = jest.fn(() => ({ getPropertyValue: () => '16px' }))

jest.useFakeTimers()

let mountedWrappers = []

const wrap = (props = {onChange: defaultOnChange}) => {
  let r = mount(<Device {...props} />)
  mountedWrappers.push(r)
  return r
}

const defaultOnChange = () => {}

afterEach(() => {
  mountedWrappers.forEach(wrapper => {
    wrapper.unmount()
  })
  mountedWrappers = []
})

test('should not render anything', () => {
  const wrapper = wrap()
  expect(wrapper.children().exists()).toBeFalsy()
})

test('should add onChange to list of static listeners', () => {
  let deviceInfo = {}
  const myOnChange = (e) => { deviceInfo = e }
  const wrapper = wrap({onChange: myOnChange})

  expect(Device._listeners).toHaveLength(1)
  expect(Device._listeners[0]).toEqual(myOnChange)
  jest.runAllTimers()
  expect(Object.keys(deviceInfo)).toEqual(['screen', 'ua', 'browser', 'engine', 'os', 'device', 'cpu'])
})

test('should have static list of listeners', () => {
  let deviceInfo = {}
  const myOnChange = (e) => { deviceInfo = e }
  const wrapper = wrap({onChange: myOnChange})

  let anotherDeviceInfo = {}
  const anotherOnChange = (e) => { anotherDeviceInfo = e }
  const anotherWrapper = wrap({onChange: anotherOnChange})

  expect(Device._listeners).toHaveLength(2)
  expect(Device._listeners[0]).toEqual(myOnChange)
  expect(Device._listeners[1]).toEqual(anotherOnChange)
  jest.runAllTimers()
  expect(Object.keys(deviceInfo)).toEqual(['screen', 'ua', 'browser', 'engine', 'os', 'device', 'cpu'])
  expect(Object.keys(anotherDeviceInfo)).toEqual(['screen', 'ua', 'browser', 'engine', 'os', 'device', 'cpu'])
})

test('should fire onChange when window resizes', () => {
  let onChangeCount = 0
  const myOnChange = (e) => { onChangeCount++ }
  const wrapper = wrap({onChange: myOnChange})
  jest.runAllTimers()
  expect(onChangeCount).toEqual(1)
  map['resize']()
  jest.runAllTimers()
  expect(onChangeCount).toEqual(2)
})

test('should fire onChange to list of static listeners when window resizes', () => {
  let onChangeCount = 0
  const myOnChange = (e) => { onChangeCount++ }
  const wrapper = wrap({onChange: myOnChange})
  const anotherOnChange = (e) => { onChangeCount++ }
  const anotherWrapper = wrap({onChange: anotherOnChange})

  jest.runAllTimers()
  expect(onChangeCount).toEqual(2)
  map['resize']()
  jest.runAllTimers()
  expect(onChangeCount).toEqual(4)
})

test('should remove resize eventlistener when unmounted', () => {
  const myOnChange = (e) => {}
  const wrapper = wrap({onChange: myOnChange})
  expect(map.hasOwnProperty('resize')).toBeTruthy()
  wrapper.unmount()
  expect(map.hasOwnProperty('resize')).toBeFalsy()
})

test('should accept user agent via props', () => {
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
  let deviceInfo = {}
  const myOnChange = (e) => { deviceInfo = e }
  const wrapper = wrap({onChange: myOnChange, userAgent })

  expect(Device._listeners).toHaveLength(1)
  expect(Device._listeners[0]).toEqual(myOnChange)
  jest.runAllTimers()
  expect(Object.keys(deviceInfo)).toEqual(['screen', 'ua', 'browser', 'engine', 'os', 'device', 'cpu'])
  expect(deviceInfo.browser).toEqual({
    major: '56',
    name: 'Chrome',
    version: '56.0.2924.87'
  })
})

test('should determine defaultFontSize && widthEm', () => {
  const wrapper = wrap()

  const deviceInfo = Device._buildDeviceInfo()
  expect(Object.keys(deviceInfo)).toEqual(['screen', 'ua', 'browser', 'engine', 'os', 'device', 'cpu'])
  expect(deviceInfo.screen).toEqual({
    width: 1024,
    height: 768,
    orientation: 'landscape',
    defaultFontSize: 16,
    widthEm: 64
  })
})
