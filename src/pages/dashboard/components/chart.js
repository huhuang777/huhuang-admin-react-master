import PropTypes from 'prop-types'
import { Icon, Divider, Button } from 'antd'
import styles from './chart.less'
import classNames from 'classnames'
import React, { PureComponent } from 'react'
const { loadScript } = require('./loader')

const GOOGLE_CHART_BG_OPACITY = 0.05
const GOOGLE_CHART_COLORS = [
  '#017170',
  '#2fc32f',
  '#b0dc0b',
  '#eab404',
  '#de672c',
  '#ec2e2e',
  '#d5429b',
  '#6f52b8',
  '#1c7cd5',
  '#56b9f7',
  '#0ae8eb',
]

class Chart extends PureComponent {
  componentDidMount() {
    if (!localStorage.getItem('DISABLE_GA')) {
      this.initGAClient()
    }
  }
  initGAClient() {
    if (!window.gapi) {
      loadScript()
    }
    const { token } = this.props
    if (token) {
      this.instanceGa(token)
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.token !== nextProps.token) {
      if (nextProps.token) {
        this.instanceGa(nextProps.token)
      }
    }
  }
  instanceGa = access_token => {
    const gapi = window.gapi
    gapi.analytics.ready(() => {
      // 服务端授权立即生效，无需事件处理
      gapi.analytics.auth.authorize({
        serverAuth: { access_token },
      })

      const viewSelector = new gapi.analytics.ViewSelector({
        container: 'view-selector',
      })
      viewSelector.execute()

      const timeline = new gapi.analytics.googleCharts.DataChart({
        reportType: 'ga',
        query: {
          dimensions: 'ga:hour',
          metrics: 'ga:sessions',
          'start-date': 'today',
          'end-date': 'today',
        },
        chart: {
          type: 'LINE',
          container: 'timeline',
          options: {
            colors: GOOGLE_CHART_COLORS,
            width: '100%',
            chartArea: {
              left: '25',
              right: '25',
            },
            focusTarget: 'category',
            dataOpacity: 0.6,
            pointSize: 14,
            vAxis: {
              gridlines: {
                color: '#454545',
              },
              baselineColor: '#454545',
              textStyle: {
                color: '#fff',
              },
            },
            hAxis: {
              textStyle: {
                color: '#fff',
              },
            },
            backgroundColor: {
              fillOpacity: GOOGLE_CHART_BG_OPACITY,
            },
            tooltip: {
              textStyle: {
                fontSize: 13,
              },
            },
            legend: {
              textStyle: {
                color: '#fff',
              },
            },
          },
        },
      })

      const getPieChart = (dimensions, container, title) => {
        return new gapi.analytics.googleCharts.DataChart({
          query: {
            dimensions,
            metrics: 'ga:sessions',
            'start-date': 'today',
            'end-date': 'today',
            'max-results': 15,
            sort: '-ga:sessions',
          },
          chart: {
            container,
            type: 'PIE',
            options: {
              title,
              width: '100%',
              pieHole: 0.5,
              colors: GOOGLE_CHART_COLORS,
              chartArea: {
                left: '25',
              },
              annotations: {
                stem: {
                  color: 'transparent',
                  length: 120,
                },
                textStyle: {
                  color: '#9E9E9E',
                  fontSize: 18,
                },
              },
              backgroundColor: {
                fillOpacity: GOOGLE_CHART_BG_OPACITY,
              },
              titleTextStyle: {
                color: '#fff',
              },
              pieSliceBorderColor: 'transparent',
              pieSliceTextStyle: {
                color: '#fff',
              },
              tooltip: {
                showColorCode: true,
                textStyle: {
                  fontSize: 12,
                },
              },
              legend: {
                textStyle: {
                  color: '#fff',
                },
              },
            },
          },
        })
      }

      const countryChart = getPieChart('ga:country', 'pie-country', '国家地区')
      const cityChart = getPieChart('ga:city', 'pie-city', '城市')
      const browserChart = getPieChart('ga:browser', 'pie-browser', '浏览器')
      const osChart = getPieChart('ga:operatingSystem', 'pie-os', '操作系统')

      viewSelector.on('change', ids => {
        const newIds = {
          query: { ids },
        }
        timeline.set(newIds).execute()
        countryChart.set(newIds).execute()
        cityChart.set(newIds).execute()
        browserChart.set(newIds).execute()
        osChart.set(newIds).execute()
      })
    })
  }
  render() {
    return (
      <div className={styles['ga-box']}>
        <div className={styles.toolbar}>
          <Button
            type="primary"
            size={'small'}
            className={styles.btn}
            href="https://developers.google.com/analytics/devguides/reporting/embed/v1/"
            target={'_blank'}
          >
            Doc
          </Button>
          <Button
            className={styles.btn}
            size={'small'}
            type="danger"
            href="https://developers.google.com/analytics/devguides/reporting/embed/v1/core-methods-reference/"
            target={'_blank'}
          >
            API
          </Button>
          <Button
            type="danger"
            className={styles.btn}
            size={'small'}
            href="https://ga-dev-tools.appspot.com/embed-api/"
            target={'_blank'}
          >
            Example
          </Button>
          <Button type="info" className={styles.btn} size={'small'}>
            <Icon type="bar-chart" />
          </Button>
          <div id="view-selector"></div>
        </div>
        <Divider />
        <div className={styles['pie-charts']}>
          <div
            id="pie-country"
            className={classNames(styles.chart, styles.country)}
          ></div>
          <div
            id="pie-city"
            className={classNames(styles.chart, styles.city)}
          ></div>
          <div
            id="pie-browser"
            className={classNames(styles.chart, styles.browser)}
          ></div>
          <div
            id="pie-os"
            className={classNames(styles.chart, styles.os)}
          ></div>
        </div>
        <Divider />
        <div id="timeline" className={styles.timeline}></div>
      </div>
    )
  }
}

Chart.propTypes = {
  token: PropTypes.string,
}

export default Chart
