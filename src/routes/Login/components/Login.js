import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Form, Input, Icon } from 'antd'
import styles from '../assets/Login.less'

const FormItem = Form.Item

export class Login extends Component {

  state = {
    loginLoading: false
  }

  render () {
    return (
      <div className = {styles.main} >
        <div className={styles["login-background"]}>
        <span />
        </div>
      </div>
    );
  }
}

export default Login;
