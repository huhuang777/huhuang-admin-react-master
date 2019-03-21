import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {Button, Row, Form, Input, Icon} from 'antd'
import styles from '../assets/Login.module.less'
import Service from "../../../service"
import { TOKEN } from '../../../constants/auth';

const FormItem = Form.Item
const {auth} = Service
export class Login extends Component {

  state = {
    loginLoading: false
  }
  componentWillMount(){
    const token = localStorage.getItem(TOKEN);
    if(token){
      this.props.history.push("/dashboard");
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        auth.login({ data: values }).then(res=>{
          if (res.result.token) {
            localStorage.setItem(TOKEN, res.result.token);
            this.props.history.push("/dashboard");
          }
        }).catch(err => {
          console.warn('登陆系统失败！', err);
        });
      }
    })
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
                const Labb = item.name !== "password"?Input:Input.Password;
                return (
                  <FormItem hasFeedback key={item.name}>
                    {getFieldDecorator(item.name, {rules: item.rules})(
                      <Labb
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
