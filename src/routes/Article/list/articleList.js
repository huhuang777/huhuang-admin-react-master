import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  Radio,
  Button,
  Input,
  Icon,
  Select,
  Row,
  Col,
  Form
} from 'antd'
import StandardFormRow from "../../../components/StandardFormRow";
import TagSelect from "../../../components/TagSelect";
import styles from './index.module.less'
import {PublicState, OriginState} from "../../../config/enum"
import TableList from "./list-table"

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {Search} = Input;
const FormItem = Form.Item;
const {Option} = Select;
class ArticleList extends Component {
  state={
    selectedRows:[]
  }
  componentWillMount() {
    this.init();
  }
  init() {
    const {articleList, fetchArticleList, fetchCategoryList, fetchTagList} = this.props
    if (articleList && articleList.length) {
      return
    }
    // fetchArticleList({}, true)
    // fetchCategoryList()
    // fetchTagList()
  }
  render() {
    const {form} = this.props;
    const { selectedRows } = this.state;
    const getFieldDecorator = form.getFieldDecorator;
    const actionsTextMap = {
      expandText: "展开",
      collapseText: "收起",
      selectAllText: "全部"
    };
    const formItemLayout = {
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 24
        },
        md: {
          span: 12
        }
      }
    };

    const extraContent = (
      <div className={styles.searchCell}>
        <RadioGroup defaultValue="all" buttonStyle="solid">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="1">已发布</RadioButton>
          <RadioButton value="0">草稿</RadioButton>
          <RadioButton value="-1">回收站</RadioButton>
        </RadioGroup>
        <Button.Group className={styles.buttonGroup}>
          <Button type="primary" icon="reload">刷新</Button>
          <Button type="primary" icon="delete">重置搜索条件</Button>
        </Button.Group>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入"
          enterButton="搜索"
          onSearch={() => ({})} 
        />
      </div>
    )
    return (
      <Card
        bordered={false}
        title="文章列表"
        extra={extraContent}
        bodyStyle={{
        padding: '0 32px 40px 32px'
      }}
      >
        <Form layout="inline" style={{
          paddingTop: 11
        }}
        >
          <StandardFormRow
            title="所属分类"
            block
            style={{
            paddingBottom: 11
          }}
          >
            <FormItem>
              {getFieldDecorator('category')(
                <TagSelect expandable actionsText={actionsTextMap}>
                  <TagSelect.Option value="cat1">类目一</TagSelect.Option>
                </TagSelect>
              )}
            </FormItem>
          </StandardFormRow>
          <StandardFormRow
            title="所属标签"
            block
            style={{
            paddingBottom: 11
          }}
          >
            <FormItem key="tags">
              {getFieldDecorator('tags')(
                <TagSelect expandable actionsText={actionsTextMap}>
                  <TagSelect.Option value="cat1">类目一</TagSelect.Option>
                </TagSelect>
              )}
            </FormItem>
          </StandardFormRow>
          <StandardFormRow title="其它搜索选项" grid last>
            <Row gutter={16}>
              <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                <FormItem {...formItemLayout} label="私密程度">
                  {getFieldDecorator('public', {})(
                    <Select
                      placeholder="不限"
                      style={{
                      maxWidth: 200,
                      width: '100%'
                    }}
                    >
                      <Option value={PublicState.all}>不限</Option>
                      <Option value={PublicState.public}>公开</Option>
                      <Option value={PublicState.password}>密码</Option>
                      <Option value={PublicState.secret}>私密</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                <FormItem {...formItemLayout} label="文章来源">
                  {getFieldDecorator('origin', {})(
                    <Select
                      placeholder="不限"
                      style={{
                      maxWidth: 200,
                      width: '100%'
                    }}
                    >
                      <Option value={OriginState.all}>不限</Option>
                      <Option value={OriginState.original}>原创</Option>
                      <Option value={OriginState.reprint}>转载</Option>
                      <Option value={OriginState.hybrid}>混合</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </StandardFormRow>
        </Form>
        <TableList />
      </Card>
    );
  };
}
ArticleList.propTypes = {
  articleList: PropTypes.array.isRequired,
  catList: PropTypes.array.isRequired,
  tagList: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  refreshing: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
  currentArticleId: PropTypes.string,
  fetchArticleList: PropTypes.func.isRequired,
  editArticleItem: PropTypes.func.isRequired,
  deleteArticleItem: PropTypes.func.isRequired,
  viewArticleItem: PropTypes.func.isRequired,
  fetchCategoryList: PropTypes.func.isRequired,
  fetchTagList: PropTypes.func.isRequired
}
export default Form.create({name: "articleList"})(ArticleList);
