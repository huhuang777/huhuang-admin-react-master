import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Alert } from 'antd'
import { IconFont, Ellipsis } from 'components'
import { CommentState } from 'utils/constant'
import { isGuestbook, getGuestbookPath, getArticlePath } from 'utils/check'
import Link from 'umi/link'
import styles from './List.less'
import moment from 'moment'
import { osParser, browserParser } from 'utils'
import { uniq } from 'lodash'

const { confirm } = Modal

class List extends PureComponent {
  columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 40,
      fixed: 'left',
    },
    {
      title: 'PID',
      dataIndex: 'pid',
      key: 'pid',
    },
    {
      title: 'POST_ID',
      dataIndex: 'post_id',
      key: 'post_id',
    },
    {
      title: '评论内容',
      key: 'content',
      align: 'left',
      width: '23%',
      render: (text, comment) => {
        if (!comment.content) {
          return <span className={styles['text-muted']}>暂无内容</span>
        }
        return <Ellipsis length={160}>{comment.content}</Ellipsis>
      },
    },
    {
      title: '个人信息',
      key: 'author',
      align: 'left',
      render: (text, comment) => {
        return (
          <span className={styles['comment-user']}>
            <div className={styles.name}>
              <strong>名字：</strong>
              {comment.author.name}
            </div>
            <div className={styles.email}>
              <strong>邮箱：</strong>
              <a href={'mailto:' + comment.author.email} target={'_blank'}>
                {comment.author.email}
              </a>
            </div>
            <div className={styles.site}>
              <strong>网址：</strong>
              <a href={comment.author.site} target={'_blank'}>
                {comment.author.site || '无'}
              </a>
            </div>
          </span>
        )
      },
    },
    {
      title: '终端',
      key: 'agent',
      align: 'left',
      render: (text, comment) => {
        return (
          <span className={styles['comment-tag']}>
            <div>
              <strong>IP：</strong>
              <span>{comment.ip || '未知'}</span>
            </div>
            <div>
              <strong>地理位置：</strong>
              <span>
                {comment.ip_location
                  ? comment.ip_location.country +
                    ' - ' +
                    comment.ip_location.city
                  : '未知'}
              </span>
            </div>
            <div>
              <strong>浏览器：</strong>
              <span
                dangerouslySetInnerHTML={{
                  __html: browserParser(comment.agent),
                }}
              ></span>
            </div>
            <div>
              <strong>系统：</strong>
              <span
                dangerouslySetInnerHTML={{ __html: osParser(comment.agent) }}
              ></span>
            </div>
          </span>
        )
      },
    },
    {
      title: '点赞',
      key: 'likes',
      dataIndex: 'likes',
    },
    {
      title: '置顶',
      key: 'is_top',
      render: (text, comment) => (comment.is_top ? '是' : '否'),
    },
    {
      title: '日期',
      key: 'create_at',
      dataIndex: 'create_at',
      render: (text, comment) =>
        moment(comment.create_at).format('YYYY-MM-DD HH:MM'),
    },
    {
      title: '状态',
      key: 'state',
      dataIndex: 'state',
      render: text => {
        const array = ['垃圾评论', '已删除', '待审核', '已发布']
        return <span>{array[text + 2]}</span>
      },
    },
    {
      title: '操作',
      width: 90,
      key: 'operation',
      fixed: 'right',
      render: (text, comment) => (
        <div className={styles.actionList}>
          <Link to={'/comment/detail/' + comment._id}>
            <Button block type="primary" icon="edit">
              评论详情
            </Button>
          </Link>
          {comment.state === CommentState.auditing ? (
            <Button
              block
              onClick={() =>
                this.updateCommentsState(CommentState.published, comment)
              }
              style={{ backgroundColor: '#e79f3d', borderColor: '#e79f3d' }}
            >
              <IconFont type="icon-doneall" />
              审核通过
            </Button>
          ) : comment.state === CommentState.deleted ||
            comment.state === CommentState.spam ? (
            <Button
              block
              icon="check-circle"
              onClick={() =>
                this.updateCommentsState(CommentState.auditing, comment)
              }
              style={{ backgroundColor: '#e79f3d', borderColor: '#e79f3d' }}
            >
              恢复评论
            </Button>
          ) : comment.state === CommentState.published ? (
            <Button
              type="primary"
              block
              icon="check-circle"
              onClick={() =>
                this.updateCommentsState(CommentState.spam, comment)
              }
              style={{ backgroundColor: '#e79f3d', borderColor: '#e79f3d' }}
            >
              标为垃圾
            </Button>
          ) : (
            ''
          )}
          {comment.state !== CommentState.deleted ? (
            <Button
              type="danger"
              block
              icon="delete"
              onClick={() =>
                this.updateCommentsState(CommentState.deleted, comment)
              }
            >
              移回收站
            </Button>
          ) : (
            <Button
              type="danger"
              block
              icon="delete"
              onClick={() => this.delCommentModal([comment._id])}
            >
              彻底删除
            </Button>
          )}
          <Button
            type="primary"
            block
            icon="link"
            target="_blank"
            href={
              isGuestbook(comment.post_id)
                ? getGuestbookPath()
                : getArticlePath(comment.post_id)
            }
          >
            宿主页面
          </Button>
        </div>
      ),
    },
  ]

  delCommentModal = commentIds => {
    const { onDeleteItem, selectedRowKeys, dataSource } = this.props
    const delSingleComment = commentIds
    const todoDelComment = dataSource.find(c => delSingleComment === c._id)
    const comments = commentIds
      ? [commentIds]
      : uniq(selectedRowKeys.map(item => item.split(',')[0]))
    const post_ids = (delSingleComment && todoDelComment
      ? [todoDelComment.post_id]
      : uniq(selectedRowKeys.map(item => item.split(',')[1]))
    ).filter(id => id + '')
    confirm({
      title: `确定彻底删除这些文章吗?`,
      onOk: () => {
        onDeleteItem({ comments, post_ids })
      },
    })
  }
  updateCommentsState = (state, comment) => {
    const { updateCommentsState, selectedRowKeys } = this.props
    const comments = comment
      ? [comment._id]
      : selectedRowKeys.map(item => item.split(',')[0])
    const post_ids = (comment
      ? [comment.post_id]
      : uniq(selectedRowKeys.map(item => item.split(',')[1]))
    ).filter(id => id + '')
    updateCommentsState({ state, comments, post_ids })
  }
  render() {
    const { onDeleteItem, selectedRowKeys, ...tableProps } = this.props
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
                      onClick={() =>
                        this.updateCommentsState(CommentState.published)
                      }
                      style={{ marginLeft: 24, color: '#d4237a' }}
                    >
                      审核通过
                    </span>
                    <span
                      onClick={() =>
                        this.updateCommentsState(CommentState.auditing)
                      }
                      style={{ marginLeft: 24, color: '#1296db' }}
                    >
                      恢复评论
                    </span>
                    <span
                      onClick={() =>
                        this.updateCommentsState(CommentState.spam)
                      }
                      style={{ marginLeft: 24, color: '#e79f3d' }}
                    >
                      标为垃圾
                    </span>
                    <span
                      onClick={() =>
                        this.updateCommentsState(CommentState.deleted)
                      }
                      style={{ marginLeft: 24, color: '#d81e06' }}
                    >
                      移至回收站
                    </span>
                    <span
                      onClick={() => this.delCommentModal()}
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
          columns={this.columns}
          simple
          rowKey={record => record._id + ',' + record.post_id}
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
