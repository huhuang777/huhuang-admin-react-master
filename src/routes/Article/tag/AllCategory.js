import React,{Component}from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Card, Form, Input,Button ,Spin,Divider,Icon,Dropdown,Menu,Table,Modal} from 'antd'
import styles from './index.module.less'
import IconFont from '../../../components/IconFont'
import Ellipsis from "../../../components/Ellipsis"
import Service from "../../../service"

const FormItem = Form.Item
const { TextArea,Group:InputGroup,Search} = Input;
const {category} = Service

const defaultFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}

export class AllCategory extends Component {

  state = {
    searchText: '',
    showList: [],
    showModal: false,
    selectedRowKeys:[], 
    loading:false,
    addLoading:false,
    editId:"",
    pagination:{
      pageSize:10,
      current:1
    },
    model: {
      name: '',
      description: '',
      slug:'',
      extends: [{ name: 'icon', value: 'icon-category'}]
    }
  }
  componentWillMount () {
    this.init()
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
          <Button className={styles.edit} onClick={()=>this.edit(category)}>编辑</Button>
          <Button className={styles.delete} onClick={()=>this.delete([category._id])}>删除</Button>
          <Button type="primary" onClick={()=>this.edit(category)}>查看</Button>
        </Button.Group>
      )
    }
  ]
  delete(id=[]){
    const that =this;
    if(id.length!==1){
      id=this.state.selectedRowKeys;
      if(id.length<1){
        Modal.info({
          title: '温馨提示',
          content: "要先选中才能删除啊。大海猪",
        })
        return;
      }
    }
    Modal.confirm({
      title: '确认操作',
      content: '确认要删除选中的分类吗',
      onOk(){
        const funcc=id.length>1?(param)=>category.batchDelete(param):(param)=>category.deleteItem(param)();
        const param=id.length>1?{data:{
          categories:id
        }}:id.pop();
        funcc(param).then( _ =>{
          that.setState({
            selectedRowKeys:[]
          })
          that.init();
        })
      }
    });
    
  }
  edit(category={}){
    this.setState({
      model:category
    })
    this.props.form.setFieldsValue(category)
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.getList({
      per_page: pagination.pageSize,
      page: pagination.current
    });
  }

  getList = (params = {}) => {
    this.setState({ loading: true });
    category.getList({params}).then(res => {
      const pagination = { ...this.state.pagination };
      pagination.total = res.result.pagination.total;
      this.setState({
        loading: false,
        showList: res.result.data,
        pagination,
      });
    })
  }
  search(value){
    Modal.warning({
      title: '搜索还没做呢',
      content: (
        <div>
          <p>大海猪我知道是你</p>
          <p>别点这个了</p>
        </div>
      ),
      onOk() {},
    });
  }
  init () {
    this.setState({ 
      pagination: {
        pageSize:10,
        current:1
      },
      model: {
        name: '',
        description: '',
        slug:'',
        extends: [{ name: 'icon', value: 'icon-category'}]
      }, 
    });
    const {pagination,model} = this.state;
    this.props.form.setFieldsValue(model);
    this.getList({
      per_page: pagination.pageSize,
      page: pagination.current
    });
  }
  initAdd(){
    this.setState({ 
      model: {
        name: '',
        description: '',
        slug:'',
        extends: [{ name: 'icon', value: 'icon-category'}]
      }, 
    });
    const {model} = this.state;
    this.props.form.setFieldsValue(model);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    let {model,addLoading} = this.state;
    if(addLoading){
      return;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        model={
          ...model,
          ...values
        }
        this.setState({
          addLoading:true
        })
        const funcc=model._id?param=>category.editItem(model._id)(param):param=>category.create(param);
        funcc({data:model}).then(res=>{
          this.setState({
            addLoading:false
          })
          this.init();
        }).catch(err=>{
          this.setState({
            addLoading:false
          })
        })
      }
    });
  }
  handleChangeExtends = _extends => {
    let {model} = this.state;
    model.extends=_extends;
    this.setState({
      model:{...model}
    })
  }

  handleAddExtendsItem = () => {
    this.handleChangeExtends([
      ...this.state.model.extends,
      { name: '', value: '' }
    ])
  }

  handleExtendsItemInputChange = (index, type) => e => {
    const _extends = [...this.state.model.extends]
    _extends.splice(index, 1, {
      ..._extends[index],
      [type]: e.target.value
    })
    this.handleChangeExtends(_extends)
  }

  handleRemoveExtendsItem = index => () => {
    const _extends = [...this.state.model.extends]
    _extends.splice(index, 1)
    this.handleChangeExtends(_extends)
  }
  render () {
    const {getFieldDecorator} = this.props.form;
    const { selectedRowKeys,showList,pagination,loading,searchText,addLoading} = this.state;
    const rowSelection={
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const menu=(
      <Menu onClick={()=>this.delete()}>
        <Menu.Item key="1">删除选中</Menu.Item>
      </Menu>
    )
    return (
      <div className={styles.pageMain}>
        <Row gutter={24}>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Spin spinning={addLoading}>
              <Card
              title="添加文章分类"
              bordered={false}
              >
                <Form layout="vertical" onSubmit={this.handleSubmit}>
                  <FormItem label="名称" required>
                    {getFieldDecorator("name")(
                      <Input
                        placeholder="分类名称"
                      />
                        )}
                    <span className={styles["sub-little-text"]}>这将是它在站点上显示的名字</span>
                  </FormItem>
                  <FormItem label="别名" required>
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
                              <Input placeholder="key" value={item.name} onChange={this.handleExtendsItemInputChange(index, 'name')} />
                            </Col>
                            <Col span={12}>
                              <Input placeholder="value" value={item.value} onChange={this.handleExtendsItemInputChange(index, 'value')} />
                            </Col>
                            <Col span={2}>
                              <Button className={styles.extndsButton} icon="delete" onClick={this.handleRemoveExtendsItem(index)}/>
                            </Col>
                          </InputGroup>
                        ))
                      }
                      <Button type="primary" icon="plus" block onClick={this.handleAddExtendsItem}>增加扩展</Button>
                      <span className={styles["sub-little-text"]}>可以为当前标签扩展自定义扩展属性</span>
                      <Divider />
                      <Col span={12}>
                        <Button type="primary" htmlType="submit">
                          <IconFont type="icon-doneall" style={{color:'white'}} />
                          {this.state.model._id?'修改' : '添加'}分类目录
                        </Button>
                      </Col>
                      <Col span={6}>
                        <Button icon="reload" onClick={()=>this.initAdd}>
                          重置
                        </Button>
                      </Col>
                    </div>
                  </FormItem>
                </Form>
              </Card>
            </Spin>
          </Col>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
            title="分类管理"
            bordered={false}
            >
              <Button.Group className={styles.buttonGroup}>
                <Button type="primary" icon="reload" onClick={()=>this.init("refresh")}>刷新</Button>
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
                value={searchText}
                onSearch={(value) => this.search(value)} 
              />
              <Table 
                style={{marginTop:20}}
                columns={this.columns}
                rowKey={record => record._id}
                loading={loading}
                dataSource={showList}
                pagination={pagination}
                onChange={this.handleTableChange}
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
