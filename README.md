# React-Koa-Blog

## 技术栈

 - 前端：next + typescript + antd + es6 + less + axios

 - 服务端：koa2 + mysql + typeorm



## 单独部署

```bash
git clone git@github.com:maqi1520/react-koa-blog.git
```

在server/下建立`.env.local` 文件
写入

```bash
# Application Port - KOA server listens on this port(default 3000).
PORT=4000

# Environment - If development, TypeORM will use typescript entities and DB conn will be non SSL
# NODE_ENV=development

# JWT secret - JWT tokens should be signed with this value
JWT_SECRET=your-secret-whatever

# DB connection data in connection-string format.
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=12345678
DB_NAME=blog
```

在web/下建立`.env.local` 文件

写入

```bash
API_URL=http://localhost:3000
NEXT_PUBLIC_OSS_accessKeyId=xxxx
NEXT_PUBLIC_OSS_accessKeySecret=xxx
NEXT_PUBLIC_OSS_region=oss-cn-hangzhou
NEXT_PUBLIC_OSS_bucket=aliyun-wb-bucket
NEXT_PUBLIC_OSS_endpoint=http://oss.example.cn
```
全局安装 pm2
```bash
yarn global add pm2
```
打包部署

```bash
cd react-koa-blog/web yarn
yarn build
pm2 start npm --name "blog web" -- start
cd ../server yarn
yarn build
pm2 start npm --name "blog server" -- start
```

## 安装 nginx 

反向代理

拷贝覆盖`nginx.conf`

```bash
#  重启nginx
sudo /usr/sbin/nginx -s reload
```

## docker 部署

修改`docker-composer.yml`中对于env 的值

### 安装 docker-compose

```bash
pip install docker-compose
```

### 启动

```bash
docker-compose up -d
```
-d 是后台启动

### 单个服务启动

```bash
docker-compose up -d web
```

 更多docker-compose 的例子可以看 [awesome-compose](https://github.com/docker/awesome-compose)

## 功能列表

 * [x] mysql 存储
 * [x] 多人blog
 * [x] markdown渲染
 * [x] 阿里云图床
 * [x] 代码高亮
 * [x] 保存到草稿箱
 * [x] 摘要
 * [x] 标签
 * [x] 翻页功能
 * [x] 评论功能
 * [x] 回到顶部
 * [x] 适配移动端
 * [x] docker 部署
 * [ ] 收藏文章
 * [ ] 自定义用户博客信息
 * [ ] React Native App