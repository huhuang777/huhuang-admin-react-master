import React from 'react'
import BasicLayout from "../BasicLayout"

const singlePage = ['/login']

export const AppLayout = (param) => {
  const {children, location,history} = param;
  return (singlePage.includes(location.pathname)
    ? children
    : <BasicLayout location={location} history={history}>{children}</BasicLayout>)
}

export default AppLayout
