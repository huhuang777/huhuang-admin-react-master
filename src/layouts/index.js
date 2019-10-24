import React, { Component } from 'react'
import withRouter from 'umi/withRouter'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'

import BaseLayout from './BaseLayout'

@withRouter
class Layout extends Component {
  state = {
    catalogs: {},
  }

  render() {
    const { children } = this.props
    return (
      <LocaleProvider locale={zh_CN}>
        <BaseLayout>{children}</BaseLayout>
      </LocaleProvider>
    )
  }
}

export default Layout
