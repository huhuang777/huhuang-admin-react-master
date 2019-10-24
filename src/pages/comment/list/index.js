import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { router } from 'utils'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import { stringify } from 'qs'
import List from './components/List'
import Filter from './components/Filter'

@connect(({ commentList, loading }) => ({ commentList, loading }))
class comment extends PureComponent {
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
    const { dispatch, commentList, loading } = this.props
    const { list, pagination, selectedRowKeys } = commentList

    return {
      dataSource: list,
      loading: loading.effects['commentList/query'],
      pagination,
      selectedRowKeys,
      onChange: page => {
        this.handleRefresh({
          page: page.current,
          pageSize: page.pageSize,
        })
      },
      onDeleteItem: param => {
        dispatch({
          type: 'commentList/delete',
          payload: param,
        }).then(() => {
          this.handleRefresh({
            page:
              list.length === 1 && pagination.current > 1
                ? pagination.current - 1
                : pagination.current,
          })
        })
      },
      updateCommentsState: data => {
        dispatch({
          type: 'commentList/patchComments',
          payload: {
            ...data,
          },
        }).then(() => {
          this.handleRefresh({})
        })
      },
      rowSelection: {
        selectedRowKeys,
        onChange: keys => {
          dispatch({
            type: 'commentList/updateState',
            payload: {
              selectedRowKeys: keys,
            },
          })
        },
      },
    }
  }

  get filterProps() {
    const { location, commentList } = this.props
    const { query } = location
    const { tagList, categoryList } = commentList
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

comment.propTypes = {
  commentList: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default comment
