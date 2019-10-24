import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { router } from 'utils'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import { stringify } from 'qs'
import List from './components/List'
import Filter from './components/Filter'

@connect(({ articleList, loading }) => ({ articleList, loading }))
class ArticleList extends PureComponent {
  handleRefresh = newQuery => {
    const { location } = this.props
    const { query, pathname } = location

    router.push({
      pathname,
      search: stringify(
        {
          ...query,
          ...newQuery,
        },
        { arrayFormat: 'repeat' }
      ),
    })
  }

  get listProps() {
    const { dispatch, articleList, loading } = this.props
    const { list, pagination, selectedRowKeys } = articleList

    return {
      dataSource: list,
      loading: loading.effects['articleList/query'],
      pagination,
      selectedRowKeys,
      onChange: page => {
        this.handleRefresh({
          page: page.current,
          pageSize: page.pageSize,
        })
      },
      onDeleteItem: id => {
        dispatch({
          type: 'articleList/delete',
          payload: id,
        }).then(() => {
          this.handleRefresh({
            page:
              list.length === 1 && pagination.current > 1
                ? pagination.current - 1
                : pagination.current,
          })
        })
      },
      patchArticles: data => {
        dispatch({
          type: 'articleList/patchArticles',
          payload: {
            ...data,
            action: data.action + 2,
          },
        }).then(() => {
          this.handleRefresh({})
        })
      },
      rowSelection: {
        selectedRowKeys,
        onChange: keys => {
          dispatch({
            type: 'articleList/updateState',
            payload: {
              selectedRowKeys: keys,
            },
          })
        },
      },
    }
  }

  get filterProps() {
    const { location, articleList } = this.props
    const { query } = location
    const { tagList, categoryList } = articleList
    return {
      filter: {
        ...query,
      },
      tagList,
      categoryList,
      onFilterChange: value => {
        this.handleRefresh({
          ...value,
        })
      },
    }
  }

  render() {
    return (
      <Page inner>
        <Filter {...this.filterProps} />
        <List {...this.listProps} />
      </Page>
    )
  }
}

ArticleList.propTypes = {
  articleList: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default ArticleList
