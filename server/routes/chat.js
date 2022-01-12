var express = require('express');
var router = express.Router();
var db = require("../model/db");

//获取所有的聊天信息
router.get('/', function(req, res, next) {
  /*
  {
    uid2:{toB:2,uname:"abc",profile:"",msg:"",systime:**,count:2},
    uid3:{toB:3,uname:"abc",profile:"",msg:"",systime:**,count:2}
  }
  */

  db.getAll("msg",{fromA:req.query.id,toB:req.query.id}).then(data=>{
    let list = {}
    for(let t of data){
      //聊天对象id
      let uid = t.fromA == req.query.id ? t.toB :t.fromA;
      let date = new Date(t.systime);
      //判断和uid的聊天记录是否已经保存
      if(list["uid"+uid]){
        //已存在聊天记录，就做更新
        list["uid"+uid].msg = t.msg;
        list["uid"+uid].systime = date.getMonth()+1+"月"+date.getDate()+"日";
        list["uid"+uid].count = t.is_read == 0 ? list["uid"+uid].count+1 : list["uid"+uid].count;
      }else{
        //未读信息数量，因为当前用户聊天记录不存在，作为第一条记录添加时，未读消息数量要么是1，要么是0
        let counts = t.is_read ? 0 : 1;
        list["uid"+uid] = {toB:uid,msg:t.msg,systime:date.getMonth()+1+"月"+date.getDate()+"日",count:counts};
      }
    }
    //查询聊天对象的信息
    let tmp = {};
    Object.entries(list).forEach(async (val)=>{
      await db.search("user",{id:val[1].toB}).then(data=>{
        val[1].uname = data[0].uname;
        val[1].profile = data[0].profile;
      })
      tmp[val[0]] = val[1];
      //判断是否循环完成
      if(Object.keys(tmp).length == Object.keys(list).length){
        res.json({errCode:0,errMsg:"所有聊天信息",msg:tmp});
      }
    })
  })
});
//获取和某个人的聊天记录
router.get("/getChat",(req,res)=>{
  let where = `(fromA=${req.query.uid1} AND toB=${req.query.uid2}) OR (toB=${req.query.uid1} AND fromA=${req.query.uid2})`
  db.getRes("msg",where).then(data=>{
    res.json({errCode:0,errMsg:"当前用户聊天记录",msg:data})
  })
})
module.exports = router;
