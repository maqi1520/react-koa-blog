import CodeMirror from 'codemirror'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/xml/xml'
import React, { Component, CSSProperties } from 'react'
import { putObject } from '../oss-gallery/oss'

type FN = (text?: string) => string
type StrOrFn = string | FN
export interface OnRef {
  insertText: (fn: StrOrFn) => void
  editor: CodeMirror.Editor
}

interface Props {
  ref?: any
  style?: CSSProperties
  readOnly?: boolean
  defaultValue?: string
  className?: string
  onRef: (v: OnRef) => void
  onChange?: (value: string) => void
  onScroll?: (value: CodeMirror.ScrollInfo) => void
  forceTextArea?: boolean
  value?: string
  prefixDir?: string
}
interface State {
  isControlled: boolean
}

const IS_MOBILE =
  typeof navigator === 'undefined' ||
  navigator.userAgent.match(/Android/i) ||
  navigator.userAgent.match(/webOS/i) ||
  navigator.userAgent.match(/iPhone/i) ||
  navigator.userAgent.match(/iPad/i) ||
  navigator.userAgent.match(/iPod/i) ||
  navigator.userAgent.match(/BlackBerry/i) ||
  navigator.userAgent.match(/Windows Phone/i)

export default class CodeMirrorEditor extends Component<Props, State> {
  editor: CodeMirror.EditorFromTextArea | undefined
  editorRef: React.RefObject<HTMLTextAreaElement>
  constructor(props: Props) {
    super(props)
    this.state = { isControlled: Boolean(this.props.value) }
    this.editorRef = React.createRef<HTMLTextAreaElement>()
  }

  componentDidMount() {
    const { prefixDir = '' } = this.props
    const isTextArea = this.props.forceTextArea || IS_MOBILE
    if (!isTextArea && this.editorRef.current) {
      this.editor = CodeMirror.fromTextArea(this.editorRef.current, {
        mode: 'markdown',
        addModeClass: true,
        autofocus: true,
        lineNumbers: false,
        lineWrapping: true,
      })
      this.editor.on('change', this.handleChange)
      if (this.props.onScroll) {
        this.editor.on('scroll', (instance: CodeMirror.Editor) => {
          this.props.onScroll && this.props.onScroll(instance.getScrollInfo())
        })
      }
      this.editor.on('paste', (instance: CodeMirror.Editor, e) => {
        const file = e.clipboardData?.items[0].getAsFile()
        if (file) {
          const d = new Date()
          const p =
            prefixDir +
            d.getFullYear() +
            '/' +
            (d.getMonth() + 1) +
            '/' +
            d.getDay() +
            '/' +
            d.getTime() +
            '_'

          putObject(p + file.name, file).then((res) => {
            this.insertText(`![${file.name}](${res.url})`)
          })
        }
      })
      this.props.onRef({
        editor: this.editor,
        insertText: this.insertText,
      })
    }
  }

  insertText = (fn: StrOrFn) => {
    if (!this.editor) {
      return
    }
    const editor = this.editor
    const sel = this.editor.getSelection()
    if (sel) {
      const text = typeof fn == 'function' ? fn(sel) : fn
      editor.replaceSelection(text)
    } else {
      const text = typeof fn == 'function' ? fn() : fn
      const form = this.editor.getCursor()
      editor.replaceRange(text, form)
    }
    setTimeout(() => {
      editor.focus()
    }, 100)
  }

  componentDidUpdate() {
    if (!this.editor) {
      return
    }

    if (this.props.value && this.editor.getValue() !== this.props.value) {
      this.editor.setValue(this.props.value)
    }
  }

  handleChange = () => {
    if (!this.editor) {
      return
    }
    const value = this.editor.getValue()
    if (value === this.props.value) {
      return
    }
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }
  onChange = () => {
    //this.props.onChange(e.target.value)
  }

  render() {
    const { className, style, value, defaultValue, readOnly } = this.props

    return (
      <div style={style} className={className}>
        <textarea
          style={{ height: '100%' }}
          value={value}
          readOnly={readOnly}
          defaultValue={defaultValue}
          onChange={this.onChange}
          ref={this.editorRef}
        ></textarea>
      </div>
    )
  }
}
