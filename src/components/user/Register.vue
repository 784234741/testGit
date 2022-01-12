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
        <el-form-item>
          <el-button type="success" @click="register">注 册</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer>
      <router-link to="login" class="el-link el-link--primary">登录</router-link>
      <router-link to="found" class="el-link el-link--primary">找回密码</router-link>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      uname:"",
      pwd:""
    }
  },
  methods:{
    register(){
      //使用axios请求node.js的接口
      // this.$http.post("http://localhost:3000/users/register",{
        this.$http.post("api/users/register",{
        uname:this.uname,
        pwd:this.pwd
      },{
        //解决跨域请求头不符合要求
        // headers:{"content-type":"application/x-www-form-urlencoded"}
      }).then(data=>{
        //注册成功，跳转页面
        if(data.data.errCode == 0){
            this.$router.push("login");  //通过路由对象跳转到login
        }
      })
    }
  }
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
</style>
