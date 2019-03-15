import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  Button,
  Row,
  Form,
  Input,
  Icon,
  Upload,
  Divider,
  Select,
  Checkbox,
  Col,
  Card
} from 'antd'
import SimpleMDE from 'simplemde';
import IconFont from '../../../components/IconFont'
import marked from 'marked';
import highlight from 'highlight.js';
import './simplemde.min.css';
import styles from './index.module.less'
import TagSelect from "../../../components/TagSelect";

const FormItem = Form.Item
const { TextArea,Group:InputGroup } = Input;
const {Option} = Select;
const CheckboxGroup = Checkbox.Group;

export class ArticleDetail extends Component {

  state = {
    smde: null,
    editId:'',
    imageUrl:"",
    model:{
      extends:[{}]
    }
  }
  componentDidMount() {
    this.setState({
      smd:new SimpleMDE({
        element: document.getElementById('editor1'),
        autofocus: true,
        autosave: true,
        previewRender(plainText) {
          return marked(plainText, {
            renderer: new marked.Renderer(),
            gfm: true,
            pedantic: false,
            sanitize: false,
            tables: true,
            breaks: true,
            smartLists: true,
            smartypants: true,
            highlight(code) {
              return highlight.highlightAuto(code).value;
            },
          });
        },
      })
    })
  }
  handleSubmit = (e) => {}

  render() {
    const {getFieldDecorator} = this.props.form;
    const uploadButton = (
      <div>
        <Icon type={ 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    const tags=["计算机","灵魂","生活","工作","思考","计算机","灵魂","生活","工作","思考","计算机","灵魂","生活","工作","思考","计算机","灵魂","生活","工作","思考"]
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 14 },
      },
    };
    const cat=[{
      key:"code",
      value:"Code"
    },{
      key:"think",
      value:"Think"
    }]
    const fullLayout= {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
        md: { span: 21 },
      },
    };
    return (
      <div className={styles.pageMain}>
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card title="撰写新文章" bordered={false}>
              <Form layout="horizontal">
                <FormItem label="文章标题" {...fullLayout}>
                  {getFieldDecorator("title")(
                    <Input
                      placeholder="文章标题" 
                    />
                  )}
                </FormItem>
                <FormItem label="文章关键词" {...fullLayout}>
                  {getFieldDecorator("keywords")(
                    <Input
                      placeholder="多个关键词以 ' , ' 隔开" 
                    />
                  )}
                </FormItem>
                <FormItem label="文章描述" {...fullLayout}>
                  {getFieldDecorator("description")(
                    <TextArea
                      rows={4}
                      placeholder="文章描述" 
                    />
                  )}
                </FormItem>
                <FormItem label="文章标签" {...fullLayout}>
                  {getFieldDecorator("tags")(
                    <TagSelect hideCheckAll style={{marginTop:5}} expandable>
                      {
                        tags.map((item,index)=>(
                          <TagSelect.Option className={styles.tags} value={index} key={index}>{item}</TagSelect.Option>
                        ))
                      }
                      
                    </TagSelect>
                  )}
                </FormItem>
                <FormItem label="文章内容" {...fullLayout}>
                  <textarea id="editor1" style={{ marginBottom: 20, width: "100%" }} size="large" rows={6} />
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card title="分类目录" bordered={false}>
              <CheckboxGroup>
                <Row>
                  {
                    cat.map((item,index)=>(
                      <Col span={24} key={index}>
                        <Checkbox value={item.key}>{item.value}</Checkbox>
                      </Col>
                    ))
                  }
                </Row>
              </CheckboxGroup>
            </Card>
            <Card title={"自定义扩展"} bordered={false} style={{marginTop:15}}>
              <div className={styles.extendsBox}>
                
                  {
                    this.state.model.extends.map((item, index) => (
                      <InputGroup className={styles.extends_item} key={index}>
                      <Row gutter={24}>
                        <Col span={10}>
                          <Input placeholder="name" value={item.name} />
                        </Col>
                        <Col span={10}>
                          <Input placeholder="value" value={item.value}/>
                        </Col>
                        <Col span={2}>
                          <Button className={styles.extendsButton} icon="delete"/>
                        </Col>
                        </Row>
                      </InputGroup>
                    ))
                  }
                  <Button type="primary" icon="plus" block style={{marginTop:12}}>增加扩展</Button>
                
              </div>
            </Card>
            <Card title="缩略图" bordered={false} style={{marginTop:15}}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
            </Upload>
            </Card>
            <Card title={"发布选项"} bordered={false} style={{marginTop:15}}>
              <FormItem label="来源" {...formItemLayout}>
                {getFieldDecorator("title")(
                  <Select defaultValue={"0"} style={{width:"100%"}}>
                    <Option value="0">原创</Option>
                    <Option value="1">转载</Option>
                    <Option value="2">混合</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="状态" {...formItemLayout}>
                {getFieldDecorator("title")(
                  <Select defaultValue={"1"} style={{width:"100%"}}>
                    <Option value="1">直接发布</Option>
                    <Option value="0">存为草稿</Option>
                    <Option value="-1">已删除</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="公开度" {...formItemLayout}>
                {getFieldDecorator("title")(
                  <Select defaultValue={"1"} style={{width:"100%"}}>
                    <Option value="1">公开</Option>
                    <Option value="0">密码访问</Option>
                    <Option value="-1">私密</Option>
                  </Select>
                )}
              </FormItem>
              <Divider />
              <Button type="primary" block>
                <IconFont type="icon-doneall" style={{color:'white'}}/>
                {this.state.editId?'修改' : '添加'}文章
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create({name: ""})(ArticleDetail);
