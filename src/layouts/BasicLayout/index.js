import React, {Suspense} from 'react';
import {Layout} from 'antd';
import PropTypes from 'prop-types'
import SiderMenu from "../SiderMenu"
import {menu} from "../../config"
import Header from "../Header"
import PageLoading from "../../components/PageLoading"
import styles from './basicLayout.module.less';

class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed:false
    };
  }
  componentDidMount() {}
  
  getLayoutStyle = () => {
    const { collapsed } = this.state;
    return {
      paddingLeft: collapsed ? '80px' : '256px',
    };
  };

  getContext() {
    const {location, breadcrumbNameMap} = this.props;
    return {location, breadcrumbNameMap};
  }

  handleMenuCollapse = collapsed => {
    this.setState({
      collapsed
    })
  };

  onMenuClick({ key }){
    if(key==="logout"){
      console.log(this.props);
      //this.props.history.push("/login");
    }
  }

  render() {
    const { Content } = Layout;
    return (
      <Layout>
        <SiderMenu 
          onCollapse={this.handleMenuCollapse}
          menuData={menu}
          collapsed={this.state.collapsed}
          logo="https://huhuang.net/images/logo.png"
          {...this.props}
        />
        <Layout
          style={{
            minHeight: '100vh',
            ...this.getLayoutStyle()
          }}
        >
          <Header
            collapsed={this.state.collapsed}
            onCollapse={this.handleMenuCollapse}
            onMenuClick={this.onMenuClick}
            logo="https://huhuang.net/images/logo.png"
            {...this.props}
          />
          <Content className={styles.content}>
            <Suspense fallback={<PageLoading />}>{this.props.children}</Suspense>
          </Content>
        </Layout>
      </Layout>
    );
  }
}


export default BasicLayout;
