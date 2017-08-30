# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.8.1"></a>
## [0.8.1](https://github.com/remedyhealth/react-device/compare/v0.8.0...v0.8.1) (2017-08-30)


### Bug Fixes

* initial client side call incorrect ([6af9939](https://github.com/remedyhealth/react-device/commit/6af9939))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/remedyhealth/react-device/compare/v0.7.1...v0.8.0) (2017-08-30)



<a name="0.7.1"></a>
## [0.7.1](https://github.com/remedyhealth/react-device/compare/v0.7.0...v0.7.1) (2017-08-30)



<a name="0.7.0"></a>
# [0.7.0](https://github.com/remedyhealth/react-device/compare/v0.6.2...v0.7.0) (2017-03-17)


### Bug Fixes

* initial client side call incorrect timing ([976f90d](https://github.com/remedyhealth/react-device/commit/976f90d))



<a name="0.6.2"></a>
## [0.6.2](https://github.com/remedyhealth/react-device/compare/v0.6.1...v0.6.2) (2017-03-08)


### Bug Fixes

* capitalization issue with filenames (#7) ([283c238](https://github.com/remedyhealth/react-device/commit/283c238))



<a name="0.6.1"></a>
## [0.6.1](https://github.com/remedyhealth/react-device/compare/v0.6.0...v0.6.1) (2017-03-08)

----

(prior tags/releases)
## 0.6.0 (2017-03-08)
Move calling onChange from componentDidMount to constructor since componentDidMount is not called on server.

Split the static _onChange into 2 methods:
- _onChange: used to register for window events
- _publish: used to call the listeners

By splitting this out, I can call _publish in the constructor for a single onChange prop.

Also change the default width and height from -1 to null.
