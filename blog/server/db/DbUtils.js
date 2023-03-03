//连接数据库
// 1.导入mysql模块
const mysql = require('mysql')
// const { param } = require('../routers/TestRouter')
// 导入雪花ID
const GenId=require('../utils/SnowFlake')
// 2.连接MySQL数据库
const db = mysql.createPool({
    host: '127.0.0.1', //数据库的ip地址
    user: 'root', //登录数据库的账号
    password: '111111', //登录数据库的密码
    datebase: 'blog' //指定要操作那个数据库
})
//Promise封装，解决回调地狱
db.async={}
db.async.query=(sql,params)=>{
  return new Promise((resolve,reject)=>{
    db.query(sql,params,(err,rows)=>{
      resolve({err,rows})
    })
  })
}


const genid=new GenId({WorkerId:1})
module.exports={db,genid}