import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Row, Col, Card, Form, Input, Button, Spin, Divider } from 'antd'
import styles from './index.less'
import { IconFont, ImgUpload } from 'components'
import { cloneDeep } from 'lodash'
import { Base64 } from 'js-base64'

const FormItem = Form.Item
const { TextArea } = Input

class editUser extends React.Component {
  getImgurl = url => {
    const { dispatch, option } = this.props
    const { users } = option
    dispatch({
      type: 'option/updateState',
      payload: {
        users: {
          ...users,
          gravatar: url,
        },
      },
    })
  }
  handleUserSubmit = e => {
    const { dispatch, option, form } = this.props
    const { users } = option
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const authFormData = cloneDeep(values)
        Object.keys(authFormData).forEach(key => {
          const value = authFormData[key]
          const isPassword = key.includes('password')
          authFormData[key] = isPassword ? Base64.encode(value) : value
        })
        Reflect.deleteProperty(authFormData, 'rel_new_password')
        dispatch({
          type: 'option/editUser',
          payload: {
            ...authFormData,
            gravatar: users.gravatar,
          },
        }).then(() => {})
      }
    })
  }
  render() {
    const { form, loading, option } = this.props
    const { getFieldDecorator } = form
    const { users } = option
    const { gravatar, name, slogan } = users
    const fullLayout = {
      labelCol: {
        sm: { span: 24 },
        xl: { span: 5 },
        xxl: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 24 },
        xl: { span: 19 },
        xxl: { span: 20 },
      },
    }
    return (
      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
        <Card title="个人设置" bordered={false}>
          <Form layout="horizontal" onSubmit={this.handleUserSubmit}>
            <FormItem
              label="个人头像"
              required
              {...fullLayout}
              wrapperCol={{ xl: { span: 6 }, xxl: { span: 6 } }}
            >
              <ImgUpload emitPicture={this.getImgurl} picture={gravatar} />
            </FormItem>
            <FormItem label="姓名" required {...fullLayout}>
              {getFieldDecorator('name', { initialValue: name })(
                <Input placeholder="个人姓名" />
              )}
            </FormItem>
            <FormItem label="个人签名" required {...fullLayout}>
              {getFieldDecorator('slogan', { initialValue: slogan })(
                <Input placeholder="个人签名" />
              )}
            </FormItem>
            <Divider />
            <FormItem
              label="旧密码"
              {...fullLayout}
              wrapperCol={{ xl: { span: 8 }, xxl: { span: 8 } }}
            >
              {getFieldDecorator('password')(
                <Input type="password" placeholder="输入旧密码" />
              )}
            </FormItem>
            <FormItem
              label="新密码"
              {...fullLayout}
              wrapperCol={{ xl: { span: 8 }, xxl: { span: 8 } }}
            >
              {getFieldDecorator('new_password')(
                <Input type="password" placeholder="输入新密码" />
              )}
            </FormItem>
            <FormItem
              label="确认新密码"
              {...fullLayout}
              wrapperCol={{ xl: { span: 8 }, xxl: { span: 8 } }}
            >
              {getFieldDecorator('rel_new_password')(
                <Input type="password" placeholder="确认新密码" />
              )}
            </FormItem>
            <Divider />
            <Col offset={10}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading.effects['option/editUser']}
              >
                <IconFont type="icon-doneall" style={{ color: 'white' }} />
                保存修改
              </Button>
            </Col>
          </Form>
        </Card>
      </Col>
    )
  }
}

const EditUserForm = Form.create()(editUser)

@Form.create()
@connect(({ option, loading }) => ({ option, loading }))
class Option extends PureComponent {
  handleSubmit = e => {
    const { dispatch, option, form } = this.props
    const { options } = option
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const { ips, blackKeywords, mails, keywords, ...other } = values
        const format = value =>
          String(value)
            .split('\n')
            .filter(t => !!t)
        const param = {
          ...options,
          ...other,
          blacklist: {
            ips: format(ips),
            keywords: format(blackKeywords),
            mails: format(mails),
          },
          keywords: format(keywords),
        }
        dispatch({
          type: 'option/edit',
          payload: param,
        }).then(() => {})
      }
    })
  }

  render() {
    const { form, loading, option, dispatch } = this.props
    const { getFieldDecorator } = form
    const { options } = option
    const {
      blacklist = {},
      description,
      keywords = [],
      ping_sites,
      site_email,
      site_icp,
      site_url,
      sub_title,
      title,
    } = options
    const { ips = [], keywords: blackKeywords = [], mails = [] } = blacklist
    const fullLayout = {
      labelCol: {
        sm: { span: 24 },
        xl: { span: 5 },
        xxl: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 24 },
        xl: { span: 19 },
        xxl: { span: 20 },
      },
    }
    return (
      <div className={styles.pageMain}>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Spin spinning={false}>
              <Card title={'基本设置'} bordered={false}>
                <Form layout="horizontal" onSubmit={this.handleSubmit}>
                  <FormItem label="站点标题" required {...fullLayout}>
                    {getFieldDecorator('title', { initialValue: title })(
                      <Input placeholder="站点标题" />
                    )}
                  </FormItem>
                  <FormItem label="副标题" required {...fullLayout}>
                    {getFieldDecorator('sub_title', {
                      initialValue: sub_title,
                    })(<Input placeholder="副标题" />)}
                  </FormItem>
                  <FormItem label="关键词" {...fullLayout}>
                    {getFieldDecorator('keywords', {
                      initialValue: keywords.join('\n'),
                    })(
                      <TextArea
                        className={styles.description}
                        rows={3}
                        placeholder="关键词，每行为一个"
                      />
                    )}
                  </FormItem>
                  <FormItem label="描述" {...fullLayout}>
                    {getFieldDecorator('description', {
                      initialValue: description,
                    })(
                      <TextArea
                        className={styles.description}
                        rows={3}
                        placeholder="描述"
                      />
                    )}
                  </FormItem>
                  <FormItem label="站点地址" required {...fullLayout}>
                    {getFieldDecorator('site_url', { initialValue: site_url })(
                      <Input placeholder="站点地址（URL）" />
                    )}
                  </FormItem>
                  <FormItem label="电子邮件地址" required {...fullLayout}>
                    {getFieldDecorator('site_email', {
                      initialValue: site_email,
                    })(<Input placeholder="博客邮件地址" />)}
                  </FormItem>
                  <FormItem label="ICP备案号" required {...fullLayout}>
                    {getFieldDecorator('site_icp', { initialValue: site_icp })(
                      <Input placeholder="如：陕ICP备0000000号" />
                    )}
                  </FormItem>
                  <FormItem label="黑名单 - IP" {...fullLayout}>
                    {getFieldDecorator('ips', {
                      initialValue: ips.join('\n'),
                    })(
                      <TextArea
                        className={styles.description}
                        rows={3}
                        placeholder="这些IP来源的评论将被拒绝，用换行分隔多个IP地址。"
                      />
                    )}
                  </FormItem>
                  <FormItem label="黑名单 - 邮箱" {...fullLayout}>
                    {getFieldDecorator('mails', {
                      initialValue: mails.join('\n'),
                    })(
                      <TextArea
                        className={styles.description}
                        rows={3}
                        placeholder="这些邮箱来源的评论将被拒绝，用换行分隔多个邮箱地址。"
                      />
                    )}
                  </FormItem>
                  <FormItem label="黑名单 - 关键字" {...fullLayout}>
                    {getFieldDecorator('blackKeywords', {
                      initialValue: blackKeywords.join('\n'),
                    })(
                      <TextArea
                        className={styles.description}
                        rows={3}
                        placeholder="包含这些关键字的的评论将被拒绝，用换行分隔多个关键词。"
                      />
                    )}
                  </FormItem>
                  <Divider />
                  <Col offset={10}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading.effects['option/edit']}
                    >
                      <IconFont
                        type="icon-doneall"
                        style={{ color: 'white' }}
                      />
                      保存修改
                    </Button>
                  </Col>
                </Form>
              </Card>
            </Spin>
          </Col>
          <EditUserForm loading={loading} option={option} dispatch={dispatch} />
        </Row>
      </div>
    )
  }
}

Option.propTypes = {
  option: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Option
