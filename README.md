# v-blog
<a href="http://114.55.254.227:8080/v-blog/">在线访问链接</a>
## v-blog是一个利用vue.js编写的一个小型个人博客网站。前端所使用的主要技术及工具：
1. 脚手架工具vue-cli3
2. 利用axios完成与后台的交互
3. 利用vuex进行状态管理
4. 使用vue-router进行路由管理
5. 使用框架——iView
6. 使用预编译语言——less

## 后台是自己使用原生的```Java```语言编写的一些简单接口。以下是简单的接口文档：

### 用户
#### 1.登录 
```
Post  参数：phone_num, password　　　或者　　　token_id
返回：{
code: 1,
msg: success,
token_id: xxx,
data: {
user_id: 123,
Phone_num: xxxx
username: xxx,
avatar_url: ‘...’
}
}
```

#### 2.注册
```
Post 参数：phone_num,username,password
返回：{
code: 1,
msg: success,
data: {
user_id: 123,
Phone_num: xxx,
username: xxx
}
}
```
### 博客
#### 1.显示博客列表
```
Get 参数： token_id 或 token_id,tag_id
返回： {
code: 1,
msg: “成功获取博客列表”,
data:[ {
user_id: 123,
Blog_id:123,
title: xxx,
content: xxx,
abstract: xxx,
time: xxx,
tag_id:1,
tag_name: xxx
}]
}
```
#### 2.上传博客
```
Post 参数：title,abstract,content,tag_id,user_id
返回：{
code: 1,
msg: “上传成功” 
}
```
#### 3.获取博客详情
```
Post 参数：blog_id,token_id
返回：{
code: 1,
msg: “成功获取博客详情”,
data: {
blog_id: 1,
title: “...xxx”,
abstract: “xxx”,
content: ”xxx”,
time: 1533....,
tag_name: “xxx”,
} 
}
```
#### 4.删除博客
```
Post  参数：blog_id，token_id
返回：{
code: 1,
msg: “删除成功”

}
```
### 标签
#### 1.获取标签
```
/blog/getTag
GET 参数：user_id
返回： {
code: 1,
msg: “获取标签信息成功”,
data:[{
tag_id: 1,
tag_name: ’vue’
}]
}
```
#### 2.添加标签
```
Post  参数：tag_name，user_id
返回：{
Code: 1
Msg: “xxx”
}
```
#### 3.删除标签
```
Post  参数：tag_id，user_id
返回：{
Code: 1
Msg: “xxx”
}
```
#### 4.编辑标签
```
Post   参数：tag_id,user_id,tag_name
返回：{
Code: 1,
Msg: “xxx”,
}
```
