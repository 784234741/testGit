<template>
  <el-container>
	  <el-header>
      <div>微信</div>
      <div>
        <i class="el-icon-search"></i>
        <el-tooltip class="item" effect="dark" content="Bottom Right 提示文字" placement="bottom-end">
          <div slot="content">
            <div @click="addFriend">
              <i class="el-icon-s-custom"></i>
              <span>添加朋友</span>
            </div>
            <div>
              <i class="el-icon-s-comment"></i>
              <span>发起群聊</span>
            </div>
            <div>
              <i class="el-icon-s-cooperation
"></i>
              <span>扫一扫</span>
            </div>
            <div>
              <i class="el-icon-s-finance"></i>
              <span>收付款</span>
            </div>
            <div>
              <i class="el-icon-s-promotion"></i>
              <span>帮助与反馈</span>
            </div>
          </div>
          <i class="el-icon-circle-plus-outline"></i>
        </el-tooltip>
      </div>
    </el-header>
	  <el-main>
      <keep-alive>
        <router-view :applys="applys" @change="changeIt"></router-view>
      </keep-alive>
    </el-main>
	  <el-footer>
      <el-row>
        <el-col :span="6">
          <router-link to="list">
            <i class="el-icon-chat-round"></i>
            <span>微信</span>
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link to="friends" class="friends">
            <el-badge :value="applys.length" class="item" v-if="applys.length>0"></el-badge>
            <i class="el-icon-notebook-1"></i>
            <span>通讯录</span>
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link to="discovery">
            <i class="el-icon-discover"></i>
            <span>发现</span>
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link to="me">
            <i class="el-icon-user"></i>
            <span>我</span>
          </router-link>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  data:function(){
    return {
      applys:[],  //好友申请
    }
  },
  methods:{
    addFriend(){
      this.$router.push("/addFriend");
    },
    changeIt(data){
      this.applys = this.applys.filter(item=>{
        return item.id != data;
      })
    }
  },
  beforeCreate() {
    //验证用户是否登录
    this.$isLogin();
    //查看是否有好友申请
    this.$http.get("api/users/get?id="+sessionStorage.getItem(("id"))).then(data=>{
      this.applys = data.data.friends;
    })
  }
}
</script>

<style scoped lang="scss">
.el-header{
  background-color: #f0f0f0;
  position: relative;
  >div{
    font-weight:bold;
    position: absolute;
    &:nth-child(1){
      left: 50%;
      top:50%;
      transform: translate(-50%,-50%);
    }
    &:nth-child(2){
      right:20px;
      top:50%;
      transform: translateY(-50%);
      i{
        font-weight:bold;
        padding:0 5px;
      }
    }
  }
}
.el-tooltip__popper.is-dark{
  //提示内容区
  >div{
    //一行内容
    >div{
      height:30px;
      line-height: 30px;
      i,span{
        color:#fff;
      }
      span{
        border-bottom:1px #666 solid;
        margin-left:10px;
      }
    }
  }
}
.el-main{
  padding:0;
}
.el-footer{
  padding:0;
  background-color:#f0f0f0;
  position: fixed;
  bottom: 0;
  width: 100%;
  .el-row{
    height: 100%;
    .el-col{
      height:100%;
      display: flex;
      justify-content: center;
      align-items: center;
      a{
        display: block;
        color:black;
        text-decoration: none;
        font-weight:bold;
        i,span{
          display: block;
          text-align: center;
        }
        i{
          font-size:22px;
        }
        span{
          font-size:12px;
        }
        &.router-link-active{
          i,span{
            color:#67c23a;
          }
        }
        &.friends{
          position: relative;
          .el-badge{
            position: absolute;
            right:-5px;
            top:-10px;
          }
        }
      }
    }
  }
}
</style>
