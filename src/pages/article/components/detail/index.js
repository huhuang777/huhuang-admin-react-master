import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { router } from 'utils'
import { TagSelect, IconFont, MarkdownEditor, ImgUpload } from 'components'
import {
  Button,
  Row,
  Form,
  Input,
  Divider,
  Select,
  Checkbox,
  Col,
  Card,
} from 'antd'
import styles from './index.less'

const FormItem = Form.Item
const { TextArea, Group: InputGroup } = Input
const { Option } = Select
const CheckboxGroup = Checkbox.Group

@Form.create()
@connect(({ articleDetail, loading }) => ({ articleDetail, loading }))
class ArticleDetail extends PureComponent {
  getImgurl = url => {
    const { dispatch, articleDetail } = this.props
    const { article } = articleDetail
    dispatch({
      type: 'articleDetail/updateState',
      payload: {
        article: {
          ...article,
          thumb: url,
        },
      },
    })
  }
  handleChangeExtends = _extends => {
    const { dispatch, articleDetail } = this.props
    const { article } = articleDetail
    dispatch({
      type: 'articleDetail/updateState',
      payload: {
        article: {
          ...article,
          extends: _extends,
        },
      },
    })
  }

  handleAddExtendsItem = () => {
    const { articleDetail } = this.props
    const { article } = articleDetail
    const { extends: _extends } = article
    this.handleChangeExtends([..._extends, { name: '', value: '' }])
  }

  handleExtendsItemInputChange = (index, type) => e => {
    const { articleDetail } = this.props
    const { article } = articleDetail
    const { extends: _extends } = article
    _extends.splice(index, 1, {
      ..._extends[index],
      [type]: e.target.value,
    })
    this.handleChangeExtends(_extends)
  }

  handleRemoveExtendsItem = index => () => {
    const { articleDetail } = this.props
    const { article } = articleDetail
    const { extends: _extends } = article
    _extends.splice(index, 1)
    this.handleChangeExtends(_extends)
  }
  // 文章内容格式化
  contentChangeHandle = event => {
    if (event.content !== undefined) {
      const { dispatch, articleDetail } = this.props
      const { article } = articleDetail
      dispatch({
        type: 'articleDetail/updateState',
        payload: {
          article: {
            ...article,
            content: event.content,
          },
        },
      })
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    const { articleDetail, form, dispatch } = this.props
    const { article, type } = articleDetail
    const isPost = type === 'post'
    form.validateFields((err, values) => {
      if (!err) {
        let param = {
          ...article,
          ...values,
        }
        param = {
          ...param,
          title: param.title.replace(/(^\s*)|(\s*$)/g, ''),
          keywords: param.keywords.replace(/\s/g, '').split(','),
          description: param.description.replace(/(^\s*)|(\s*$)/g, ''),
        }
        if (isPost) {
          dispatch({
            type: 'articleDetail/postArticle',
            payload: param,
          }).then(() => {
            router.push('/article/list')
          })
        } else {
          dispatch({
            type: 'articleDetail/editArticle',
            payload: param,
          }).then(() => {
            router.push('/article/list')
          })
        }
      }
    })
  }
  render() {
    const { form, articleDetail, loading } = this.props
    const { tagList, categoryList, article, type } = articleDetail
    const { getFieldDecorator } = form
    const {
      title,
      keywords = [],
      description,
      tag = [],
      category = [],
      thumb,
      public: _public,
      state,
      content,
      origin,
      extends: extend = [{}],
    } = article
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 14 },
      },
    }
    const fullLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
        md: { span: 21 },
      },
    }
    return (
      <div className={styles.pageMain}>
        <Form layout="horizontal" onSubmit={this.handleSubmit}>
          <Row gutter={24}>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Card
                title={type === 'post' ? '撰写新文章' : '修改文章'}
                bordered={false}
              >
                <FormItem label="文章标题" {...fullLayout}>
                  {getFieldDecorator('title', { initialValue: title })(
                    <Input placeholder="文章标题" />
                  )}
                </FormItem>
                <FormItem label="文章关键词" {...fullLayout}>
                  {getFieldDecorator('keywords', {
                    initialValue: keywords.join(','),
                  })(<Input placeholder="多个关键词以 ' , ' 隔开" />)}
                </FormItem>
                <FormItem label="文章描述" {...fullLayout}>
                  {getFieldDecorator('description', {
                    initialValue: description,
                  })(<TextArea rows={4} placeholder="文章描述" />)}
                </FormItem>
                <FormItem label="文章标签" {...fullLayout}>
                  {getFieldDecorator('tag', { initialValue: tag })(
                    <TagSelect hideCheckAll style={{ marginTop: 5 }} expandable>
                      {tagList.map((item, index) => (
                        <TagSelect.Option
                          className={styles.tags}
                          value={item._id}
                          key={index}
                        >
                          {item.name}
                        </TagSelect.Option>
                      ))}
                    </TagSelect>
                  )}
                </FormItem>
                <FormItem label="文章内容" {...fullLayout} required>
                  <MarkdownEditor
                    submitContent={this.contentChangeHandle}
                    content={content}
                  />
                </FormItem>
              </Card>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Card title="分类目录" bordered={false}>
                <FormItem {...fullLayout}>
                  {getFieldDecorator('category', { initialValue: category })(
                    <CheckboxGroup>
                      <Row>
                        {categoryList.map((item, index) => (
                          <Col span={24} key={index}>
                            <Checkbox value={item._id}>{item.name}</Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </CheckboxGroup>
                  )}
                </FormItem>
              </Card>
              <Card
                title={'自定义扩展'}
                bordered={false}
                style={{ marginTop: 15 }}
              >
                <div className={styles['extendsBox']}>
                  {extend.map((item, index) => (
                    <InputGroup className={styles['extends-item']} key={index}>
                      <Row gutter={24}>
                        <Col span={10}>
                          <Input
                            placeholder="name"
                            value={item.name}
                            onChange={this.handleExtendsItemInputChange(
                              index,
                              'name'
                            )}
                          />
                        </Col>
                        <Col span={10}>
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
                            className={styles.extendsButton}
                            icon="delete"
                            onClick={this.handleRemoveExtendsItem(index)}
                          />
                        </Col>
                      </Row>
                    </InputGroup>
                  ))}
                  <Button
                    type="primary"
                    icon="plus"
                    block
                    style={{ marginTop: 12 }}
                    onClick={this.handleAddExtendsItem}
                  >
                    增加扩展
                  </Button>
                </div>
              </Card>
              <Card title="缩略图" bordered={false} style={{ marginTop: 15 }}>
                <ImgUpload emitPicture={this.getImgurl} picture={thumb} />
              </Card>
              <Card
                title={'发布选项'}
                bordered={false}
                style={{ marginTop: 15 }}
              >
                <FormItem label="来源" {...formItemLayout}>
                  {getFieldDecorator('origin', { initialValue: origin })(
                    <Select style={{ width: '100%' }}>
                      <Option value={0}>原创</Option>
                      <Option value={1}>转载</Option>
                      <Option value={2}>混合</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                  {getFieldDecorator('state', { initialValue: state })(
                    <Select style={{ width: '100%' }}>
                      <Option value={1}>直接发布</Option>
                      <Option value={0}>存为草稿</Option>
                      <Option value={-1}>已删除</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem label="公开度" {...formItemLayout}>
                  {getFieldDecorator('public', { initialValue: _public })(
                    <Select style={{ width: '100%' }}>
                      <Option value={1}>公开</Option>
                      <Option value={0}>密码访问</Option>
                      <Option value={-1}>私密</Option>
                    </Select>
                  )}
                </FormItem>
                <Divider />
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  loading={
                    type === 'post'
                      ? loading.effects['articleDetail/postArticle']
                      : loading.effects['articleDetail/editArticle']
                  }
                >
                  <IconFont type="icon-doneall" style={{ color: 'white' }} />
                  {type === 'post' ? '添加' : '修改'}文章
                </Button>
              </Card>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

ArticleDetail.propTypes = {
  form: PropTypes.object,
  articleDetail: PropTypes.object,
  loading: PropTypes.object,
}

export default ArticleDetail
