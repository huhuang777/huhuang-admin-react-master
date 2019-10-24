/* global document */
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { StandardFormRow, TagSelect } from 'components'
import { Form, Button, Select, Row, Col, Input } from 'antd'
import { PublicState, OriginState, PublishState } from 'utils/constant'

const { Option } = Select

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

  handleSubmit = () => {
    const { onFilterChange, form } = this.props
    const { getFieldsValue } = form

    let fields = getFieldsValue()
    fields = this.handleFields(fields)
    onFilterChange(fields)
  }

  handleReset = () => {
    const { form } = this.props
    const { getFieldsValue, setFieldsValue } = form

    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    this.handleSubmit()
  }
  handleChange = (key, values) => {
    const { form, onFilterChange } = this.props
    const { getFieldsValue } = form

    let fields = getFieldsValue()
    fields[key] = values
    fields = this.handleFields(fields)
    onFilterChange(fields)
  }

  render() {
    const { filter, form, tagList, categoryList } = this.props
    const { getFieldDecorator } = form
    const { category, state, tag, public: ppblic, origin, keyword } = filter
    const actionsTextMap = {
      expandText: '展开',
      collapseText: '收起',
      selectAllText: '全部',
    }
    return (
      <Fragment>
        <Row gutter={24}>
          <StandardFormRow
            title="所属分类"
            block
            style={{
              paddingBottom: 11,
              paddingLeft: 12,
            }}
          >
            {getFieldDecorator('category', {
              initialValue: category,
            })(
              <TagSelect
                expandable
                actionsText={actionsTextMap}
                hideCheckAll
                isRadio
              >
                {categoryList.map(item => (
                  <TagSelect.Option key={item._id} value={item._id}>
                    {item.name}
                  </TagSelect.Option>
                ))}
              </TagSelect>
            )}
          </StandardFormRow>
        </Row>
        <Row gutter={24}>
          <StandardFormRow
            title="所属标签"
            block
            style={{
              paddingBottom: 11,
              paddingLeft: 12,
            }}
          >
            {getFieldDecorator('tag', {
              initialValue: tag,
            })(
              <TagSelect
                expandable
                actionsText={actionsTextMap}
                hideCheckAll
                isRadio
              >
                {tagList.map(item => (
                  <TagSelect.Option key={item._id} value={item._id}>
                    {item.name}
                  </TagSelect.Option>
                ))}
              </TagSelect>
            )}
          </StandardFormRow>
        </Row>
        <Row gutter={24}>
          <StandardFormRow
            title="其它搜索选项"
            block
            style={{
              paddingBottom: 11,
              paddingLeft: 12,
            }}
          >
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
              {getFieldDecorator('state', {
                initialValue: state,
              })(
                <Select
                  placeholder="发布状态"
                  style={{
                    maxWidth: 200,
                    width: '100%',
                  }}
                >
                  <Option value={PublishState.all}>不限</Option>
                  <Option value={PublishState.draft}>草稿</Option>
                  <Option value={PublishState.published}>已发布</Option>
                  <Option value={PublishState.recycle}>回收站</Option>
                </Select>
              )}
            </Col>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
              {getFieldDecorator('public', {
                initialValue: ppblic,
              })(
                <Select
                  placeholder="选择私密程度"
                  style={{
                    maxWidth: 200,
                    width: '100%',
                  }}
                >
                  <Option value={PublicState.all}>不限</Option>
                  <Option value={PublicState.public}>公开</Option>
                  <Option value={PublicState.password}>密码</Option>
                  <Option value={PublicState.secret}>私密</Option>
                </Select>
              )}
            </Col>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
              {getFieldDecorator('origin', {
                initialValue: origin,
              })(
                <Select
                  placeholder="文章来源"
                  style={{
                    maxWidth: 200,
                    width: '100%',
                  }}
                >
                  <Option value={OriginState.all}>不限</Option>
                  <Option value={OriginState.original}>原创</Option>
                  <Option value={OriginState.reprint}>转载</Option>
                  <Option value={OriginState.hybrid}>混合</Option>
                </Select>
              )}
            </Col>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
              {getFieldDecorator('keyword', {
                initialValue: keyword,
              })(<Input placeholder={`请输入关键词`} />)}
            </Col>
            <Col xl={{ span: 2 }} md={{ span: 4 }}>
              <Button
                type="primary"
                className="margin-right"
                onClick={this.handleSubmit}
              >
                查询
              </Button>
            </Col>
            <Col
              xl={{ span: 2 }}
              md={{ span: 4 }}
              xs={{ span: 8 }}
              sm={{ span: 12 }}
            >
              <Button onClick={this.handleReset}>重置搜索条件</Button>
            </Col>
          </StandardFormRow>
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
