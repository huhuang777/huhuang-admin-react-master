import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Icon, Input } from 'antd'
import styles from './index.less'
const FormItem = Form.Item

@connect(({ loading }) => ({ loading }))
@Form.create()
class Login extends PureComponent {
  handleSubmit = e => {
    e.preventDefault()
    const { dispatch, form } = this.props
    const { validateFieldsAndScroll } = form
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }

  render() {
    const { loading, form } = this.props
    const { getFieldDecorator } = form
    const inputList = [
      {
        name: 'userName',
        rules: [
          {
            required: true,
            message: '你的用户名在哪!',
          },
        ],
        icon: 'user',
        placeholder: '输入你的用户名吧',
      },
      {
        name: 'password',
        rules: [
          {
            required: true,
            message: '你居然不知道密码，芝麻不开门!',
          },
        ],
        icon: 'lock',
        placeholder: '输入密码进入新世界',
      },
    ]
    return (
      <div className={styles.main}>
        <div className={styles['login-background']}>
          <span />
        </div>
        <div className={styles['login-main']}>
          <Form onSubmit={this.handleSubmit}>
            {inputList.map(item => {
              const Labb = item.name !== 'password' ? Input : Input.Password
              return (
                <FormItem hasFeedback key={item.name}>
                  {getFieldDecorator(item.name, { rules: item.rules })(
                    <Labb
                      size="large"
                      prefix={
                        <Icon
                          type={item.icon}
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      }
                      placeholder={item.placeholder}
                    />
                  )}
                </FormItem>
              )
            })}
            <Row>
              <Button
                size="large"
                className={styles.submit}
                loading={loading.effects.login}
                type="primary"
                htmlType="submit"
              >
                Sign in
              </Button>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Login
