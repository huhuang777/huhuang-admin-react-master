import React, { Component } from 'react'
import classNames from 'classnames'
import styles from './index.less'
import { KEYCODE } from 'utils/constant'
import { isPostArticlePage, isAnnouncementPage } from 'utils/check'
import marked from 'marked'

require('codemirror/mode/meta.js')
require('codemirror/mode/go/go.js')
require('codemirror/mode/gfm/gfm.js')
require('codemirror/mode/vue/vue.js')
require('codemirror/mode/css/css.js')
require('codemirror/mode/lua/lua.js')
require('codemirror/mode/php/php.js')
require('codemirror/mode/xml/xml.js')
require('codemirror/mode/jsx/jsx.js')
require('codemirror/mode/sql/sql.js')
require('codemirror/mode/pug/pug.js')
require('codemirror/mode/lua/lua.js')
require('codemirror/mode/sass/sass.js')
require('codemirror/mode/http/http.js')
require('codemirror/mode/perl/perl.js')
require('codemirror/mode/ruby/ruby.js')
require('codemirror/mode/nginx/nginx.js')
require('codemirror/mode/shell/shell.js')
require('codemirror/mode/clike/clike.js')
require('codemirror/mode/stylus/stylus.js')
require('codemirror/mode/python/python.js')
require('codemirror/mode/haskell/haskell.js')
require('codemirror/mode/markdown/markdown.js')
require('codemirror/mode/htmlmixed/htmlmixed.js')
require('codemirror/mode/javascript/javascript.js')

require('codemirror/addon/mode/overlay.js')
require('codemirror/addon/edit/closetag.js')
require('codemirror/addon/edit/continuelist.js')
require('codemirror/addon/edit/closebrackets.js')
require('codemirror/addon/scroll/annotatescrollbar.js')
require('codemirror/addon/selection/active-line.js')
require('codemirror/addon/selection/mark-selection.js')
// require('codemirror/addon/search/searchcursor.js');
// require('codemirror/addon/search/matchesonscrollbar.js')；
// require('codemirror/addon/search/searchcursor.js');
// require('codemirror/addon/search/match-highlighter.js');
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/comment-fold.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/markdown-fold.js')

require('highlight.js/styles/ocean.css')
require('codemirror/lib/codemirror.css')
require('codemirror/theme/base16-dark.css')
require('codemirror/addon/fold/foldgutter.css')

const hljs = require('highlight.js')
const CodeMirror = require('codemirror')
const { store } = require('./libs/store.js')

const EDIT_CONFIG = {
  draftTimer: 1600,
  autoTimer: 1000,
}
const TPreviewMode = {
  none: 0,
  half: 1,
  full: 2,
}

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight(code, lang, callback) {
    return hljs.highlightAuto(code).value
  },
})

export default class MarkdownEditor extends Component {
  state = {
    editor: null,
    content: '',
    markedHtml: '',
    editorElem: null,
    previewMode: TPreviewMode.none,
    fullscreen: false,
    timer: null,
    showBakModal: false,
    elementRef: null,
  }
  // 视图加载完成后执行初始化
  componentDidMount() {
    this.setState({
      editorElem: document.getElementById('editor1'),
    })
    let { content, editor, previewMode, showBakModal, timer } = this.state
    const { submitContent, config } = this.props
    if (editor) {
      return false
    }
    editor = CodeMirror.fromTextArea(
      document.getElementById('editor1'),
      Object.assign(
        {
          // 语言模式 github markdown扩展
          mode: 'gfm',
          // 行号
          lineNumbers: true,
          // 自动验证错误
          matchBrackets: true,
          // 是否换行
          lineWrapping: false,
          // 点击高亮正行
          styleActiveLine: true,
          // 配色
          theme: 'base16-dark',
          // 自动补全括号
          autoCloseBrackets: true,
          // 自动闭合标签
          autoCloseTags: true,
          // 自动高亮所有选中单词
          // styleSelectedText: true,
          // highlightSelectionMatches: { showToken: /w/, annotateScrollbar: true },
          // 展开折叠
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          // 回车键自动补全上一步格式
          extraKeys: {
            Enter: 'newlineAndIndentContinueMarkdownList',
          },
        },
        config
      )
    )
    this.setState({ editor })
    editor.on('blur', cm => {
      this.onModelTouched()
    })
    editor.on('change', cm => {
      const content1 = cm.getValue()
      if (content1 !== content) {
        this.setState({
          content: content1,
        })
        submitContent({
          editor: editor,
          content: content1,
        })
        this.onModelChange(content1)
        // if (previewMode !== TPreviewMode.none) {
        this.parseMarked()
        // console.log('应该是发现了本地数据的变化');
        // }
      }
      // 自动保存草稿
      if (timer) {
        clearTimeout(timer)
      }
      if (content1 === store.get(window.location.pathname)) {
        this.setState({
          timer: setTimeout(() => {
            store.set(window.location.pathname, content1)
          }, EDIT_CONFIG.draftTimer),
        })
      }
    })

    // 如果是发布页面，有本地存储，则直接读取存储
    const url = window.location.pathname
    if (isPostArticlePage(url) || isAnnouncementPage(url)) {
      const bak = store.get(window.location.pathname)
      if (bak) {
        this.setState({
          content: bak,
          editor: editor,
        })
        editor.setValue(content)
        // this.markedHtml = marked(this.content);
      }
    } else {
      // 如果是编辑页面，没有弹窗，则设置
      setTimeout(() => {
        if (!showBakModal) {
          editor.setValue(this.props.content)
          this.setState({
            markedHtml: marked(this.props.content),
            editor: editor,
          })
        }
      }, EDIT_CONFIG.autoTimer)
    }

    /*
    const dropZone = this.elementRef.nativeElement.children[0].children[1];
    dropZone.addEventListener('drop', event => {
      event.preventDefault();
      event.stopPropagation();
      let reader = new FileReader();
      reader.onload = e => {
        console.log(e);
        // this.editor.setValue(e.target.result);
      };
      reader.readAsText(event.dataTransfer.files[0]);
    }, false);
    */
  }

  // 使用本地草稿
  useArticleBak() {
    let { content, editor, markedHtml, showBakModal } = this.state
    content = store.get(window.location.pathname)
    editor = content
    markedHtml = marked(content)
    showBakModal = false
    this.setState({
      content,
      editor,
      markedHtml,
      showBakModal,
    })
  }

  // 关闭草稿弹窗
  cancelBakModal() {
    let { content, editor, markedHtml, showBakModal } = this.state
    editor = content
    markedHtml = marked(content)
    showBakModal = false
    this.setState({
      content,
      editor,
      markedHtml,
      showBakModal,
    })
  }
  onModelTouched() {}
  onModelChange() {}

  // 解析markeddown
  parseMarked() {
    this.setState({
      markedHtml: marked(this.state.content),
    })
  }

  // 写数据
  writeValue(currentValue) {
    const bak = store.get(window.location.pathname)
    const { content } = this.state
    if (typeof currentValue !== undefined && currentValue !== content) {
      // 如果是公告页就啥也不干
      if (isAnnouncementPage(window.location.pathname)) {
        this.setState({
          content: currentValue,
          editor: currentValue,
        })
        return false
      }
      if (bak && currentValue !== bak) {
        this.setState({
          showBakModal: true,
        })
      }
      this.setState({
        content: currentValue,
      })
    } else if (bak) {
      this.setState({
        content: bak,
      })
    }
  }

  // 保存文件
  saveFile(code, name) {
    const blob = new Blob([code], { type: 'text/plain' })
    if (window.saveAs) {
      window.saveAs(blob, name)
    } else if (navigator.saveBlob) {
      navigator.saveBlob(blob, name)
    } else {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', name)
      const event = document.createEvent('MouseEvents')
      event.initMouseEvent(
        'click',
        true,
        true,
        window,
        1,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      link.dispatchEvent(event)
    }
  }

  // 保存为markdown
  saveAsMarkdown() {
    this.saveFile(this.state.content, 'untitled.md')
  }

  // 按键listen
  keyDownListen = event => {
    // 退出全屏
    if (event.keyCode === KEYCODE.ESC) {
      this.setState({
        fullscreen: false,
      })
    }

    // 全屏
    if (event.keyCode === KEYCODE.F5) {
      this.setState({
        fullscreen: this.state.fullscreen,
      })
    }
    // 保存
    if (
      event.keyCode === KEYCODE.S &&
      (event.ctrlKey || event.metaKey || event.shiftKey)
    ) {
      this.saveAsMarkdown()
      event.preventDefault()
      return false
    }
  }

  // 插入内容
  updateCodeMirror(data) {
    const { editor: codemirror } = this.state
    codemirror.replaceSelection(data)
    const startPoint = codemirror.getCursor('start')
    const endPoint = codemirror.getCursor('end')
    codemirror.setSelection(startPoint, endPoint)
    codemirror.focus()
    /*
    let doc = codemirror.getDoc();
    let cursor = doc.getCursor(); // gets the line number in the cursor position
    let line = doc.getLine(cursor.line); // get the line contents
    let pos = { // create a new object to avoid mutation of the original selection
      line: cursor.line,
      ch: line.length - 1 // set the character position to the end of the line
    }
    doc.replaceRange('\n' + data + '\n', pos); // adds a new line
    */
  }

  // 替换光标选中项内容
  replaceSelection(cm, active, start, end) {
    let text
    const startPoint = cm.getCursor('start')
    const endPoint = cm.getCursor('end')
    if (active) {
      text = cm.getLine(startPoint.line)
      start = text.slice(0, startPoint.ch)
      end = text.slice(startPoint.ch)
      cm.setLine(startPoint.line, start + end)
    } else {
      text = cm.getSelection()
      cm.replaceSelection(start + text + end)
      startPoint.ch += start.length
      endPoint.ch += start.length
    }
    cm.setSelection(startPoint, endPoint)
    cm.focus()
  }

  // 分析编辑器当前的光标位置
  getState(cm, pos) {
    pos = pos || cm.getCursor('start')
    const stat = cm.getTokenAt(pos)
    if (!stat.type || !stat.type.split) {
      return {}
    }
    const types = stat.type.split(' ')
    const ret = {}
    let data, text
    for (let i = 0; i < types.length; i++) {
      data = types[i]
      if (data === 'strong') {
        ret.bold = true
      } else if (data === 'letiable-2') {
        text = cm.getLine(pos.line)
        if (/^\s*\d+\.\s/.test(text)) {
          ret['ordered-list'] = true
        } else {
          ret['unordered-list'] = true
        }
      } else if (data === 'atom') {
        ret.quote = true
      } else if (data === 'em') {
        ret.italic = true
      }
    }
    return ret
  }

  // 粗体
  toggleBold() {
    const { editor: codemirror } = this.state
    const stat = this.getState(codemirror, codemirror.getCursor())
    let text
    const start = '**'
    const end = '**'
    const startPoint = codemirror.getCursor('start')
    const endPoint = codemirror.getCursor('end')
    if (stat.bold) {
      /*
      text = codemirror.getLine(startPoint.line);
      start = text.slice(0, startPoint.ch);
      end = text.slice(startPoint.ch);

      start = start.replace(/^(.*)?(\*|\_){2}(\S+.*)?$/, '$1$3');
      end = end.replace(/^(.*\S+)?(\*|\_){2}(\s+.*)?$/, '$1$3');
      startPoint.ch -= 2;
      endPoint.ch -= 2;
      // console.log('text', text, 'start', start, 'end', end, startPoint, endPoint);
      // codemirror.setLine(startPoint.line, start + end);
      // codemirror.replaceRange(end, endPoint);
      */
    } else {
      text = codemirror.getSelection()
      codemirror.replaceSelection(start + text + end)

      startPoint.ch += 2
      endPoint.ch += 2
    }
    codemirror.setSelection(startPoint, endPoint)
    codemirror.focus()
  }

  // 斜体
  toggleItalic() {
    const { editor: codemirror } = this.state
    const stat = this.getState(codemirror, codemirror.getCursor())
    let text
    const start = '*'
    const end = '*'

    const startPoint = codemirror.getCursor('start')
    const endPoint = codemirror.getCursor('end')
    if (stat.italic) {
      /*
      text = codemirror.getLine(startPoint.line);
      start = text.slice(0, startPoint.ch);
      end = text.slice(startPoint.ch);

      start = start.replace(/^(.*)?(\*|\_)(\S+.*)?$/, '$1$3');
      end = end.replace(/^(.*\S+)?(\*|\_)(\s+.*)?$/, '$1$3');
      startPoint.ch -= 1;
      endPoint.ch -= 1;
      // codemirror.setLine(startPoint.line, start + end);
      */
    } else {
      text = codemirror.getSelection()
      codemirror.replaceSelection(start + text + end)

      startPoint.ch += 1
      endPoint.ch += 1
    }
    codemirror.setSelection(startPoint, endPoint)
    codemirror.focus()
  }

  // 插入链接
  drawLink() {
    const { editor: codemirror } = this.state
    const position = codemirror.getCursor()
    const stat = this.getState(codemirror, position)
    this.replaceSelection(codemirror, stat.link, '[', '](https://)')
  }

  // 插入图片
  drawImage() {
    const { editor: codemirror } = this.state
    const position = codemirror.getCursor()
    const stat = this.getState(codemirror, position)
    this.replaceSelection(codemirror, stat.image, '![](', ')')
  }

  // 插入引用
  drawQuote() {
    const { editor: codemirror } = this.state
    const position = codemirror.getCursor()
    const stat = this.getState(codemirror, position)
    this.replaceSelection(codemirror, stat.quote, '> ', '\n')
  }

  // 插入代码
  drawCode() {
    const { editor: codemirror } = this.state
    const position = codemirror.getCursor()
    const stat = this.getState(codemirror, position)
    this.replaceSelection(codemirror, stat.code, '```\n', '\n```')
  }

  // 插入h3标题
  drawH3Title(data) {
    const { editor: codemirror } = this.state
    const position = codemirror.getCursor()
    const stat = this.getState(codemirror, position)
    this.replaceSelection(codemirror, stat.h3, '### ', '\n')
    // this.updateCodeMirror(data);
  }

  // 撤销
  undo() {
    const { editor: codemirror } = this.state
    codemirror.undo()
    codemirror.focus()
  }

  // 回退
  redo() {
    const { editor: codemirror } = this.state
    codemirror.redo()
    codemirror.focus()
  }

  // 注册事件
  registerOnChange(fn) {
    this.onModelChange = fn
  }
  showFull() {
    this.setState({
      fullscreen: !this.state.fullscreen,
    })
    console.log(this.state)
  }
  setPreviewMode(n) {
    this.setState({
      previewMode: n,
    })
  }
  // 注册事件
  registerOnTouched(fn) {
    this.onModelTouched = fn
  }
  render() {
    let { fullscreen, previewMode, markedHtml } = this.state
    let contentClass = classNames(styles['editor-content'], {
      [styles['preview-full']]: previewMode === 2,
      [styles['preview-both']]: previewMode === 1,
    })
    const bodyClass = classNames(styles['markdown-editor'], {
      [styles.fullscreen]: fullscreen,
    })
    return (
      <div className={bodyClass}>
        <div className={styles['editor-toolbar']}>
          <ul className={styles['menus']}>
            <li className={styles['bold']} onClick={() => this.toggleBold()}>
              粗体
            </li>
            <li
              className={styles['italic']}
              onClick={() => this.toggleItalic()}
            >
              斜体
            </li>
            <li className={styles['quote']} onClick={() => this.drawQuote()}>
              引用
            </li>
            <li className={styles['code']} onClick={() => this.drawCode()}>
              代码
            </li>
            <li className={styles['link']} onClick={() => this.drawLink()}>
              链接
            </li>
            <li className={styles['image']} onClick={() => this.drawImage()}>
              图片
            </li>
            <li
              className={styles['-h3']}
              onClick={() => this.drawH3Title('\n' + '### ')}
            >
              H3
            </li>
            <li
              className={styles['save']}
              onClick={() => this.saveAsMarkdown()}
            >
              保存
            </li>
          </ul>
          <ul className={styles['right']}>
            <li
              className={styles['preview-full']}
              onClick={() => {
                this.setPreviewMode(2)
                this.parseMarked()
              }}
            >
              Full
            </li>
            <li
              className={styles['preview-both']}
              onClick={() => {
                this.setPreviewMode(1)
                this.parseMarked()
              }}
            >
              Both
            </li>
            <li
              className={styles['preview-none']}
              onClick={() => {
                this.setPreviewMode(0)
              }}
            >
              None
            </li>
            <li
              className={styles['fullscreen']}
              onClick={() => this.showFull()}
            >
              {fullscreen ? <span>exit</span> : ''}
              <span>Fullscreen</span>
            </li>
          </ul>
        </div>
        <div className={contentClass}>
          <div className={styles.editor} onKeyUp={this.keyDownListen}>
            <textarea id="editor1" />
          </div>
          <div
            className={styles.marked}
            dangerouslySetInnerHTML={{ __html: markedHtml }}
          />
        </div>
      </div>
    )
  }
}
