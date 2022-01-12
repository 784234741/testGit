<template>
  <el-container>
    <el-main>
      <el-form>
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" v-model="uname"></el-input>
        </el-form-item>
        <el-form-item>
          <!--label内容加空格-->
          <label slot="label">密&nbsp;&nbsp;&nbsp;码</label>
          <el-input show-password placeholder="请输入密码" v-model="pwd"></el-input>
        </el-form-item>
        <el-form-item class="tips" v-show="tips">
          <el-alert
              title="登录失败:用户名或密码错误"
              type="error"
              show-icon>
          </el-alert>
        </el-form-item>
        <el-form-item>
          <el-button type="success" :disabled="disabled" @click="submit">登 录</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer>
      <router-link to="register" class="el-link el-link--primary">注册</router-link>
      <router-link to="found" class="el-link el-link--primary">找回密码</router-link>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      uname:"",
      pwd:"",
      tips:false,
      a:{c:1}
    }
  },
  methods:{
    submit(){
      this.$http.post("api/users/login",{
        uname:this.uname,
        pwd:this.pwd
      }).then(data=>{
        if(data.data.errCode == 0){
          //更改用户登录状态--服务端
          // this.$http.get("api/users/change?is_login=1&id="+data.data.userInfo.id).then(data=>{
          //   console.log(data);
          // });
          //记录当前登录用户--客户端
          sessionStorage.setItem("id",data.data.userInfo.id);
          //触发App.vue的自定义事件，用来创建socket
          // this.$emit("createsocket");
          //将用户信息保存到store中
          this.$store.commit("updateUser",data.data.userInfo);
          this.$store.commit("createSocket");
          //跳转到聊天页面
          this.$router.push("index/");
        }else{
          //登录失败
          // document.querySelector(".tips").style.display = "block";
          this.tips = true;
        }
      })
    }
  },
  computed:{
    //控制登录按钮是否可用
    disabled:function(){
      //当用户名和密码都不为空时，返回false
      return (this.uname != "" && this.pwd != "") ? false : true;
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-input{
  width:calc(100% - 54px);
}
.el-button{
  width:100%;
}
.tips{
  /* display: none; */
}
</style>
