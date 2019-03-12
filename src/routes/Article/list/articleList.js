import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Card, Radio, Select, Input } from 'antd'
import styles from './index.module.less'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
export class ArticleList extends Component {

  render() {
    return (
      <Card
        bordered={false}
        title="文章列表"
        bodyStyle={{
        padding: '0 32px 40px 32px'
      }}>
        <div className={styles.searchCell}>
          <RadioGroup defaultValue="all" buttonStyle="solid">
            <RadioButton value="all">全部</RadioButton>
            <RadioButton value="1">已发布</RadioButton>
            <RadioButton value="0">草稿</RadioButton>
            <RadioButton value="-1">回收站</RadioButton>
          </RadioGroup>
          <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
        </div>
      </Card>
    );
  };
}
ArticleList.propTypes = {
  articleList: PropTypes.array.isRequired,
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
export default ArticleList;
