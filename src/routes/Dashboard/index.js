import React, {Component, Suspense} from 'react'
// import PropTypes from 'prop-types'
import {Row, Col, Icon} from 'antd'
import styles from './index.module.less'
import IntroduceRow from "./IntroduceRow"
import TopSearch from "./TopSearch"

export class Dashboard extends Component {
  state = {
  }
  render() {
    const CardList = [
      {
        name: "今日文章阅读",
        count: 278,
        icon: "eye"
      }, {
        name: "全站文章数",
        count: 11,
        icon: "align-left"
      }, {
        name: "全站标签数",
        count: 22,
        icon: "tags"
      }, {
        name: "全站评论数",
        count: 66,
        icon: "message"
      }
    ]
    return (
      <div>
        <IntroduceRow CardList={CardList}/>
        <div className={styles.twoColLayout}>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <TopSearch title={"最近收到的评论"} type="comment" />
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <TopSearch title={"最近收到的留言"} type="message" />
            </Col>
          </Row>
        </div>
      </div>
    );
  };
}

export default Dashboard;
