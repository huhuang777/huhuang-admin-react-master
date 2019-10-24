import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { router } from 'utils'
import { IconFont } from 'components'
import { CommentState } from 'utils/constant'
import moment from 'moment'
import { osParser, browserParser } from 'utils'
import { isGuestbook } from 'utils/check'
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
@connect(({ commentDetail, loading }) => ({ commentDetail, loading }))
class CommentDetail extends PureComponent {
  handleSubmit = e => {
    e.preventDefault()
    const { commentDetail, form, dispatch } = this.props
    const { comment } = commentDetail
    form.validateFields((err, values) => {
      if (!err) {
        const param = {
          ...comment,
          ...values,
        }
        dispatch({
          type: 'commentDetail/edit',
          payload: param,
        }).then(() => {
          router.push('/comment/list')
        })
      }
    })
  }
  render() {
    const { form, commentDetail, loading } = this.props
    const { comment, article } = commentDetail
    const { getFieldDecorator } = form
    const {
      agent,
      author = {},
      content,
      create_at,
      extends: _extends,
      ip,
      ip_location,
      is_top = false,
      likes,
      post_id,
      state = 0,
      id,
    } = comment
    const { email, name, site } = author
    const fullLayout = {
      labelCol: {
        sm: { span: 6 },
        xl: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 12 },
        xl: { span: 8 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    }
    return (
      <div className={styles['comment-form']}>
        <Form layout="horizontal" onSubmit={this.handleSubmit}>
          <Card title="评论详情" bordered={false}>
            <Row gutter={24}>
              <FormItem label="ID" {...fullLayout}>
                <span className={styles.formvalue}>{id}</span>
              </FormItem>

              <FormItem label="所在文章" {...fullLayout}>
                <span className={styles.formvalue}>
                  {isGuestbook(post_id)
                    ? '留言板'
                    : article
                    ? article.title
                    : '未知文章'}
                </span>
              </FormItem>

              <FormItem label="喜欢人数" {...fullLayout}>
                {getFieldDecorator('likes', {
                  initialValue: likes,
                })(<Input placeholder="喜欢人数" />)}
              </FormItem>

              <FormItem label="是否置顶" {...fullLayout}>
                {getFieldDecorator('is_top', {
                  initialValue: is_top + '',
                })(
                  <Select>
                    <Option value={'true'}>置顶</Option>
                    <Option value={'false'}>不置顶</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem label="状态" {...fullLayout}>
                {getFieldDecorator('state', {
                  initialValue: state,
                })(
                  <Select>
                    <Option value={CommentState.deleted}>已删除</Option>
                    <Option value={CommentState.spam}>垃圾评论</Option>
                    <Option value={CommentState.auditing}>待审核</Option>
                    <Option value={CommentState.published}>已发布</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem label="用户名" {...fullLayout}>
                {getFieldDecorator('userName', {
                  initialValue: name,
                })(<Input placeholder="用户名" />)}
              </FormItem>

              <FormItem label="用户邮箱" {...fullLayout}>
                {getFieldDecorator('userEmail', {
                  initialValue: email,
                })(<Input placeholder="用户邮箱" />)}
              </FormItem>

              <FormItem label="用户地址" {...fullLayout}>
                {getFieldDecorator('userSite', {
                  initialValue: site,
                })(<Input placeholder="用户的个人网址" />)}
              </FormItem>

              <FormItem label="创建时间" {...fullLayout}>
                <span className={styles.formvalue}>
                  {moment(create_at).format('YYYY-MM-DD HH:MM')}
                </span>
              </FormItem>

              <FormItem label="客户端信息" {...fullLayout}>
                <div className={styles.formvalue}>{ip || '未知IP'}</div>
                <div className={styles.formvalue}>
                  {ip_location
                    ? ip_location.country + ip_location.city
                    : '未知地理位置'}
                </div>
                <div className={styles.formvalue}>
                  操作系统：
                  {agent ? (
                    <span
                      dangerouslySetInnerHTML={{ __html: osParser(agent) }}
                    ></span>
                  ) : (
                    ''
                  )}
                  &nbsp;&nbsp;&nbsp;&nbsp; 浏览器：
                  {agent ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: browserParser(agent),
                      }}
                    ></span>
                  ) : (
                    <span>未知设备</span>
                  )}
                </div>
              </FormItem>
              <Divider />
              <FormItem label=" " {...fullLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading.effects['commentDetail/edit']}
                >
                  <IconFont type="icon-doneall" style={{ color: 'white' }} />
                  提交修改
                </Button>
              </FormItem>
            </Row>
          </Card>
        </Form>
      </div>
    )
  }
}

CommentDetail.propTypes = {
  form: PropTypes.object,
  commentDetail: PropTypes.object,
  loading: PropTypes.object,
}

export default CommentDetail
