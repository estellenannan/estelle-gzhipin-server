


const express = require('express');
const router = express.Router();
const md5 = require('blueimp-md5');
const {UserModel} = require('../db/model');

const filter = {password: 0,__v: 0};// 验证登录时过滤多余的



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//定义注册路由组件
//1，获取请求参数 post:req.body get: req.query param.body
//2，处理数据
//3，返回响应 res.send()/res.json()

// //测试路由
// router.post('/register',function (req,res) {
//   //1，获取请求参数 post:req.body
//   const {username,password} = req.body;
//   //2，处理数据
//   if (username === 'admin') {
//     //3，返回响应 失败
//     res.send({code:1,msg:'此用户已存在，请重新输入'})
//   } else {
//     //3，返回响应 成功
//     res.json({code:0,data: {_id:'123',username}})
//   }
//
// });




//定义注册路由

router.post('/register',function (req,res) {
  //1，获取请求参数 post:req.body
  const {username,password,type} = req.body;

  //2，处理数据 1). 根据username查询users集合得到user 查询 有 失败/无=》成功》保存
  UserModel.findOne({username},function (error,userDoc) {
    if (error) {
      console.log(error);
    } else {
      if (userDoc) {
        //3，返回响应 已有
        res.send({"code":1,"msg":'此用户已存在'})
      } else {
//3，返回响应 成功注册，保存信息
        new UserModel({username,password:md5(password),type}).save((error,userDoc) => {
          if (error) {
            console.log(error);
          } else {
            const id = userDoc._id;
            // 将用户的id保存到cookie中
            res.cookie('userid', _id);
            //3，返回响应
            res.send({
              code: 0,
              data:{
                _id:id,
                username,
                type
              }
            })
          }

        })
      }
    }
  })
});

//定义登录路由  根据username和password来查询集合是否有存在
router.post('/login',function (req,res) {
  //1，获取请求参数 post:req.body
  const {username,password} = req.body;

  //2，处理数据
  UserModel.findOne({username,password: md5(password)},filter,function (error,userDoc) {
    if (userDoc) {
      // 如果有, 向cookie中保存userid, 返回一个成功的响应
      // 将用户的id保存到cookie中
      res.cookie('userid', userDoc._id);
      res.send({
        code:0,
        data: userDoc
      })
    } else {
      // 如果没有, 说明登陆不能成功, 返回一个失败的响应
      res.send({
        "code": 1,
        "msg": '用户名或者密码错误'
      })
    }
  })
});

module.exports = router;
