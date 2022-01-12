<template>
  <div>
    <ul v-if="list.length">
      <li>好友申请</li>
      <li v-for="f in list">
        <div class="block"><el-avatar shape="square" :size="50" :src="$baseURL+f.profile"></el-avatar></div>
        <div>{{f.uname}}</div>
        <div>
          <el-button type="primary" @click="agree(f)">同意</el-button>
          <el-button type="danger" @click="refuse(f)">拒绝</el-button>
        </div>
      </li>
    </ul>
    <ul>
      <li>好友列表</li>
      <li v-for="f in friends" @click="chat(f)">
        <div class="block"><el-avatar shape="square" :size="50" :src="$baseURL+f.profile"></el-avatar></div>
        <div>{{f.uname}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props:["applys","test"],
  data:function(){
    return {
      list:this.deepCopy(this.applys),
      friends:[]
    }
  },
  watch:{  //侦听器
    applys:function(newVal,oldVal){  //监听apply值的变化
      //newVal:新设置的值
      //oldVal:原来的值
      console.log("watch监听值发生变化")
      this.list = this.deepCopy(newVal);
    }
  },
  /*computed:{
    list:function(){
      return this.deepCopy(this.applys);
    }
  },*/
  methods:{
    agree(f){
      this.$http.get(`api/users/agree?id=${f.id}&fa=${f.fa}&fb=${f.fb}`).then(data=>{
        if(data.data.errCode == 0){
          this.$emit("change",f.id);
          this.getFriends();  //刷新通讯录好友
        }
      })
    },
    refuse(f){
      this.$http.get(`api/users/refuse?id=${f.id}`).then(data=>{
        if(data.data.errCode == 0){
          this.$emit("change",f.id);
        }
      })
    },
    deepCopy(obj){  //深拷贝
      return obj.map(item=>Object.assign(item));
    },
    //搜索当前用户的所有好友
    getFriends(){
      this.$http.get("api/users/getFriends?id="+sessionStorage.getItem(("id"))).then(data=>{
        this.friends = data.data.friends;
      })
    },
    //进入聊天页面
    chat(f){
      //f.fb就是朋友的用户id
      this.$router.push(`/chat/${f.fb}/${f.uname}/${f.profile}`);
    }
  },
  created(){
    console.log("create被调用")
    this.getFriends();
  }
}
</script>

<style scoped lang="scss">
ul{
  padding:10px 20px;
  li{
    &:nth-child(1){
      font-size:12px;
    }
    display: flex;
    padding:8px 0;
    justify-content: space-between;
    >div{
      flex:0 0 auto;
      &:nth-child(2){
        font-weight:bold;
        font-size:16px;
        padding:10px;
        box-sizing: border-box;
        flex:auto;
        border-bottom: 1px #ccc solid;
      }
      &:nth-child(3){
        padding-top:5px;
        border-bottom: 1px #ccc solid;
      }
    }
  }
}
</style>
