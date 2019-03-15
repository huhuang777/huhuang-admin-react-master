import React,{Component}from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Card, Form, Input,Button ,Divider,Icon,Dropdown,Menu,Table} from 'antd'
import styles from './index.module.less'
import IconFont from '../../../components/IconFont'
import Ellipsis from "../../../components/Ellipsis"

const FormItem = Form.Item
const { TextArea,Group:InputGroup,Search} = Input;

const defaultFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}

export class AllCategory extends Component {

  state = {
    searchText: '',
    list: [{
      id:"1",
      name:"编译原理",
      slug:"compilation",
      description:"编译原理编译原理编译原理编译原理编译原理编译原理",
      count:2
    },{
      id:"2",
      name:"编译原理",
      slug:"compilation",
      description:"编译原理编译原理编译原理编译原理编译原理编译原理",
      count:2
    },{
      id:"3",
      name:"编译原理",
      slug:"compilation",
      description:"编译原理编译原理编译原理编译原理编译原理编译原理",
      count:2
    },{
      id:"4",
      name:"编译原理",
      slug:"compilation",
      description:"编译原理编译原理编译原理编译原理编译原理编译原理",
      count:2
    },{
      id:"5",
      name:"编译原理",
      slug:"compilation",
      description:"编译原理编译原理编译原理编译原理编译原理编译原理",
      count:2
    },{
      id:"6",
      name:"编译原理",
      slug:"compilation",
      description:"编译原理编译原理编译原理编译原理编译原理编译原理",
      count:2
    },{
      id:"7",
      name:"编译原理",
      slug:"compilation",
      description:"编译原理编译原理编译原理编译原理编译原理编译原理",
      count:2
    },{
      id:"8",
      name:"编译原理",
      slug:"compilation",
      description:"编译原理编译原理编译原理编译原理编译原理编译原理",
      count:2
    }],
    showModal: false,
    selectedRowKeys:[], 
    editId:"",
    model: {
      name: '',
      description: '',
      slug:'',
      extends: [{ name: 'icon', value: 'icon-category'}]
    }
  }
  columns=[
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '别名',
      dataIndex: 'slug',
      key: 'slug'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width:"20%",
      render:text =>(
        text?
        <Ellipsis lines={1}>{text}</Ellipsis>:<span>暂无描述</span>
      )
    },
    {
      title: '文章数',
      dataIndex: 'count',
      key: 'count',
      align:"center",
      render:text =>(
        text?
        <span>{text}</span>
        :<span>0</span>
      )
    },
    {
      title:"操作",
      render:category=>(
        <Button.Group className={styles.buttonGroup}>
          <Button className={styles.edit} >编辑</Button>
          <Button className={styles.delete}>删除</Button>
          <Button type="primary">查看</Button>
        </Button.Group>
      )
    }
  ]
  
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  render () {
    const {getFieldDecorator} = this.props.form;
    const { selectedRowKeys,list} = this.state;
    const rowSelection={
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const menu=(
      <Menu>
        <Menu.Item key="1">删除选中</Menu.Item>
      </Menu>
    )
    return (
      <div className={styles.pageMain}>
        <Row gutter={24}>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
            title="添加文章分类"
            bordered={false}
            >
              <Form layout="vertical">
                <FormItem label="名称">
                  {getFieldDecorator("name")(
                    <Input
                      placeholder="分类名称"
                        />
                      )}
                  <span className={styles["sub-little-text"]}>这将是它在站点上显示的名字</span>
                </FormItem>
                <FormItem label="别名">
                  {getFieldDecorator("slug")(
                    <Input
                      placeholder="分类别名"
                        />
                      )}
                  <span className={styles["sub-little-text"]}>“别名”是在URL中使用的别称，建议小写，字母、数字、连字符（-）</span>
                </FormItem>
                <FormItem label="描述">
                  {getFieldDecorator("description")(
                    <TextArea
                      className={styles.description}
                      rows={3}
                      placeholder="分类描述"
                        />
                      )}
                  <span className={styles["sub-little-text"]}>该分类的描述</span>
                </FormItem>
                <FormItem label="自定义扩展">
                  <div className={styles.extendsBox}>
                    {
                      this.state.model.extends.map((item, index) => (
                        <InputGroup className={styles.extends_item} key={index}>
                          <Col span={10}>
                            <Input placeholder="name" value={item.name} />
                          </Col>
                          <Col span={12}>
                            <Input placeholder="value" value={item.value}/>
                          </Col>
                          <Col span={2}>
                            <Button className={styles.extendsButton} icon="delete"/>
                          </Col>
                        </InputGroup>
                      ))
                    }
                    <Button type="primary" icon="plus" block style={{marginTop:12}}>增加扩展</Button>
                    <span className={styles["sub-little-text"]}>可以为当前标签扩展自定义扩展属性</span>
                    <Divider/>
                    <Col span={12}>
                      <Button type="primary">
                        <IconFont type="icon-doneall" style={{color:'white'}}/>
                        {this.state.editId?'修改' : '添加'}分类目录
                      </Button>
                    </Col>
                    <Col span={6}>
                      <Button icon="reload">
                        重置
                      </Button>
                    </Col>
                  </div>
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
            title="分类管理"
            bordered={false}
            >
              <Button.Group className={styles.buttonGroup}>
                <Button type="primary" icon="reload">刷新</Button>
                <Button type="primary" icon="delete">清空搜索词</Button>
                <Dropdown overlay={menu}>
                  <Button>
                    <Icon type="align-left" />批量操作 <Icon type="down" />
                  </Button>
                </Dropdown>
              </Button.Group>
              <Search
                className={styles.extraContentSearch}
                placeholder="搜索相关标签"
                enterButton="搜索"
                onSearch={() => ({})} 
              />
              <Table 
                style={{marginTop:20}}
                columns={this.columns}
                rowKey={"id"}
                dataSource={list}
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
  fetching: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired,
  categoryList: PropTypes.array.isRequired,
  fetchCategoryList: PropTypes.func.isRequired,
  createCategoryItem: PropTypes.func.isRequired,
  deleteCategoryItem: PropTypes.func.isRequired
}

export default Form.create({name:"AllCategory"})(AllCategory);
