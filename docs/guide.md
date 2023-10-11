# 自定义菜单配置方法介绍

## 1、自定义菜单的创建

-   创建方式：在 livedata-studio 的 config 文件夹下创建名为 customMenu.json 的文件

## 2、自定义菜单模板及编写规则

> 一般情况下，自定义菜单在**角色的功能权限**列表中不可见。如果需要支持用户对自定义菜单赋权操作，可以将相关菜单的 authoryType 权限配置为 NORMAL
>
> 编写完成后，需要**重启**livedata，使自定义菜单生效

```json
[
    {
        //自定义菜单的标题,必须填写
        "title": "测试自定义菜单1",
        //自定义菜单的路由路径，必须填写，且不能重复
        "path": "/custom-menu1",
        //菜单类型：0｜菜单夹；1｜菜单项。必须指定菜单类型
        "menuType": 0,
        "children": [
            {
                "title": "自定义子菜单1-1",
                //子菜单的路由路径，必须携带父路由路径，如此处path上必须以"/custom-menu1"为前缀
                "path": "/custom-menu1/custom-submenu1-1",
                "menuType": 1,
                /*
                 * 权限类型：NORMAL|普通用户可访问；PROJECT_MANAGER|项目管理员可访问； SUPER_MANAGER|超级管理员可访问；NONE|不验         * 证权限。不指定权限类型默认为NORMAL
                 */
                "authoryType": "NONE",
                /*
                 * 菜单窗口类型：NEW_WINDOW|新建窗口打开；TAB|选项卡方式打开； DIALOG|对话框方式打开。不指定窗口类型默认为TAB
                 */
                "windowType": "NEW_WINDOW"
            }
        ]
    },
    {
        "title": "测试自定义菜单2",
        "path": "/custom-menu2",
        "menuType": 0,
        "children": [
            {
                "title": "自定义子菜单2-1",
                "path": "/custom-menu2/submenu2-1",
                "menuType": 0,
                "authoryType": "NONE",
                "children": [
                    {
                        "title": "自定义子菜单2-1-1",
                        "path": "/custom-menu2/submenu2-1/submenu2-1-1",
                        "menuType": 1,
                        "authoryType": "NONE"
                    }
                ]
            }
        ]
    },
    {
        "title": "测试自定义菜单3",
        "path": "/custom-menu3",
        "menuType": 0,
        "children": [
            {
                "title": "新窗口",
                "path": "/custom-menu3/submenu3-1",
                "menuType": 1,
                "authoryType": "NONE",
                "windowType": "NEW_WINDOW"
            },
            {
                "title": "对话框",
                "path": "/custom-menu3/submenu3-2",
                "menuType": 1,
                "authoryType": "NONE",
                "windowType": "DIALOG"
            },
            {
                "title": "选项卡",
                "path": "/custom-menu3/submenu3-3",
                "menuType": 1,
                "authoryType": "NONE",
                "windowType": "TAB"
            }
        ]
    },
    {
        "title": "测试自定义菜单4",
        "path": "/yyy",
        "menuType": 1,
        "authoryType": "NONE",
        "windowType": "NEW_WINDOW"
    }
]
```

## 3、自定义菜单路由到外部链接

### 1）访问自定义菜单的地址请求规则：项目基础路径 + 自定义菜单的 path

假设项目基础路径为

```
http://x.x.x.x:8080/
```

则访问菜单“**自定义子菜单 1-1**”会打开新窗口并请求地址

```
http://x.x.x.x:8080/custom-menu1/custom-submenu1-1
```

### 2）nginx 请求转发配置

#### i.nginx 请求转发进行重定向

如果需要将菜单“**自定义子菜单 1-1**”重定向到外部链接，需要对**项目**和**以下路径**配置 nginx 请求转发：

```
http://x.x.x.x:8080/custom-menu1/custom-submenu1-1
```

​ nginx 请求转发配置示例：

```
server {
    # 监听端口
    listen       8888;
    # 监听ip
    server_name  x.x.x.x;

    # 配置项目路径的请求转发
    location / {
        root   html;
        index  index.html index.htm;
        # 项目基础路径，按实际要求修改
        proxy_pass   http://x.x.x.x:8080;
        # 配置websocket的长连接，必须配置
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        # 跟踪客户端真实ip，可不配置
        proxy_set_header Host $proxy_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    }

    # “自定义子菜单1-1”路径请求转发进行重定向
    location /custom-menu1/custom-submenu1-1 {
        # 将任意url重写到百度首页
        rewrite ^/(.*)$   http://www.baidu.com;
    }

}
```

访问地址http://x.x.x.x:8888，进入菜单”**自定义子菜单1-1**“即可新窗口重定向到外部链接

#### ii.自定义菜单路由到其它项目

如果需要将菜单“**测试自定义菜单 4**”路由到其它项目，需要对**项目**和**以下路径**配置 nginx 请求转发：

```
http://x.x.x.x:8080/yyy
```

> 在配置自定义菜单前，为方便配置 nginx 转发请求，推荐先配置项目的基础路径为根路径，如
>
> ```
> http://x.x.x.x:x/
> ```
>
> 推荐配置其它项目的基础路径，先设置相应 content-path 为 yyy，则该项目的访问路径如下：
>
> ```
> http://x.x.x.x:x/yyy
> ```

    server {
    	# 监听端口
        listen       8888;
        # 监听ip
        server_name  x.x.x.x;

        # 配置项目路径的请求转发
        location / {
    	    root   html;
            index  index.html index.htm;
            # 项目基础路径
    		proxy_pass   http://x.x.x.x:x;
    		# 配置websocket的长连接，必须配置
    		proxy_http_version 1.1;
    		proxy_set_header Upgrade $http_upgrade;
    		proxy_set_header Connection $connection_upgrade;
    		# 跟踪客户端真实ip，可不配置
    		proxy_set_header Host $proxy_host;
    		proxy_set_header X-Real-IP $remote_addr;
    		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        }

    	# 配置其它项目的请求转发
        location /yyy {
        	# 请求转发到真实地址
    		proxy_pass http://x.x.x.x:x/yyy;
        }

    }

访问地址http://x.x.x.x:8888，进入菜单”**测试自定义菜单4**“，即可路由到相应项目。如果路由到的项目已实现session共享，新窗口可免登录访问相应项目首页。

#### \*iii.session 共享配置

> session 共享的免登录实现基于用户账号，所以请尽量同步 livedata 和要共享 session 的项目的用户表账号，否则容易导致免登录失败

livedata 已整合 livebos-session-common 依赖，要实现 session 共享功能，需要以下配置：

##### 1、 livedata 启用 session 共享功能

> 在 livedata-studio 的 config 文件夹的 application.yml 文件里添加以下配置

```yaml
lb:
  session:
  	# 启用session共享
    share: true
    # !!!redis的namespace配置，需要和要共享session的项目配置相同
    namespace: livedata:share
```

##### 2、 要共享 session 项目启用 session 共享功能

> 如果是 livebos 项目，可参考 livebos 相关文档，或在 LiveBOS/LiveBOSCore/WEB-INF/classes 目录下的 system.properties 文件增加以下配置

```properties
lb.session.appId=livebos-share
# !!!redis的namespace配置,需要和要共享livedata配置相同
lb.session.namespace=livedata:share
server.session.timeout=-1
lb.session.server.session-timeout=-1
system.session.cluster.enabled=true
lb.session.cluster.mode=thin
```

##### 3、livedata 和要共享 session 的项目共用 Redis
