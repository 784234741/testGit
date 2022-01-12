<template>
  <div id="app">
    <router-view @createsocket="createSocket"/>
  </div>
</template>

<script>
//导入socket.io-client
import io from "socket.io-client"
export default {  //组件的配置选项
  name: 'App',
  data:function(){
    return {
      socket:null
    }
  },
  methods:{
    createSocket(){
      //自动创建socket实例
      let socket = io("http://localhost:3000");
      //上线通知(将当前用户id发送给服务器，让服务器记录用户id和socketid之间的关联关系)
      socket.emit("online",sessionStorage.getItem("id"));
      //监听服务器推送数据的请求
      socket.on("receivemsg",data=>{
        //服务器推送的数据
        console.log(data);
      })
      this.socket = socket;
      this.$root.$socket = this.socket;  //给根组件添加socket属性
    }
  },
}
</script>

<style lang="scss">
@import "./assets/css/main";
*{
  padding:0;
  margin:0;
  color:$mainfontcolor;
}
ul{
  list-style: none;
}
.el-button>span{
  color:#fff;
}
.el-avatar{
  display: block;
}
</style>
