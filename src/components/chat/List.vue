<template>
  <ul>
    <li v-for="m in msg" @click="chat(m)">
      <div class="block">
        <el-avatar shape="square" :size="50" :src="$baseURL+m.profile"></el-avatar>
      </div>
      <div>
        <div>{{m.uname}}</div>
        <div>{{m.msg}}</div>
      </div>
      <div>{{m.systime}}</div>
    </li>
  </ul>
</template>

<script>
export default {
  data:function(){
    return {
      msg:[]
    }
  },
  methods:{
    //进入聊天页面
    chat(f){
      //f.fb就是朋友的用户id
      this.$router.push(`/chat/${f.toB}/${f.uname}/${f.profile}`);
    }
  },
  beforeCreate(){
    //获取所有的聊天信息
    this.$http.get("api/chat?id="+sessionStorage.getItem("id")).then(data=>{
      this.msg = data.data.msg;
    })
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/main";
ul{
  li{
    height:60px;
    >div{
      float:left;
      height:60px;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      align-content: center;
      &:nth-child(1){
        padding:0 20px;
      }
      &:nth-child(2){
        flex:auto;
        border-bottom: 1px #cccccc solid;
        width: calc(100% - 200px);
        div{
          &:nth-child(1){
            width: 100%;
            font-weight:bold;
          }
          &:nth-child(2){
            color:$color2;
            font-size:14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      &:nth-child(3){
        border-bottom: 1px #ccc solid;
        width: 110px;
        justify-content: center;
        font-size:14px;
        color:$color2;
      }
    }
  }
}
</style>
