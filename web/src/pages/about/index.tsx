import { GithubOutlined } from '@ant-design/icons'
import { Card, Divider } from 'antd'
import React, { Component } from 'react'

import Head from 'next/head'
import { BLOG_NAME } from '@/common/config'

class About extends Component {
  render() {
    return (
      <Card bordered={false}>
        <Head>
          <title>关于-{BLOG_NAME}</title>
        </Head>
        <div className="content-inner-wrapper about">
          <Divider orientation="left">Blog</Divider>
          <p>一直基于 react 写业务，所以博客选用了 next + antd 这套技术栈</p>
          <p>纯函数式开发，很甜</p>
          <p>前端：next + typescript + antd + es6 + less + axios</p>
          <p>服务端：koa2 + mysql + typeorm</p>
          <p>
            <a
              target="_blank"
              className="code"
              rel="noreferrer noopener"
              href="https://github.com/maqi1520/react-koa-blog"
            >
              源码戳这里
            </a>
          </p>
          <Divider orientation="left">Me</Divider>
          <ul className="about-list">
            <li>昵称：狂奔的小马</li>
            <li>
              座右铭：Opportunities are always open to those who prepared for it
            </li>
            <li>
              <GithubOutlined style={{ fontSize: '16px' }} />：
              <a
                target="_blank"
                className="link"
                rel="noreferrer noopener"
                href="https://github.com/maqi1520"
              >
                github
              </a>
            </li>
            <li>
              联系方式：
              <Divider type="vertical" />
              <i className="iconfont icon-email" />
              <a href="mailto:maqi1520@163.com">maqi1520@163.com</a>
            </li>
            <li>坐标：杭州</li>
            <li>学历专业：本科</li>
            <li>
              skill：
              <ul>
                <li>前端：React、ES6/7/8、antd、Axios</li>
                <li>服务端：Node、Koa2、typeorm</li>
                <li>数据库：Mysql</li>
                <li>其他：webpack、git、typescript、serverless</li>
              </ul>
            </li>
          </ul>
        </div>
      </Card>
    )
  }
}

export default About
