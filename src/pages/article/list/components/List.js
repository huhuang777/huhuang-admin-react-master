import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon, Button, Alert } from 'antd'
import { Ellipsis, IconFont } from 'components'
import { PublicState, PublishState } from 'utils/constant'
import Link from 'umi/link'
import styles from './List.less'
import moment from 'moment'

const { confirm } = Modal

class List extends PureComponent {
  // 快速发布（移至已发布）
  moveToPublished = articleIds => {
    const { patchArticles, selectedRowKeys } = this.props
    const articles = articleIds || selectedRowKeys
    const action = PublishState.published
    patchArticles({ articles, action })
  }
  // 恢复文章（移至草稿）
  moveToDraft = articleIds => {
    const { patchArticles, selectedRowKeys } = this.props
    const articles = articleIds || selectedRowKeys
    const action = PublishState.draft
    patchArticles({ articles, action })
  }
  //移至回收站
  moveToRecycle = articleIds => {
    const { patchArticles, selectedRowKeys } = this.props
    const articles = articleIds || selectedRowKeys
    const action = PublishState.recycle
    patchArticles({ articles, action })
  }
  // 彻底删除文章（批量删除）
  delArticleModal = articleIds => {
    const { onDeleteItem, selectedRowKeys } = this.props
    const articles = articleIds || selectedRowKeys
    confirm({
      title: `确定彻底删除这些文章吗?`,
      onOk: () => {
        onDeleteItem(articles)
      },
    })
  }
  render() {
    const { onDeleteItem, selectedRowKeys, ...tableProps } = this.props
    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        fixed: 'left',
      },
      {
        title: '文章',
        dataIndex: 'content',
        key: 'content',
        width: 300,
        render: (text, article) => (
          <div className={styles['content-box']}>
            <div
              className={styles['content-bg']}
              style={{
                backgroundImage: 'url(' + (article.thumb || '') + ')',
              }}
            />
            <h4 className={styles.title}>
              <a href={'//huhuang.net/article/' + article.id} target={'_blank'}>
                <strong>{article.title}</strong>
              </a>
              <span>&nbsp;&nbsp;</span>
              {article.state === PublishState.published ? (
                <IconFont type="icon-doneall" style={{ color: '#1DA57A' }} />
              ) : article.state === PublishState.draft ? (
                <Icon type="edit" style={{ color: '#f4ea2a' }} />
              ) : article.state === PublishState.recycle ? (
                <Icon type="delete" style={{ color: '#d81e06' }} />
              ) : (
                ''
              )}
              <span>&nbsp;</span>
              {article.public !== PublicState.public ? (
                <Icon type="lock" style={{ color: '#d81e06' }} />
              ) : (
                ''
              )}
            </h4>
            <small className={styles.description}>
              {article.description ? (
                <Ellipsis length={128}>{article.description}</Ellipsis>
              ) : !article.description && article.content ? (
                <Ellipsis length={128}>{article.content}</Ellipsis>
              ) : (
                <span className={styles['text-muted']}>暂无内容</span>
              )}
            </small>
          </div>
        ),
      },
      {
        title: '分类目录',
        dataIndex: 'category',
        key: 'category',
        render: (text, article) => {
          if (!article.category.length) {
            return (
              <li className={styles['text-muted']}>
                <Icon type="folder" style={{ color: '#8a8a8a' }} />
                <span>&nbsp;</span>
                <span>暂无分类</span>
              </li>
            )
          }
          return article.category.map((category, index) => (
            <li key={index}>
              <Icon type="folder" />
              <span>&nbsp;</span>
              <span>{category.name}</span>
            </li>
          ))
        },
      },
      {
        title: '标签',
        key: 'tag',
        render: (text, article) => {
          if (!article.tag.length) {
            return (
              <li className={styles['text-muted']}>
                <Icon type="tags" style={{ color: '#8a8a8a' }} />
                <span>&nbsp;</span>
                <span>暂无标签</span>
              </li>
            )
          }
          return article.tag.map((tag, index) => (
            <li key={index}>
              <Icon type="tags" />
              <span>&nbsp;</span>
              <span>{tag.name}</span>
            </li>
          ))
        },
      },
      {
        title: '评论',
        key: 'comments',
        render: (text, article) =>
          article.meta.comments ? (
            <Link to={'/comment/post/' + article.id}>
              {article.meta.comments}条评论
            </Link>
          ) : (
            <span className={styles['text-muted']}>暂无评论</span>
          ),
      },
      {
        title: '喜欢',
        key: 'likes',
        render: (text, article) =>
          article.meta.likes ? (
            <span>{article.meta.likes}人喜欢</span>
          ) : (
            <span className={styles['text-muted']}>无人问津</span>
          ),
      },
      {
        title: '日期',
        key: 'create_at',
        dataIndex: 'create_at',
        render: (text, article) =>
          moment(article.create_at).format('YYYY-MM-DD HH:MM'),
      },
      {
        title: '公开',
        key: 'public',
        dataIndex: 'public',
        render: text => {
          const array = ['私密', '密码', '公开']
          return <span>{array[text + 1]}</span>
        },
      },
      {
        title: '状态',
        key: 'state',
        dataIndex: 'state',
        render: text => {
          const array = ['回收站', '草稿', '已发布']
          return <span>{array[text + 1]}</span>
        },
      },
      {
        title: '操作',
        width: 90,
        key: 'operation',
        fixed: 'right',
        render: (text, article) => (
          <div className={styles.actionList}>
            <Link to={'/article/edit/' + article._id}>
              <Button block type="primary" icon="edit">
                编辑文章
              </Button>
            </Link>
            {article.state === PublishState.draft ? (
              <Button
                block
                onClick={() => this.moveToPublished([article._id])}
                style={{ backgroundColor: '#e79f3d', borderColor: '#e79f3d' }}
              >
                <IconFont type="icon-doneall" />
                快速发布
              </Button>
            ) : article.state === PublishState.recycle ? (
              <Button
                block
                icon="check-circle"
                onClick={() => this.moveToDraft([article._id])}
                style={{ backgroundColor: '#e79f3d', borderColor: '#e79f3d' }}
              >
                恢复文章
              </Button>
            ) : article.state === PublishState.published ? (
              <Button
                type="primary"
                block
                icon="check-circle"
                onClick={() => this.moveToDraft([article._id])}
                style={{ backgroundColor: '#e79f3d', borderColor: '#e79f3d' }}
              >
                移到草稿
              </Button>
            ) : (
              ''
            )}
            {article.state === PublishState.recycle ? (
              <Button
                type="danger"
                block
                icon="delete"
                onClick={() => this.delArticleModal([article._id])}
              >
                彻底删除
              </Button>
            ) : (
              <Button
                type="danger"
                block
                icon="delete"
                onClick={() => this.moveToRecycle([article._id])}
              >
                移回收站
              </Button>
            )}
            <Button
              type="primary"
              block
              icon="link"
              target="_blank"
              href={'//huhuang.net/article/' + article.id}
            >
              查看文章
            </Button>
          </div>
        ),
      },
    ]

    return (
      <Fragment>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                已选择
                <span style={{ fontWeight: 600 }}>
                  {selectedRowKeys.length}
                </span>{' '}
                项&nbsp;&nbsp;
                {selectedRowKeys.length > 0 && (
                  <Fragment>
                    <span
                      onClick={this.moveToPublished}
                      style={{ marginLeft: 24, color: '#d4237a' }}
                    >
                      批量发布
                    </span>
                    <span
                      onClick={this.moveToDraft}
                      style={{ marginLeft: 24, color: '#1296db' }}
                    >
                      移至草稿
                    </span>
                    <span
                      onClick={this.moveToRecycle}
                      style={{ marginLeft: 24, color: '#d81e06' }}
                    >
                      移至回收站
                    </span>
                    <span
                      onClick={this.delArticleModal}
                      style={{ marginLeft: 24, color: '#8a8a8a' }}
                    >
                      彻底删除
                    </span>
                  </Fragment>
                )}
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showTotal: total => `Total ${total} Items`,
          }}
          className={styles.table}
          scroll={{ x: 1200 }}
          columns={columns}
          simple
          rowKey={record => record._id}
        />
      </Fragment>
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
