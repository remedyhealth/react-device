# react-device

React component that provides device information (browser, cpu, device, engine, os, and screen). It refreshes the device screen information on window resize events. Under the hood it uses [ua-parser-js](https://github.com/faisalman/ua-parser-js) to generate the non-screen device information

## Installation

#### npm
```sh
$ npm install react-device --save
```

#### yarn
```sh
$ yarn add react-device
```

## API

### `<Device onChange [userAgent]/>`

React component that takes
- an onChange callback which is called every time the window is resized;
- an optional userAgent string to send to ua-parser-js to gather the device information.

#### Props

* `onChange(deviceInfo)` (required) - Callback that gets called every time the window is resized. It's always called once soon after getting mounted. Receives a `deviceInfo` param which is an Object with keys:
```
{
    ua: "",
    browser: {
      name: "",
      version: ""
    },
    engine: {
      name: "",
      version: ""
    },
    os: {
      name: "",
      version: ""
    },
    device: {
      model: "",
      type: "",
      vendor: ""
    },
    cpu: {
      architecture: ""
    },
    screen: {
      height: "",
      width: "",
      orientation: ""
    }
}
```
* `userAgent` (optional) - User agent string that will override the global.navigator.userAgent string. Useful on server side implementations

#### Example

```jsx
import React from 'react'
import Device from 'react-device'

const MyComponent = (props) => {
  const onChange = (deviceInfo) => {
    console.log('Screen height', deviceInfo.screen.height)
    console.log('Screen width', deviceInfo.screen.width)
    console.log('Screen orientation', deviceInfo.screen.orientation)
    console.log('Browser name', deviceInfo.browser.name)
  }

  return <Device onChange={onChange} />
}

export default MyComponent
```

### `Device.DEBOUNCE_TIME`

Numeric value of how much time should be waited before calling each listener function. Default value is `250`.

The debounce function is created lazily when the component instance is mounted, so you can change the value before mounting.

## Details

This component lazily adds the window resize event listener, this means it works with universal apps. The listener only get added when a component instance gets mounted.

To avoid performance problems associated with registering multiple event listeners, it only registers a single listener which is shared among all component instances.

## License

MIT
