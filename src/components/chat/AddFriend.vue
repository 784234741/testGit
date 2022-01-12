<template>
    <el-container>
      <el-header>
        <i class="el-icon-arrow-left" @click="goback"></i>
        <span>添加朋友</span>
      </el-header>
      <el-main>
        <div class="search">
          <el-input
              placeholder="用户名"
              prefix-icon="el-icon-search"
              v-model="uname" @focus="detail=false;is_friend=0">
          </el-input>
          <el-button type="success" @click="search">搜索</el-button>
        </div>
        <el-alert
            title="用户不存在"
            type="warning"
            show-icon ref="warning" v-show="warn">
        </el-alert>
        <div v-show="detail" class="detail">
          <div class="block"><el-avatar shape="square" :size="50" :src="profile"></el-avatar></div>
          <div>{{uname}}</div>
          <div>
            <el-button type="primary" icon="el-icon-plus" @click="addFriend" v-if="is_friend == 0">好友</el-button>
            <span v-else-if="is_friend == 1">已是朋友</span>
            <span v-else-if="is_friend == 2">当前用户</span>
          </div>
        </div>
      </el-main>
    </el-container>
</template>

<script>
export default {
  data:function(){
    return {
      uname:"",
      warn:false,  //用户不存在的警告信息
      profile:"",
      detail:false,  //搜索出来的用户详情
      uid:0,  //好友id
      is_friend:0  //搜索的用户是否已是朋友--默认不是朋友
    }
  },
  methods:{
    goback(){
      this.$router.go(-1);
    },
    search(){
      //获取用户搜索用户的信息
      this.$http.get("api/users/search?uname="+this.uname).then(data=>{
        if(data.data.errCode == 0){
          this.warn = false;
          this.profile = this.$baseURL+data.data.userInfo.profile;
          this.uid = data.data.userInfo.id;
          //获取当前用户的所有朋友
          this.$http.get("api/users/getFriends?id="+sessionStorage.getItem(("id"))).then(data=>{
            let is_friend = data.data.friends.findIndex(item=>{
              return item.fb == this.uid;
            });
            if(is_friend >= 0){
              this.is_friend = 1;  //是朋友
            }
          })
          if(this.uid == sessionStorage.getItem("id")){
            this.is_friend = 2;  //是自己
          }
          this.detail = true;
        }else{
          // console.log(this.$refs.warning);
          // this.$refs.warning.close();
          // this.$refs.warning.visible = true;
          this.warn = true;
        }
      })
    },
    addFriend(){
      this.$http.post("api/users/add",{
        fa:sessionStorage.getItem("id"),
        fb:this.uid
      }).then(data=>{
        console.log(data);
        if(data.data.errCode == 0){
           //好友申请发送成功
           this.$message({
             message: '好友申请发送成功~',
             type: 'success'
           });
        }else if(data.data.errCode == 2){
          //好友申请发送成功
          this.$message({
            message: '已发送过好友申请~',
            type: 'warning'
          });
        }else{
            this.$message.error('好友申请发送失败~');
        }
      })
    }
  },
  beforeCreate() {
    this.$isLogin();
  }
}
</script>

<style scoped lang="scss">
.el-header{
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
  background-color:#f0f0f0;
  height:100vh;
  .search{
    overflow: hidden;
    padding-bottom:20px;
    .el-input{
      float:left;
      width: calc(100% - 80px);
    }
    .el-button{
      float:right;
    }
  }
  .detail{
    background-color: #fff;
    display: flex;
    align-content: center;
    justify-content: space-between;
    >div{
      flex:0 0 auto;
      &:nth-child(2){
        font-weight:bold;
        font-size:16px;
        padding:10px;
        box-sizing: border-box;
        flex:auto;
      }
      &:nth-child(3){
        padding:5px 5px 0 0;
        span{
          color:#ccc;
          line-height: 46px;
        }
      }
    }
  }
}
</style>
