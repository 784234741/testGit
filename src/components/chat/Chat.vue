<template>
  <el-container>
    <el-header>
      <i class="el-icon-arrow-left" @click="goback"></i>
      <!-- <span>{{$route.params.uname}}</span> -->
      <span>{{uname}}</span>
    </el-header>
    <el-main>
      <ul>
        <li :class="[m.fromA == uid ? 'left' : 'right']" v-for="m in list">
          <div class="block"><el-avatar shape="square" :size="50" :src="$baseURL+(m.fromA == uid ? profile : $store.state.userInfo.profile)"></el-avatar></div>
          <div class="msg">{{m.msg}}</div>
        </li>
      </ul>
    </el-main>
    <el-footer>
      <el-input v-model="msg" placeholder="你想说点什么"></el-input>
      <el-button type="success" size="medium" @click="sendMsg">发送</el-button>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  props:["uid","uname","profile"],
  data:function(){
    return {
      msg:"",
      list:[]
    }
  },
  methods:{
    goback(){
      this.$router.go(-1);
    },
    sendMsg(){
      //向服务端发送请求
      this.$store.state.socket.emit("sendmsg",{msg:this.msg,fromA:sessionStorage.getItem("id"),toB:this.uid});
      this.msg = "";
    },
    getChat(){
      this.$http.get(`api/chat/getChat?uid1=${sessionStorage.getItem("id")}&uid2=${this.uid}`).then(data=>{
        this.list = data.data.msg;
        console.log(this.list);
      })
    }
  },
  beforeCreate() {
    this.$isLogin();
  },
  created() {
    //获取当前登录用户和选择的朋友之间的聊天记录
    this.getChat();
  },
  computed:{
    updateMsg(){
      return this.$store.state.msg;
    }
  },
  watch:{
    updateMsg(newVal){
      //this.uid:聊天对象id
      //sessionStorage.id:当前用户id
      if((newVal.fromA == sessionStorage.getItem("id") && newVal.toB == this.uid) ||(newVal.toB == sessionStorage.getItem("id") && newVal.fromA == this.uid)){
        this.list.push(newVal);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header{
  background-color:#f0f0f0;
  position: relative;
  i,span{
    display: block;
    height: 60px;
    line-height: 60px;
  }
  i{
    float: left;
  }
  span{
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    font-weight:bold;
  }
}
.el-container{
  background-image: url(../../assets/images/chat_bg.jpg);
  height:100vh;
  background-size: cover;
  ul{
    li{
      overflow: hidden;
      padding-bottom: 10px;
      .block{
        float:left;
      }
      .msg{
        float:left;
        padding:10px;
        line-height: 30px;
        background-color: #fff;
        border-radius: 5px;
        position: relative;
        margin-left:15px;
        max-width: calc(100% - 85px);
        &::before{
          content:"";
          display: block;
          width:0;
          height: 0;
          border:10px transparent solid;
          border-right-color:#fff;
          position: absolute;
          top:15px;
        }
      }
      &.right{
        .block{
          float: right;
        }
        .msg{
          float:right;
          margin-right:15px;
          margin-left: 0;
          background-color: #67C23A;
          color:#fff;
          &::before{
            border-right-color:transparent;
            border-left-color: #67C23A;
            right:-20px;
          }
        }
      }
      &.left .msg::before{
        left:-20px;
      }
    }
  }
}
.el-footer{
  background-color: #f0f0f0;
  padding:10px;
  .el-input{
    width:calc(100% - 75px);
  }
}
</style>
