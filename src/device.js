import { Component, PropTypes } from 'react'
import debounce from 'lodash/debounce'
import parser from 'ua-parser-js'

export const SIZE_UNKNOWN = -1
export const LANDSCAPE = 'landscape'
export const PORTRAIT = 'portrait'

class Device extends Component {
  static _onChange () {
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

    const deviceInfo = {
      screen: windowDetails,
      ...Device.details
    }
    Device._listeners.forEach(listener => {
      listener(deviceInfo)
    })
  }

  static _listeners = []
  static DEBOUNCE_TIME = 100
  static details = {}

  constructor (props) {
    super(props)
    Device.details = parser(global.navigator)
  }

  componentDidMount () {
    const idx = Device._listeners.indexOf(this.props.onChange)
    Device._listeners.splice(idx, 1)
    if (!Device._listeners.length) {
      Device._debouncedChange = debounce(Device._onChange, Device.DEBOUNCE_TIME)
      window.addEventListener('resize', Device._debouncedChange, true)
    }
    Device._listeners.push(this.props.onChange)
    Device._debouncedChange()
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
  onChange: PropTypes.func.isRequired
}

export default Device
