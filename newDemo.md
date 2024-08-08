## 基于：

1.nextjs
2.Chakra UI
3.recoiljs
搭建一个 web 项目，项目中客户端组件与服务端组件都要使用

## 项目页面包括：

#### 1. 登录页面，

接口地址： http://192.168.0.242:8001/doc.html#/ms-login/%E7%99%BB%E5%BD%95%E6%9C%8D%E5%8A%A1/loginUsingPOST

登录用户名:admin
密码:123456

登录需要使用 RSA 加密：https://www.npmjs.com/package/jsencrypt
加密步骤： 1.请求接口文档中的获取公钥地址 2.返回数据作为公钥，将登录页输入框中获取的密码字段的值，进行加密 3.将用户名、加密后的密码发送后端执行登录

##### 登录成功后：

1.后端会在 http-headers 中，返回一个 key 为 X-Auth-Token 的字符串值，此 token 需要在后续接口中作为 http 请求的 token，放入 header 中，发送后端

2.请求一个菜单接口，返回的菜单数据，需要作为下方页面 2 的菜单展示。

#### 2. 仿造公司官网首页：

http://www.greatech.com.cn/index.aspx
首页大概样式差不多就行,不需要实现 header 栏的功能。

需要手动实现一个 react 的轮播组件

项目整体需要使用 typescript 编写
