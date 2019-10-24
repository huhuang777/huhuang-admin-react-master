import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Spin,
  Divider,
  Icon,
  Dropdown,
  Menu,
  Table,
  Modal,
} from 'antd'
import styles from './index.less'
import { IconFont, Ellipsis } from 'components'

const FormItem = Form.Item
const { TextArea, Group: InputGroup, Search } = Input

@Form.create()
@connect(({ categoryList, loading }) => ({ categoryList, loading }))
class AllCategory extends PureComponent {
  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '别名',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
      render: text =>
        text ? <Ellipsis lines={1}>{text}</Ellipsis> : <span>暂无描述</span>,
    },
    {
      title: '文章数',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
      render: text => (text ? <span>{text}</span> : <span>0</span>),
    },
    {
      title: '操作',
      render: category => (
        <Button.Group className={styles.buttonGroup}>
          <Button className={styles.edit} onClick={() => this.edit(category)}>
            编辑
          </Button>
          <Button
            className={styles.delete}
            onClick={() => this.delete([category._id])}
          >
            删除
          </Button>
          <Button type="primary" onClick={() => this.edit(category)}>
            查看
          </Button>
        </Button.Group>
      ),
    },
  ]
  delete(id = []) {
    const { dispatch, categoryList } = this.props
    if (id.length <= 0) {
      const { selectedRowKeys } = categoryList
      id = selectedRowKeys
    }
    // id = this.state.selectedRowKeys
    if (id.length < 1) {
      Modal.info({
        title: '温馨提示',
        content: '要先选中才能删除啊。大海猪',
      })
      return
    }
    Modal.confirm({
      title: '确认操作',
      content: '确认要删除选中的分类吗',
      onOk: () => {
        dispatch({
          type: 'categoryList/delete',
          payload: id,
        }).then(() => {
          this.refresh()
        })
      },
    })
  }
  search(value) {
    Modal.info({
      title: '温馨提示',
      content: '没做这个功能',
    })
  }
  refresh() {
    const { dispatch } = this.props
    dispatch({
      type: 'categoryList/query',
      payload: {
        pageSize: 10,
        page: 1,
      },
    })
  }
  edit(category = {}) {
    const { dispatch } = this.props
    dispatch({
      type: 'categoryList/updateState',
      payload: {
        currentItem: category,
      },
    })
  }
  onSelectChange = selectedRowKeys => {
    const { dispatch } = this.props
    dispatch({
      type: 'categoryList/updateState',
      payload: {
        selectedRowKeys,
      },
    })
  }
  handleTableChange = page => {
    const { dispatch } = this.props
    dispatch({
      type: 'categoryList/query',
      payload: {
        page: page.current,
        pageSize: page.pageSize,
      },
    })
  }

  initAdd() {
    const { dispatch } = this.props
    dispatch({
      type: 'categoryList/updateState',
      payload: {
        currentItem: {
          name: '',
          description: '',
          slug: '',
          extends: [{ name: 'icon', value: 'icon-category' }],
        },
      },
    })
  }
  handleSubmit = e => {
    const { dispatch, categoryList, form } = this.props
    const { currentItem } = categoryList
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        let param = {
          ...currentItem,
          ...values,
        }
        let type = 'categoryList/post'
        if (param._id) {
          type = 'categoryList/edit'
        }
        dispatch({
          type,
          payload: param,
        }).then(() => {
          this.refresh()
        })
      }
    })
  }
  handleChangeExtends = _extends => {
    const { dispatch, categoryList } = this.props
    const { currentItem } = categoryList
    dispatch({
      type: 'categoryList/updateState',
      payload: {
        currentItem: {
          ...currentItem,
          extends: _extends,
        },
      },
    })
  }

  handleAddExtendsItem = () => {
    const { categoryList } = this.props
    const { currentItem } = categoryList
    const { extends: _extends } = currentItem
    this.handleChangeExtends([..._extends, { name: '', value: '' }])
  }

  handleExtendsItemInputChange = (index, type) => e => {
    const { categoryList } = this.props
    const { currentItem } = categoryList
    const { extends: _extends } = currentItem
    _extends.splice(index, 1, {
      ..._extends[index],
      [type]: e.target.value,
    })
    this.handleChangeExtends(_extends)
  }

  handleRemoveExtendsItem = index => () => {
    const { categoryList } = this.props
    const { currentItem } = categoryList
    const { extends: _extends } = currentItem
    _extends.splice(index, 1)
    this.handleChangeExtends(_extends)
  }
  render() {
    const { form, loading, categoryList } = this.props
    const { getFieldDecorator } = form
    const {
      currentItem,
      list,
      selectedRowKeys,
      pagination,
      searchText,
    } = categoryList
    const { name, slug, description, _id, extends: _extends = [] } = currentItem
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const menu = (
      <Menu onClick={() => this.delete()}>
        <Menu.Item key="1">删除选中</Menu.Item>
      </Menu>
    )
    return (
      <div className={styles.pageMain}>
        <Row gutter={24}>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Spin spinning={false}>
              <Card
                title={!!_id ? '修改文章分类' : '添加文章分类'}
                bordered={false}
              >
                <Form layout="vertical" onSubmit={this.handleSubmit}>
                  <FormItem label="名称" required>
                    {getFieldDecorator('name', { initialValue: name })(
                      <Input placeholder="分类名称" />
                    )}
                    <span className={styles['sub-little-text']}>
                      这将是它在站点上显示的名字
                    </span>
                  </FormItem>
                  <FormItem label="别名" required>
                    {getFieldDecorator('slug', { initialValue: slug })(
                      <Input placeholder="分类别名" />
                    )}
                    <span className={styles['sub-little-text']}>
                      “别名”是在URL中使用的别称，建议小写，字母、数字、连字符（-）
                    </span>
                  </FormItem>
                  <FormItem label="描述">
                    {getFieldDecorator('description', {
                      initialValue: description,
                    })(
                      <TextArea
                        className={styles.description}
                        rows={3}
                        placeholder="分类描述"
                      />
                    )}
                    <span className={styles['sub-little-text']}>
                      该分类的描述
                    </span>
                  </FormItem>
                  <FormItem label="自定义扩展">
                    <div className={styles.extendsBox}>
                      {_extends.map((item, index) => (
                        <InputGroup className={styles.extends_item} key={index}>
                          <Col span={10}>
                            <Input
                              placeholder="key"
                              value={item.name}
                              onChange={this.handleExtendsItemInputChange(
                                index,
                                'name'
                              )}
                            />
                          </Col>
                          <Col span={12}>
                            <Input
                              placeholder="value"
                              value={item.value}
                              onChange={this.handleExtendsItemInputChange(
                                index,
                                'value'
                              )}
                            />
                          </Col>
                          <Col span={2}>
                            <Button
                              className={styles.extndsButton}
                              icon="delete"
                              onClick={this.handleRemoveExtendsItem(index)}
                            />
                          </Col>
                        </InputGroup>
                      ))}
                      <Button
                        type="primary"
                        icon="plus"
                        block
                        onClick={this.handleAddExtendsItem}
                      >
                        增加扩展
                      </Button>
                      <span className={styles['sub-little-text']}>
                        可以为当前标签扩展自定义扩展属性
                      </span>
                      <Divider />
                      <Col span={12}>
                        <Button type="primary" htmlType="submit">
                          <IconFont
                            type="icon-doneall"
                            style={{ color: 'white' }}
                          />
                          {!!_id ? '修改' : '添加'}分类目录
                        </Button>
                      </Col>
                      <Col span={6}>
                        <Button
                          icon="reload"
                          onClick={() => this.initAdd()}
                          loading={
                            !!_id
                              ? loading.effects['categoryList/edit']
                              : loading.effects['categoryList/delete']
                          }
                        >
                          重置
                        </Button>
                      </Col>
                    </div>
                  </FormItem>
                </Form>
              </Card>
            </Spin>
          </Col>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card title="分类管理" bordered={false}>
              <Button.Group className={styles.buttonGroup}>
                <Button
                  type="primary"
                  icon="reload"
                  onClick={() => this.refresh()}
                >
                  刷新
                </Button>
                <Button type="primary" icon="delete">
                  清空搜索词
                </Button>
                <Dropdown overlay={menu}>
                  <Button>
                    <Icon type="align-left" />
                    批量操作 <Icon type="down" />
                  </Button>
                </Dropdown>
              </Button.Group>
              <Search
                className={styles.extraContentSearch}
                placeholder="搜索相关标签"
                enterButton="搜索"
                value={searchText}
                onSearch={value => this.search(value)}
              />
              <Table
                style={{ marginTop: 20 }}
                columns={this.columns}
                rowKey={record => record._id}
                loading={loading.effects['categoryList/query']}
                dataSource={list}
                pagination={{
                  ...pagination,
                  showTotal: total => `Total ${total} Items`,
                }}
                simple
                onChange={this.handleTableChange}
                rowSelection={rowSelection}
              />
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

AllCategory.propTypes = {
  categoryList: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default AllCategory
