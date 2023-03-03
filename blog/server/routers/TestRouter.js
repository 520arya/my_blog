const express =require('express')
const router=express.Router()
const {db,genid} =require('../db/DbUtils')
router.get('/test',async(req,res)=>{
  // 删id=3的人
 /*  await db.async.query('delete from blog.admin where id=?',[3]).then((res)=>{
    if(res.rows.affectedRows === 1) {
      console.log('删除数据成功');
    }
  }) */

  //插入数据
  /* await db.async.query('insert into blog.admin set ? ', {id:1, account: 'bob', password:'123456' }).then((res)=>{
    if(res.rows.affectedRows === 1) {
      console.log('插入数据成功');
    }
  }) */

  //修改数据
  /* await db.async.query('update blog.admin set ? where id=?', [{id:1, account: 'arya', password:'123456' }, 1]).then((res)=>{
    if(res.rows.affectedRows === 1) {
      console.log('修改数据成功');
    }
  })  */

  //查询admin表所有数据
  let out =await db.async.query('select * from blog.admin',[]) 
  res.send({
    id:genid.NextId(),
    out
  })
})
module.exports=router