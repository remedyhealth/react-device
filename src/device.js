import React, { Component, PropTypes } from 'react'
import debounce from 'lodash/debounce'
import parser from 'ua-parser-js'

export const SIZE_UNKNOWN = null
export const LANDSCAPE = 'landscape'
export const PORTRAIT = 'portrait'

/**
 *
 */
class Device extends Component {
  static _buildDeviceInfo() {
    const windowDetails = {
      width: SIZE_UNKNOWN,
      height: SIZE_UNKNOWN,
      orientation: LANDSCAPE
    }

    if (global.window) {
      windowDetails.width = window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      windowDetails.height = window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
        windowDetails.orientation = (windowDetails.width > windowDetails.height) ? LANDSCAPE : PORTRAIT
    }

    return {
      screen: windowDetails,
      ...Device.details
    }
  }

  static _onChange() {
    Device._publish(Device._listeners)
  }

  static _publish(listeners) {
    const deviceInfo = Device._buildDeviceInfo()
    listeners.forEach(listener => {
      listener(deviceInfo)
    })
  }

  static _listeners = []
  static DEBOUNCE_TIME = 250
  static details = {}

  constructor (props) {
    super(props)
    Device.details = parser(props.userAgent)
    if (!Device._debouncedChange) {
      Device._debouncedChange = debounce(Device._onChange, Device.DEBOUNCE_TIME)
    }
    Device._publish([props.onChange])
  }

  componentDidMount () {
    if (!Device._listeners.length) {
      window.addEventListener('resize', Device._debouncedChange, true)
    }
    Device._listeners.push(this.props.onChange)
  }

  componentWillUnmount () {
    const idx = Device._listeners.indexOf(this.props.onChange)
    Device._listeners.splice(idx, 1)
    if (!Device._listeners.length) {
      window.removeEventListener('resize', Device._debouncedChange, true)
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.props.onChange !== nextProps.onChange
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.onChange !== this.props.onChange) {
      const idx = Device._listeners.indexOf(this.props.onChange)
      Device._listeners.splice(idx, 1, nextProps.onChange)
    }
  }

  render () { return null }
}

Device.propTypes = {
  onChange: PropTypes.func.isRequired,
  userAgent: PropTypes.string
}

export default Device
