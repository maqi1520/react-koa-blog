import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import { list, multipartUpload, deleteMulti } from './oss'
import { Button, Checkbox, Modal, Breadcrumb } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox/Checkbox'
import { UploadOutlined, FolderOutlined, HomeOutlined } from '@ant-design/icons'
import './index.less'

export interface OSSFile {
  name: string
  url: string
}
interface Props {
  onChange?: (value: OSSFile[]) => void
  children?: ReactElement
  prefixDir?: string
}

export default function OSSGallery({
  prefixDir = '',
  onChange,
  children,
}: Props): ReactElement {
  const [progress, setProgress] = useState(1)
  const [prefix, setPrefix] = useState<string | undefined>(prefixDir)
  const [visible, setVisible] = useState(false)
  const [checkedList, changeCheckedList] = useState<OSSFile[]>([])
  const [state, setstate] = useState({
    isTruncated: false,
    nextMarker: null,
    objects: [],
    prefixes: [],
  })

  const reload = useCallback(() => {
    changeCheckedList([])
    list(prefix)
      .then((res) => {
        setstate({
          isTruncated: res.isTruncated,
          nextMarker: res.nextMarker,
          objects: res.objects || [],
          prefixes: res.prefixes || [],
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }, [prefix])
  useEffect(() => {
    reload()
  }, [reload])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target
      const postFiles = Array.prototype.slice.call(files)
      const d = new Date()
      const p =
        prefixDir +
        d.getFullYear() +
        '/' +
        (d.getMonth() + 1) +
        '/' +
        d.getDay() +
        '/'

      postFiles.forEach((file) => {
        multipartUpload(p + file.name, file, (p) => {
          setProgress(p)
        })
          .then(() => {
            if (prefix === p) {
              reload()
            } else {
              setPrefix(p)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
    [reload, prefixDir, prefix]
  )
  const handleCheckChange = useCallback(
    (e: CheckboxChangeEvent, o) => {
      if (e.target.checked) {
        changeCheckedList([...checkedList, o])
      } else {
        changeCheckedList(checkedList.filter((c) => c.name !== e.target.value))
      }
    },
    [checkedList]
  )
  const handleDelete = useCallback(() => {
    changeCheckedList([])
    deleteMulti(checkedList.map((c) => c.name))
      .then(() => {
        reload()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [checkedList, reload])
  const handleOk = useCallback(() => {
    onChange && onChange(checkedList)
    changeCheckedList([])
    setVisible(false)
  }, [onChange, checkedList])
  const handleShow = useCallback(() => {
    setVisible(true)
    reload()
  }, [reload])
  //?x-oss-process=image/resize,m_mfit,w_200,h_200/quality,Q_90'
  const body = (
    <div className="oss-gallery">
      {prefix && prefixDir !== prefix ? (
        <Breadcrumb className="mb">
          <Breadcrumb.Item onClick={() => setPrefix(prefixDir)}>
            <HomeOutlined />
          </Breadcrumb.Item>
          {prefix.split('/').map((b, index) => {
            const current =
              prefix
                .split('/')
                .slice(0, index + 1)
                .join('/') + '/'
            if (current === prefixDir) {
              return null
            }
            return (
              <Breadcrumb.Item onClick={() => setPrefix(current)} key={b}>
                {b}
              </Breadcrumb.Item>
            )
          })}
        </Breadcrumb>
      ) : null}
      <div className="clearfix mb">
        <Button
          loading={progress < 1}
          icon={<UploadOutlined />}
          className="pull-left upload-button"
          type="ghost"
        >
          <input
            multiple
            accept="image/*"
            onChange={handleChange}
            className="upload-input"
            type="file"
          />
          选择文件
        </Button>
        <Button
          disabled={checkedList.length === 0}
          className="pull-right"
          type="ghost"
          danger
          onClick={handleDelete}
        >
          删除
        </Button>
      </div>

      <ul className="clearfix">
        {state.prefixes.map((p: string) => {
          const dirArr = p.split('/')
          return (
            <li key={p}>
              <div
                onClick={() => setPrefix(p)}
                aria-hidden="true"
                className="outter pointer"
              >
                <FolderOutlined style={{ fontSize: 30 }}></FolderOutlined>
              </div>
              <div className="center">{dirArr[dirArr.length - 2]}</div>
            </li>
          )
        })}
        {state.objects.map((o: any) => {
          if (o.size === 0) {
            return null
          }
          return (
            <li key={o.url}>
              <div className="outter">
                <img alt={o.name} src={o.url} />
              </div>
              <div className="center">
                <Checkbox
                  onChange={(e) => handleCheckChange(e, o)}
                  value={o.name}
                  checked={checkedList.indexOf(o) > -1}
                ></Checkbox>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
  if (children) {
    return (
      <>
        {React.cloneElement(children, { onClick: handleShow })}
        <Modal
          onOk={handleOk}
          onCancel={setVisible.bind(null, false)}
          title="选择图片"
          visible={visible}
        >
          {body}
        </Modal>
      </>
    )
  }
  return body
}
