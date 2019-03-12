import React, {PureComponent, Suspense} from 'react';
import {Layout} from 'antd';
import {NavLink} from 'react-router-dom'
import classNames from 'classnames';
import styles from './SiderMenu.module.less';
import PageLoading from '../../components/PageLoading';
import {admin} from '../../config';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';
import { debug } from 'util';

const BaseMenu = React.lazy(() => import ('./BaseMenu'));
const {Sider} = Layout;

let firstMount = true;

export default class SiderMenu extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props)
    };
  }

  componentDidMount() {
    firstMount = false;
  }

  isMainMenu = key => {
    const {menuData} = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key+"" === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  render() {
    const {
      logo,
      collapsed,
      onCollapse
    } = this.props;
    const {openKeys} = this.state;
    const defaultProps = collapsed
      ? {}
      : {
        openKeys
      };

    const siderClassName = classNames([styles.sider,styles.fixSiderBar, styles.dark]);
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        // eslint-disable-next-line react/jsx-no-bind
        onCollapse={collapse => {
          if (firstMount) {
            onCollapse(collapse);
          }
        }}
        width={256}
        theme={"dark"}
        className={siderClassName}
      >
        <div className={styles.logo} id="logo">
          <NavLink to="/">
            <img src={logo} alt="logo" />
            <h1>{admin.name}</h1>
          </NavLink>
        </div>
        <Suspense fallback={< PageLoading />}>
          <BaseMenu
            {...this.props}
            mode="inline"
            handleOpenChange={this.handleOpenChange}
            onOpenChange={this.handleOpenChange}
            style={{
            padding: '16px 0',
            width: '100%'
          }}
            {...defaultProps} 
          />
        </Suspense>
      </Sider>
    );
  }
}
