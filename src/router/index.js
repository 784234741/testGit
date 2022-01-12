import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/user/Login'
import Register from '@/components/user/Register.vue'
import Found from '@/components/user/Found'
import Index from '@/components/chat/Index'
import Friends from '@/components/chat/Friends'
import List from '@/components/chat/List'
import Discovery from '@/components/chat/Discovery'
import Me from '@/components/chat/Me'
import AddFriend from '@/components/chat/AddFriend'
import Chat from '@/components/chat/Chat'
import NotFound from '@/components/Other/NotFound.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/found',
      name: 'Found',
      component: Found
    },
    {
      path:"/index",
      component:Index,
      children:[
        {
          path:"list",  //消息列表
          component:List
        },
        {
          path:"friends",  //通讯
          component:Friends
        },
        {
          path:"discovery",  //发现
          component:Discovery
        },
        {
          path:"me",  //我的
          component:Me
        },
        {
          path:"",  //默认，消息列表
          redirect:"list"
        }
      ]
    },
    {
      path:"/addfriend",
      component:AddFriend
    },
    {
      //动态路由
      path:"/chat/:uid/:uname/:profile",
      component:Chat,
      props:true
    },
    {
      path:"*",
      component:NotFound
    }
  ]
})
