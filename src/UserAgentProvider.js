import React, { PropTypes } from 'react'

const UserAgentProvider = ({ userAgent, children }) => {
  global.navigator = global.navigator || userAgent
  return React.Children.only(children)
}

UserAgentProvider.PropTypes = {
  userAgent: PropTypes.string,
  children: PropTypes.node
}

export default UserAgentProvider
