/* global document */
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Input, Radio } from 'antd'
import { CommentState, SortType } from 'utils/constant'

const { Search } = Input
const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

@Form.create()
class Filter extends Component {
  handleFields = fields => {
    return fields
  }

  emitChange(item, data) {
    this.handleChange(item, data)
  }
  handleReset = () => {
    const { form } = this.props
    const { getFieldsValue, setFieldsValue } = form

    let fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    fields = {
      ...fields,
      state: 'all',
      sort: SortType.desc,
    }
    setFieldsValue(fields)
    this.handleChange()
  }
  handleChange = (key, values) => {
    const { form, onFilterChange } = this.props
    const { getFieldsValue } = form

    let fields = getFieldsValue()
    fields[key] = values
    fields = this.handleFields(fields)
    onFilterChange(fields)
  }
  refresh() {
    this.handleChange()
  }

  render() {
    const { filter, form } = this.props
    const { getFieldDecorator } = form
    const { state = 'all', sort = SortType.desc, keyword } = filter

    return (
      <Fragment>
        <Row gutter={24}>
          <Col
            {...ColProps}
            xl={{ span: 9 }}
            md={{ span: 10 }}
            xxl={{ span: 6 }}
          >
            {getFieldDecorator('state', {
              initialValue: state,
            })(
              <Radio.Group
                buttonStyle="solid"
                onChange={e => {
                  this.emitChange('state', e.target.value)
                }}
              >
                <Radio.Button value={CommentState.all}>全部</Radio.Button>
                <Radio.Button value={CommentState.published}>
                  已发布
                </Radio.Button>
                <Radio.Button value={CommentState.auditing}>
                  待审核
                </Radio.Button>
                <Radio.Button value={CommentState.deleted}>已删除</Radio.Button>
                <Radio.Button value={CommentState.spam}>垃圾评论</Radio.Button>
              </Radio.Group>
            )}
          </Col>
          <Col
            {...ColProps}
            xl={{ span: 5 }}
            md={{ span: 10 }}
            xxl={{ span: 4 }}
          >
            {getFieldDecorator('sort', {
              initialValue: sort,
            })(
              <Radio.Group
                buttonStyle="solid"
                onChange={e => {
                  this.emitChange('sort', e.target.value)
                }}
              >
                <Radio.Button value={SortType.desc}>最新</Radio.Button>
                <Radio.Button value={SortType.asc}>最早</Radio.Button>
                <Radio.Button value={SortType.hot}>最热门</Radio.Button>
              </Radio.Group>
            )}
          </Col>
          <Col
            {...ColProps}
            xl={{ span: 5 }}
            md={{ span: 10 }}
            xxl={{ span: 4 }}
          >
            <Button.Group>
              <Button
                type="primary"
                icon="reload"
                onClick={() => this.refresh()}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon="delete"
                onClick={() => this.handleReset()}
              >
                重置搜索
              </Button>
            </Button.Group>
          </Col>
          <Col
            {...ColProps}
            xl={{ span: 5 }}
            md={{ span: 10 }}
            xxl={{ span: 6 }}
          >
            {getFieldDecorator('keyword', {
              initialValue: keyword,
            })(
              <Search
                placeholder="搜索相关标签"
                enterButton="搜索"
                style={{ maxWidth: '400px' }}
                onSearch={e => {
                  this.emitChange('keyword', e)
                }}
              />
            )}
          </Col>
        </Row>
      </Fragment>
    )
  }
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Filter
