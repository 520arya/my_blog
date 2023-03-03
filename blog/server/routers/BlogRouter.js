const express =require('express')
const router=express.Router()
const {db,genid} =require('../db/DbUtils')
//获取单篇文章
router.get("/detail",async(req,res)=>{
  let {id}=req.query
  let detail_sql="select * from blog.blog where id=?"
  let {err,rows}=await db.async.query(detail_sql,[id])
  if(err==null){
    res.send({
      code:200,
      msg:'获取成功',
      rows
    })
  }else{
    res.send({
      code:500,
      msg:'获取失败'
    })
  }  
})
//添加接口
router.post('/_token/add',async(req,res)=>{
  let {title,categoryId,content}=req.body
  let id=genid.NextId()
  let create_time=new Date().getTime()
  const insert_sql='insert into blog.blog (id,title,category_id,content,create_time) values(?,?,?,?,?) '
  let params=[id,title,categoryId,content,create_time]
  let {err,rows}=await db.async.query(insert_sql,params)
  if(err==null){
    res.send({
      code:200,
      msg:'添加成功',
    })
  }else{
    console.log(req.body)
    res.send({
      code:500,
      msg:'添加失败'
    })
  }  
})
//修改接口
router.put('/_token/update',async(req,res)=>{
  let {id,title,categoryId,content}=req.body
  let create_time=new Date().getTime()
  const update_sql='update blog.blog set title=?,category_id=?,content=? where id=? '
  let params=[title,categoryId,content,id]
  let {err,rows}=await db.async.query(update_sql,params)
  if(err==null){
    res.send({
      code:200,
      msg:'修改成功',
    })
  }else{
    console.log(req.body)
    res.send({
      code:500,
      msg:'修改失败'
    })
  }  
})

//删除接口
router.delete('/_token/delete',async(req,res)=>{
  let id=req.query.id
  const delete_sql='delete from blog.blog where id=?'
  let {err,rows}=await db.async.query(delete_sql,[id])
  if(err==null){
    res.send({
      code:200,
      msg:'删除成功',
    })
  }else{
    res.send({
      code:500,
      msg:'删除失败'
    })
  }  
})

//查询接口(keyword关键字、categoryId分类、page/pageSize分页)
router.get('/search',async(req,res)=>{
  let {keyword,categoryId,page,pageSize}=req.query
  page=page==null?1:page
  pageSize=pageSize==null?10:parseInt(pageSize)
  categoryId=categoryId==null?0:categoryId
  keyword=keyword==null?"":keyword
  let params=[]
  let whereSqls=[]
  if(categoryId!=0){
    whereSqls.push(" category_id=? ")
    params.push(categoryId)
  }
  if(keyword!=""){
    whereSqls.push(" (title like ? or content like ?) ")
    params.push("%"+keyword+"%")
    params.push("%"+keyword+"%")
  }
  let whereSqlStr=""
  if(whereSqls.length>0){
    whereSqlStr="where" + whereSqls.join(" and ")
  }
  //查分页数据
  let searchSql="select id,category_id,title,create_time,left(content,500) as content from blog.blog "+whereSqlStr+" order by create_time desc limit ?,?"
  let searchSqlParams=params.concat([(page-1)*pageSize,pageSize])
  let searchResult=await db.async.query(searchSql,searchSqlParams)

  //查数据总数
  let searchCountSql=" select count(*) as count from blog.blog "+whereSqlStr
  let searchCountParams=params
  let countResult=await db.async.query(searchCountSql,searchCountParams)
  // console.log(countResult)
  // console.log(searchResult)
  if(searchResult.err==null&&countResult.err==null){
    res.send({
      code:200,
      msg:"查询成功",
      data:{
        keyword,
        categoryId,
        page,
        pageSize,
        rows:searchResult.rows,
        count:countResult.rows[0].count
      }
    })
  }else{
    res.send({
      code:500,
      msg:"查询失败"
    })
  }
  
})


module.exports=router