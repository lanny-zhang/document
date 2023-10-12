# 文档中心

使用docsify搭建的文档中心，在node环境下启动，可以自动监听md文件变化生成侧边栏。

## 开始
```
//安装
npm install
//启动
node server
```

## 文档修改和添加

在docsify下直接添加md文件即可，支持建立文件夹添加md文件，层级关系自动生成


## 部署
* 安装node
* 安装pm2
```
npm install pm2 -g
```
* 启动node进程
```
//启动
pm2 start server
//查看进程
pm2 list
//终止进程
pm2 stop [process]
```



