
const express =require('express')
const app=express();
const port=8080
const multer=require('multer')
const path=require("path")
const {db,genid} =require('./db/DbUtils')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//开放跨域请求
app.use(function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "*");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method == "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
  else next();
});
//Express中内置的中间件功能
app.use(express.json())
//上传功能
app.use(multer({
  //上传的临时目录
  dest:'./public/upload/temp'
}).any())
//指定静态资源路径
app.use(express.static(path.join(__dirname,"public")))
const ADMIN_TOKEN_PATH="/_token"
//所有接口
app.all("*",async(req,res,next)=>{
  if(req.path.indexOf(ADMIN_TOKEN_PATH)>-1){
    let {token}=req.headers
    // console.log(token)
    let admin_token_sql="select * from blog.admin where token=?"
    let adminResult=await db.async.query(admin_token_sql,[token])
    if(adminResult.err!=null||adminResult.rows.length==0){
      //没登录
      res.send({
        code:403,
        msg:"请先登录"
      })
      return
    }else{
      next()
    }
  }else{
    next()
  }
})
//注册路由
app.use('/test',require('./routers/TestRouter'))
app.use('/admin',require('./routers/AdminRouter'))
app.use('/category',require('./routers/CategoryRouter'))
app.use('/blog',require('./routers/BlogRouter'))
app.use('/upload',require('./routers/UploadRouter'))
app.get("/",(req,res)=>{
  res.send('hello')
})
app.listen(port,()=>{
  console.log(`启动成功：http://localhost:${port}/`)
})