import Vue from "vue"
import Vuex from "vuex"
import IO from "socket.io-client"

Vue.use(Vuex);

const store = new Vuex.Store({
  state:{  //共享状态
    userInfo:{},
    socket:null,
    msg:{}
  },
  mutations:{  //修改共享状态的方法
    updateUser(state,data){ //state:共享的状态对象  data:传递的参数
      state.userInfo = data
    },
    createSocket(state){
      let socket = IO("http://localhost:3000");
      //上线通知(将当前用户id发送给服务器，让服务器记录用户id和socketid之间的关联关系)
      socket.emit("online",sessionStorage.getItem("id"));
      //监听服务器推送数据的请求
      socket.on("receivemsg",data=>{
        //服务器推送的数据
        console.log(data);
        state.msg = data;
      })
      state.socket = socket;
    },
    closeSocket(state){
      //下线
      state.socket.emit("offline",sessionStorage.getItem("id"));
      state.socket.close();  //关闭连接
    }
  }
})

export default store;
