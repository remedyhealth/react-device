# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.


(prior tags/releases)
## 0.6.0 (2017-03-08)
Move calling onChange from componentDidMount to constructor since componentDidMount is not called on server.

Split the static _onChange into 2 methods:
- _onChange: used to register for window events
- _publish: used to call the listeners

By splitting this out, I can call _publish in the constructor for a single onChange prop.

Also change the default width and height from -1 to null.