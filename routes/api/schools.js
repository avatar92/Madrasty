const express=require('express');
const router=express.Router();


router.get('/',(req,res)=>{
    res.json({msg:'hello schools'});
})

module.exports=router;