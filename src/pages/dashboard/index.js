import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card, Spin } from 'antd'
import { Page } from 'components'
import { NumberCard, Chart } from './components'
import styles from './index.less'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

@connect(({ app, dashboard, loading }) => ({
  dashboard,
  loading,
}))
class Dashboard extends PureComponent {
  changeLoading(isLoadingGa) {
    const { dispatch } = this.props
    dispatch({
      type: 'dashboard/updateState',
      payload: { isLoadingGa },
    })
  }
  render() {
    const { dashboard, loading } = this.props
    const { number = {}, googleToken, isLoadingGa } = dashboard
    const numbers = [
      {
        title: '今日文章阅读',
        number: number.views || 0,
        color: '#64ea91',
        icon: 'eye',
      },
      {
        title: '全站文章数',
        number: number.articles || 0,
        color: '#8fc9fb',
        icon: 'align-left',
      },
      {
        title: '全站标签数',
        number: number.tags || 0,
        color: '#d897eb',
        icon: 'tags',
      },
      {
        title: '全站评论数',
        color: '#f69899',
        number: number.comments || 0,
        icon: 'message',
      },
    ]
    const numberCards = numbers.map((item, key) => (
      <Col key={key} lg={6} md={12}>
        <NumberCard {...item} />
      </Col>
    ))
    return (
      <Page
        // loading={loading.models.dashboard && sales.length === 0}
        className={styles.dashboard}
      >
        <Row gutter={24}>
          {numberCards}
          <Col lg={24} md={24}>
            <Spin spinning={isLoadingGa}>
              <Card bordered={false} {...bodyStyle} title="GA 今日统计">
                <Chart
                  token={googleToken}
                  changeLoading={flag => this.changeLoading(flag)}
                />
              </Card>
            </Spin>
          </Col>
        </Row>
      </Page>
    )
  }
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default Dashboard
