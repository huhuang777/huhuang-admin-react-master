import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {Button, Row, Form, Input, Icon} from 'antd'
import styles from '../assets/Login.module.less'

const FormItem = Form.Item

export class Login extends Component {

  state = {
    loginLoading: false
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this
      .props
      .history
      .push("");
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {loginLoading} = this.state;
    const inputList = [
      {
        name: "userName",
        rules: [
          {
            required: true,
            message: '你的用户名在哪!'
          }
        ],
        icon: "user",
        placeholder: "输入你的用户名吧"
      }, {
        name: "password",
        rules: [
          {
            required: true,
            message: '你居然不知道密码，芝麻不开门!'
          }
        ],
        icon: "lock",
        placeholder: "输入密码进入新世界"
      }
    ]
    return (
      <div className={styles.main}>
        <div className={styles["login-background"]}>
          <span />
        </div>
        <div className={styles["login-main"]}>
          <Form onSubmit={this.handleSubmit}>
            {
              inputList.map((item, index) => {
                return (
                  <FormItem key={item.name}>
                    {getFieldDecorator(item.name, {rules: item.rules})(
                      <Input
                        size="large"
                        prefix={< Icon type = {
                        item.icon
                      }
                      style = {{ color: 'rgba(0,0,0,.25)' }}
                                />}
                        placeholder={item.placeholder}
                      />
                    )}
                  </FormItem>
                )
              })
            }
            <Row>
              <Button
                size="large"
                className={styles.submit}
                loading={loginLoading}
                type="primary"
                htmlType="submit"
              >
                Sign in
              </Button>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create({name:"login"})(Login);
