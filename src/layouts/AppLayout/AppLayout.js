import React from 'react'
import PropTypes from 'prop-types'
import styles from './AppLayout.scss'

const singlePage = ['/login']

export const AppLayout = ({ children, location}) => {

  return (
    <div>
      {
        singlePage.includes(location.pathname)
          ? children
          : (
              <div>
                <div>
                    {children}
                </div>
              </div>
            )
      }
      
    </div>
  )
}

AppLayout.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired
}

export default AppLayout
