import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {Button, Row, Form, Input, Icon ,Col} from 'antd'
import styles from './index.module.less'

export class Dashboard extends Component {
  setCardList(){
    const {CardList}=this.props;
    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: {
        marginBottom: 24
      }
    };
    return CardList.map((item,index)=>{
      return (
        <Col {...topColResponsiveProps} key={index}>
          <div className={styles.cardShow}>
            <p>{item.name}</p>
            <p>{item.count}</p>
            <Icon type={item.icon} className={styles.icon} />
          </div>
        </Col>
      )
    })
  }

  render() {
    return (
      <Row gutter={24}>
        {this.setCardList()}
      </Row>
    );
  };
}

export default Dashboard;
