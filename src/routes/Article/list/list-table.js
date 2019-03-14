import React, { PureComponent, Fragment } from 'react';
import { Table, Alert,Icon ,Button} from 'antd';
import IconFont from '../../../components/IconFont'
import Ellipsis from "../../../components/Ellipsis"
import styles from './index.module.less'
import {PublicState, PublishState} from "../../../config/enum"
import { NavLink } from 'react-router-dom'

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading:false,
      list:[{
        id:1,
        thumb:"https://huhuang.net/images/demo.png",
        title:"你很好看啊你很好看啊你很好看啊",
        state:1,
        description:"你很好看啊你很好看啊你很好看啊你很好看啊你很好看啊你很好看啊",
        category:[{
          name:"code"
        }],
        tag:[{
          name:"计算机",
        },{
          name:"思考",
        }],
        meta:{
          comments:8,
          likes:0,
        },
        public:1,
        create_at:"2019/09/09/ 12:12:12"
      }]
    };
  }
  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '文章',
      key: 'content',
      render: (text, article) => (
        <div className={styles["content-box"]}>
          <div className={styles["content-bg"]} style={{
             backgroundImage: 'url(' + (article.thumb || '') +')' 
          }} />
          <h4 className={styles.title} >
            <a href={'//huhuang.net/article/' + article.id} target="_blank">
              <strong>{article.title}</strong>
            </a>
            <span>&nbsp;&nbsp;</span>
            {
              article.state === PublishState.published? <IconFont type="icon-doneall" style={{color:'#1DA57A'}}/>:
              article.state === PublishState.draft?<Icon type="edit" style={{color:'#f4ea2a'}}/>:
              article.state === PublishState.recycle?<Icon type="delete" style={{color:'#d81e06'}}/>:''
            }
            <span>&nbsp;</span>
            {
              article.public !== PublicState.public?<Icon type="lock"  style={{color:'#d81e06'}}/>:''
            }
          </h4>
          <small className={styles.description}>
            {
              article.description?(<Ellipsis length={128}>{ article.description}</Ellipsis>):
              !article.description && article.content?(<Ellipsis length={128}>{ article.content}</Ellipsis>):
              (<span className={styles["text-muted"]}>暂无内容</span>)
            }
          </small>
        </div>
      ),
    },
    {
      title: '分类目录',
      key: 'category',
      render:  (text, article) => {
        if(!article.category.length){
          return (
            <li className={styles["text-muted"]}>
              <Icon type="folder" style={{color:'#8a8a8a'}}/>
              <span>&nbsp;</span>
              <span>暂无分类</span>
            </li>
          )
        }
        return (
          article.category.map((category,index) => (
            <li key={index}>
              <Icon type="folder"/>
              <span>&nbsp;</span>
              <span>{ category.name }</span>
            </li>
          ))
        )
      }
    },
    {
      title: '标签',
      key: 'tag',
      render:  (text, article) => {
        if(!article.tag.length){
          return (
            <li className={styles["text-muted"]}>
              <Icon type="tags" style={{color:'#8a8a8a'}}/>
              <span>&nbsp;</span>
              <span>暂无标签</span>
            </li>
          )
        }
        return (
          article.tag.map((tag,index) => (
            <li key={index}>
              <Icon type="tags"/>
              <span>&nbsp;</span>
              <span>{ tag.name }</span>
            </li>
          ))
        )
      }
    },
    {
      title:"评论",
      key:"comments",
      render:(text, article)=>(
        article.meta.comments?
        (<NavLink to={"/comment/post/"+article.id}>
          { article.meta.comments }条评论
        </NavLink>):(<span className={styles["text-muted"]}>暂无评论</span>)
      )
    },
    {
      title:"喜欢",
      key:"likes",
      render:(text, article)=>(
        article.meta.likes?
        (<span>{ article.meta.likes }人喜欢</span>):(<span className={styles["text-muted"]}>无人问津</span>)
      )
    },
    {
      title:"日期",
      key:"create_at",
      dataIndex:"create_at"
    },
    {
      title:"公开",
      key:"public",
      dataIndex:"public",
      render:(text)=>{
        const array=["私密","密码","公开"];
        return (
          <span>
          {array[text+1]}
          </span>
        );
      }
    },
    {
      title:"状态",
      key:"state",
      dataIndex:"state",
      render:(text)=>{
        const array=["回收站","草稿","已发布"];
        return (
          <span>
          {array[text+1]}
          </span>
        );
      }
    },
    {
      title:"操作",
      width:90,
      render:(text,article)=>(
        <div className={styles.actionList}>
            <NavLink to={"/article/edit/"+article.id}>
              <Button block type="primary" icon="edit">
                编辑文章
              </Button>
            </NavLink>
          {
            article.state === PublishState.draft?
            (<Button block onClick={() => this.moveToPublished([article.id])} style={{backgroundColor:"#e79f3d",borderColor:"#e79f3d"}}>
            <IconFont type="icon-doneall"/>
              快速发布
            </Button>):
            article.state === PublishState.recycle?
            (<Button block icon="check-circle" onClick={() => this.moveToDraft([article.id])} style={{backgroundColor:"#e79f3d",borderColor:"#e79f3d"}}>恢复文章</Button>):
            article.state === PublishState.published?
            (<Button type="primary" block icon="check-circle" onClick={() => this.moveToDraft([article.id])} style={{backgroundColor:"#e79f3d",borderColor:"#e79f3d"}}>移到草稿</Button>):""
          }
          {
            article.state === PublishState.recycle?
            (<Button type="danger" block icon="delete" onClick={() => this.delArticleModal([article.id])}>彻底删除</Button>):
            (<Button type="danger" block icon="delete" onClick={() => this.moveToRecycle([article.id])}>移回收站</Button>)
          }
          <Button type="primary" block icon="link" target="_blank" href={'//huhuang.net/article/' + article.id}>
            查看文章
          </Button>
        </div>
      )
    }
  ];
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  moveToPublished(){

  }
  moveToDraft(){}
  moveToRecycle(){}
  delArticleModal(){}
  render() {
    const { selectedRowKeys,loading,list} = this.state;
    const rowSelection={
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                已选择 
                <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                {selectedRowKeys.length > 0 && (
                <Fragment>
                  <a onClick={this.moveToPublished} style={{ marginLeft: 24,color:'#d4237a' }}>
                    批量发布
                  </a>
                  <a onClick={this.moveToDraft} style={{ marginLeft: 24,color:'#1296db' }}>
                    移至草稿
                  </a>
                  <a onClick={this.moveToRecycle} style={{ marginLeft: 24 ,color:'#d81e06'}}>
                    移至回收站
                  </a>
                  <a onClick={this.delArticleModal} style={{ marginLeft: 24 ,color:'#8a8a8a'}}>
                    彻底删除
                  </a>
                </Fragment>
                )}
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        <Table 
          className={styles.tableBox}
          columns={this.columns}
          rowKey={"id"}
          loading={loading}
          dataSource={list}
          rowSelection={rowSelection}
        />
      </div>
    );
  }
}

export default StandardTable;
