import React, { Component } from 'react'
import { Icon, message, Modal } from 'antd'
import styles from './index.less'
import * as qiniu from 'qiniu-js'
import classNames from 'classnames'
import { staticUrl } from 'config'
import api from 'api'

class ImgUpload extends Component {
  state = {
    tokenOk: false,
    upToken: '',
    uploadSizeLimit: 4500000,
    defaultPicture: '',
  }
  componentDidMount() {
    this.init()
  }
  init() {
    this.getUpToken()
  }
  getUpToken() {
    api
      .getQiniuConfig()
      .then(res => {
        if (res && res.result && res.result.upToken) {
          this.setState({
            tokenOk: true,
            upToken: res.result.upToken,
          })
        }
      })
      .catch(_ => {
        this.setState({
          tokenOk: false,
        })
      })
  }
  onFile = e => {
    // 如果选择文件时 Token 是不可用的，再再试一次
    const file = e.target.files[0]
    if (!this.state.tokenOk) {
      this.getUpToken()
      return false
    }
    // 当前文件
    if (!file) {
      return false
    }
    // 大于限定尺寸，不上传
    if (file.size > this.state.uploadSizeLimit) {
      Modal.error({
        title: '上传失败',
        content: '文件不合法！',
        onOk() {},
      })
      return false
    }
    // // 如果图片小于1K，则输出base64，否则上传
    // if (file.size <= 1000) {
    //   const reader = new FileReader();
    //   reader.onload = event => {
    //     const imgBase64 = event.target.result;
    //     this.emitPicture(imgBase64);
    //   };
    //   reader.readAsDataURL(file);
    //   return false;
    // }

    // 判断完成调用 SDK 上传
    this.qiniuUploadPicture(file)
  }
  // 点击自定义上传空间元素的时候调用 input 的 click 方法
  bringFileSelector = () => {
    if (this.state.uploadInProgress) {
      return false
    }
    document.getElementById('uploadFile').click()
    return false
  }
  // 删除图片方法
  removePicture = () => {
    const { emitPicture } = this.props
    emitPicture('')
    return false
  }

  qiniuUploadPicture = file => {
    console.log('file', file)
    const { emitPicture } = this.props
    const doUpload = upFile => {
      message.info('开始上传')
      console.log(upFile)
      const keyName = `blog/image/${upFile.name.replace(/ /gi, '')}`
      const putExtra = {
        params: {},
        fname: upFile.name,
        mimeType: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
      }
      const upOptions = {
        useCdnDomain: true,
      }
      // 开始上传
      const observable = qiniu.upload(
        upFile,
        keyName,
        this.state.upToken,
        putExtra,
        upOptions
      )
      //监听上传流
      const subscription = observable.subscribe({
        next: res => {
          this.setState({
            uploadInProgress: true,
          })
          if (res.total && res.total.percent) {
            this.setState({
              _uploadProgress: (res.total.percent || '').toString().slice(0, 5),
            })
          }
        },
        error: err => {
          console.warn('上传失败', err)
          this.setState({
            uploadInProgress: false,
          })
          Modal.error({
            title: '上传失败',
            content: err.message,
            onOk() {},
          })
        },
        complete: res => {
          console.warn('上传完成', res)
          const picture_url = `${staticUrl}/${res.key}`
          this.setState({
            uploadInProgress: false,
          })
          // 根据 url 读取一张图片
          Modal.success({
            title: '上传成功',
            content: '图片上传成功',
          })
          const image = new Image()
          image.onload = _ => {
            emitPicture(picture_url)
          }
          image.onerror = _ => {
            Modal.success({
              title: '预览失败',
              content: '七牛问题！',
            })
            emitPicture(picture_url)
          }
          image.src = picture_url
        },
      })
    }

    // 压缩
    qiniu
      .compressImage(file, {
        quality: 0.92,
        noCompressIfLarger: true,
      })
      .then(data => doUpload(data.dist))
      .catch(err => doUpload(file))
  }
  render() {
    const { defaultPicture, uploadInProgress, _uploadProgress } = this.state
    const groupClass = classNames(styles['picture-group'], {
      [styles.uploading]: uploadInProgress,
    })
    const { picture } = this.props
    return (
      <div className={styles['picture-uploader']}>
        <div className={groupClass}>
          <div
            className={styles['picture-wrapper']}
            id="pictureWrapper"
            onClick={this.bringFileSelector}
          >
            {picture ? (
              <img src={picture} alt="" />
            ) : (
              <img src={defaultPicture} alt="" />
            )}
            {uploadInProgress ? (
              <div className={styles.loading}>
                <div className={styles.spinner}>
                  <div className={styles['double-bounce1']} />
                  <div className={styles['double-bounce2']} />
                </div>
                <p className={styles['load-progress']}>{_uploadProgress}%</p>
              </div>
            ) : (
              ''
            )}
          </div>
          {picture ? (
            <Icon
              type="close-circle"
              className={styles['ion-md-close-circle-outline']}
              onClick={this.removePicture}
            />
          ) : (
            ''
          )}
          <span
            className={styles['change-picture']}
            onClick={this.bringFileSelector}
          >
            点击上传图片
          </span>
          <input
            type="file"
            hidden={true}
            id="uploadFile"
            onChange={this.onFile}
          />
          <button id="uploadFileBtn" style={{ display: 'none' }} />
        </div>
      </div>
    )
  }
}

export default ImgUpload
