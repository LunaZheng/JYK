# my-project

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


this.$router 与this.$route区别
this.$router 实际上 就是全局 路由对象  任何页面 都可以 调用 push(), go()等方法
this.$route  表示当前正在用于跳转的路由器对象，可以调用其name、path、query、params等属性；



 ---------------------
|  GitHub 代码更新 :  |
 ---------------------
   
步骤分别为添加、提交、推送     
git add 加要更新的文件(. 为所有文件)    
git commit -m "代码提交信息"    
git push origin master    


 ----------------------
|   vue-cli 项目步骤:  |  
 ----------------------   
首先已经全局安装了 vue-cli     
$ vue init webpack my-project  
$ cnpm install axios --save  
$ cnpm install vuex --save  
$ cnpm install stylus stylus-loader --save-dev  