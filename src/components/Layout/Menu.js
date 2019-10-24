import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import Navlink from 'umi/navlink'
import withRouter from 'umi/withRouter'
import { arrayToTree, queryAncestors, pathMatchRegexp, isUrl } from 'utils'
import store from 'store'
import { IconFont } from 'components'

const { SubMenu } = Menu

@withRouter
class SiderMenu extends PureComponent {
  state = {
    openKeys: store.get('openKeys') || [],
  }

  onOpenChange = openKeys => {
    const { menus } = this.props
    const rootSubmenuKeys = menus.filter(_ => !_.menuParentId).map(_ => _.id)

    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    )

    let newOpenKeys = openKeys
    if (rootSubmenuKeys.indexOf(latestOpenKey) !== -1) {
      newOpenKeys = latestOpenKey ? [latestOpenKey] : []
    }

    this.setState({
      openKeys: newOpenKeys,
    })
    store.set('openKeys', newOpenKeys)
  }

  generateMenus = data => {
    return data.map(item => {
      const icon = this.getIcon(item.icon)
      if (item.children) {
        return (
          <SubMenu
            key={item.id}
            title={
              <Fragment>
                {icon}
                <span>{item.name}</span>
              </Fragment>
            }
          >
            {this.generateMenus(item.children)}
          </SubMenu>
        )
      }
      if (/^https?:\/\//.test(item.route)) {
        return (
          <Menu.Item key={item.id}>
            <a href={item.route} target={item.target}>
              {icon}
              <span>{item.name}</span>
            </a>
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={item.id}>
          <Navlink to={item.route || '#'} target={item.target}>
            {icon}
            <span>{item.name}</span>
          </Navlink>
        </Menu.Item>
      )
    })
  }
  getIcon = icon => {
    if (typeof icon === 'string') {
      if (isUrl(icon)) {
        return (
          <Icon
            component={() => (
              <img
                src={icon}
                alt="icon"
                style={{ width: '14px', verticalAlign: 'baseline' }}
              />
            )}
          />
        )
      }
      if (icon.startsWith('icon-')) {
        return <IconFont type={icon} />
      }
      return <Icon type={icon} />
    }
    return icon
  }

  render() {
    const {
      collapsed,
      theme,
      menus,
      location,
      isMobile,
      onCollapseChange,
    } = this.props

    // Generating tree-structured data for menu content.
    const menuTree = arrayToTree(menus, 'id', 'menuParentId')

    // Find a menu that matches the pathname.
    const currentMenu = menus.find(
      _ => _.route && pathMatchRegexp(_.route, location.pathname)
    )

    // Find the key that should be selected according to the current menu.
    const selectedKeys = currentMenu
      ? queryAncestors(menus, currentMenu, 'menuParentId').map(_ => _.id)
      : []

    const menuProps = collapsed
      ? {}
      : {
          openKeys: this.state.openKeys,
        }

    return (
      <Menu
        mode="inline"
        theme={theme}
        onOpenChange={this.onOpenChange}
        selectedKeys={selectedKeys}
        onClick={
          isMobile
            ? () => {
                onCollapseChange(true)
              }
            : undefined
        }
        {...menuProps}
      >
        {this.generateMenus(menuTree)}
      </Menu>
    )
  }
}

SiderMenu.propTypes = {
  menus: PropTypes.array,
  theme: PropTypes.string,
  isMobile: PropTypes.bool,
  onCollapseChange: PropTypes.func,
}

export default SiderMenu
