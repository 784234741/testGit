var express = require('express');
var router = express.Router();
var db = require("../model/db");
var crypto = require("crypto");

//注册
router.post('/register', function(req, res, next) {
  //密码MD5加密
  let hash = crypto.createHash("MD5").update(req.body.pwd);
  req.body.pwd = hash.digest("hex");
  db.add("user",Object.keys(req.body),Object.values(req.body)).then(data=>{
    if(data > 0){
      res.json({errCode:0,errMsg:"注册成功！~"});
    }else{
      res.json({errCode:1,errMsg:"注册失败！~"});
    }
  })
});
//登录
router.post('/login', function(req, res, next) {
  //密码MD5加密
  let hash = crypto.createHash("MD5").update(req.body.pwd);
  req.body.pwd = hash.digest("hex");
  db.search("user",req.body).then(data=>{
    if(data.length > 0){
      res.json({errCode:0,errMsg:"登录成功！~",userInfo:data[0]});
    }else{
      res.json({errCode:1,errMsg:"登录失败！~",userInfo:{}});
    }
  })
});
//更改用户登录状态
router.get("/change",(req,res)=>{
  db.update("user",{is_login:req.query.is_login},{id:req.query.id}).then(data=>{
    if(data>0){
      res.json({errCode:0,errMsg:"状态更改成功！~"})
    }else{
      res.json({errCode:1,errMsg:"状态更改失败！~"})
    }
  })
})
//搜索用户
router.get("/search",(req,res)=>{
  db.search("user",req.query).then(data=>{
    if(data.length > 0){
      res.json({errCode:0,errMsg:"搜索到用户！~",userInfo:data[0]});
    }else{
      res.json({errCode:1,errMsg:"用户不存在！~",userInfo:{}});
    }
  })
})
//添加好友申请
router.post("/add",(req,res)=>{
  //判断是否已经发送过好友申请
  db.search("friends",req.body).then(data=>{
    if(data.length > 0){
      //已经发送过请求，对方还没有处理
      res.json({errCode:2,errMsg:"已发送过好友申请！~"});
    }else{
      db.add("friends",Object.keys(req.body),Object.values(req.body)).then(data=>{
        if(data > 0){
          res.json({errCode:0,errMsg:"好友申请成功！~"});
        }else{
          res.json({errCode:1,errMsg:"好友申请失败！~"});
        }
      })
    }
  })
})
//获取好友申请
router.get("/get",(req,res)=>{
  let fb = req.query.id;
  let join = "`friends`.`fa`=`user`.`id`";
  let where ="`friends`.`is_true` = 0 AND `friends`.`is_read`=0 AND `friends`.`fb` = "+fb;
  let fields = "`friends`.*,`user`.`uname`,`user`.`profile`";
  db.searchAll("friends","user",join,where,fields).then(data=>{
     res.json({errCode:0,errMsg:"获取好友申请成功！~",friends:data});
  })
})
//同意好友申请
router.get("/agree",(req,res)=>{
  let upData = {
    is_true:1,
    is_read:1
  }
  //A添加了B，B会收到A的好友申请，B同意A的好友申请后，B也需要将A添加为好友
  db.update("friends",upData,{id:req.query.id}).then(data=>{
    if(data > 0){
      let tmp = {fa:req.query.fb,fb:req.query.fa,is_read:1,is_true:1};
      //需要将对方也添加好友
      db.add("friends",Object.keys(tmp),Object.values(tmp)).then(data=>{
         if(data > 0){
           res.json({errCode:0,errMsg:"已添加好友"});
         }else{
           res.json({errCode:1,errMsg:"好友添加失败"});
         }
      })
    }else{
      res.json({errCode:1,errMsg:"好友添加失败"});
    }
  })
})
//拒绝好友申请
router.get("/refuse",(req,res)=>{
  db.del("friends",req.query).then(data=>{
    if(data > 0){
      res.json({errCode:0,errMsg:"已拒绝添加好友"});
    }else{
      res.json({errCode:1,errMsg:"拒绝失败"});
    }
  })
})
//获取所有好友
router.get("/getFriends",(req,res)=>{
  let fa = req.query.id;
  let join = "`friends`.`fb`=`user`.`id`";
  let where ="`friends`.`is_true` = 1 AND `friends`.`is_read`=1 AND `friends`.`fa` = "+fa;
  let fields = "`friends`.*,`user`.`uname`,`user`.`profile`";
  db.searchAll("friends","user",join,where,fields).then(data=>{
     res.json({errCode:0,errMsg:"获取所有好友成功！~",friends:data});
  })
})
module.exports = router;
