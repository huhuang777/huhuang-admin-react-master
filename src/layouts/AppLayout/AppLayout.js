import React from 'react'
import PropTypes from 'prop-types'
import BasicLayout from "../BasicLayout"

const singlePage = ['/login']

export const AppLayout = ({children, location}) => {
  return (singlePage.includes(location.pathname)
    ? children
    : <BasicLayout location={location}>{children}</BasicLayout>)
}

AppLayout.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired
}

export default AppLayout
