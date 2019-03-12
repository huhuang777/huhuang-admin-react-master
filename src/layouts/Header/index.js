import React, {Component} from 'react';
import {Layout, Icon,Spin,Avatar,Menu} from 'antd';
import styles from './Header.module.less';
import NoticeIcon from '../../components/NoticeIcon';
import HeaderDropdown from '../../components/HeaderDropdown';

const {Header} = Layout;

class BasicLayout extends Component {
  componentDidMount() {}

  getHeadWidth = () => {
    const {collapsed} = this.props;
    return collapsed
      ? 'calc(100% - 80px)'
      : 'calc(100% - 256px)';
  };

  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const {collapsed, onCollapse} = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  itemClick(item, tabProps){
    this.changeReadState(item, tabProps);
  }
  changeReadState(){

  }
  render() {
    const {collapsed, logo,onMenuClick} = this.props;
    const width = this.getHeadWidth();
    const currentUser={
      unreadCount:4,
      name:"胡煌"
    }
    const notification=[{
      title:"你已经很久没有发博客了",
      avatar:"https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
      //description:"你已经很久没有发博客了",
      datetime:"刚刚"
    }]
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <Header style={{padding: 0,width}} className={styles.fixedHeader}>
        <div className={styles.header}>
          <span className={styles.trigger} onClick={this.toggle}>
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'}/>
          </span>
          <div className={styles.right}>
            <NoticeIcon className={styles.action} count={currentUser.unreadCount}
            // onItemClick={this.itemClick}
              loading={false}
              locale={{
                emptyText: "暂无通知",
                clear: "清空",
                viewMore: "查看更多",
                notification: "通知",
                message: "消息",
                event: "待办",
              }}
              clearClose
            >
              <NoticeIcon.Tab
                count={5}
                list={notification}
                title="notification"
                emptyText={"暂无通知"}
                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                showViewMore
              />
              <NoticeIcon.Tab
                count={2}
                list={notification}
                title="message"
                emptyText={"暂无消息"}
                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                showViewMore
              />
              <NoticeIcon.Tab
                count={1}
                list={notification}
                title="event"
                emptyText={"暂无待办事件"}
                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
                showViewMore
              />
            </NoticeIcon>
            {currentUser.name ? (
              <HeaderDropdown overlay={menu}>
                <span className={`${styles.action} ${styles.account}`}>
                  <Avatar
                    size="small"
                    className={styles.avatar}
                    src={logo}
                    alt="avatar"
                  />
                  <span className={styles.name}>{currentUser.name}</span>
                </span>
              </HeaderDropdown>
            ) : (
              <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
            )}
          </div>
        </div>
      </Header>
    );
  }
}

export default BasicLayout;
