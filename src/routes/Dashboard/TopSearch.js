import React, {Component} from 'react';
import {Table, Card} from 'antd';
import Ellipsis from "../../components/Ellipsis"
const columns = [
  {
    title: "ID",
    dataIndex: 'ID',
    key: 'ID'
  }, {
    title: "POSTID",
    dataIndex: 'postID',
    key: 'postID'
  }, {
    title: "Content",
    dataIndex: 'content',
    key: 'content',
    render: text=> (
      <Ellipsis tooltip lines={1}>
        {text}
      </Ellipsis>
    ),
  }, {
    title: "发布时间",
    dataIndex: 'time',
    key: 'time',
    align: 'right',
    width:140
  }
];

export class TopSearch extends Component {
  state = {
    loading: false,
    searchData: []
  }
  componentDidMount() {
    this.fetch();
  }
  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
    });
  }

  fetch = (params = {}) => {
    const searchData=[{
      ID:1,
      postID:22,
      content:"你长的很好看啊你长的很好看啊你长的很好看啊你长的很好看啊你长的很好看啊",
      time:"2019/3/12 16:45:08"
    },{
      ID:2,
      postID:22,
      content:"你长的很好看啊",
      time:"2019/3/12 16:45:08"
    },{
      ID:3,
      postID:22,
      content:"你长的很好看啊",
      time:"2019/3/12 16:45:08"
    },{
      ID:4,
      postID:22,
      content:"你长的很好看啊",
      time:"2019/3/12 16:45:08"
    },{
      ID:5,
      postID:22,
      content:"你长的很好看啊",
      time:"2019/3/12 16:45:08"
    }]
    this.setState({ loading: true });
    setTimeout(()=>{
      const pagination = { ...this.state.pagination };
      pagination.total = 200;
      this.setState({
        loading: false,
        searchData,
        pagination,
      });
    },1000)
  }

  render() {
    const {title}=this.props;
    const {loading,searchData,pagination}=this.state;
    return (
      <Card
        bordered={false}
        title={title}
      >
        <Table
          pagination={pagination}
          loading={loading}
          onChange={this.handleTableChange}
          rowKey={record => record.ID}
          size="small"
          columns={columns}
          dataSource={searchData}
        />
      </Card>
    )
  }
}

export default TopSearch;
