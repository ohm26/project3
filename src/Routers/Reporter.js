const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { findByIdAndDelete } = require("../Models/Reporter");
const multer=require('multer')

const Reporter = require("../Models/Reporter");
const News = require("../Models/News");



router.post("/reporter/signup", async (req, res) => {
  try {
    const reporter = new Reporter(req.body);
    const token = await reporter.generateToken();
    res.status(200).send({ reporter, token });

  } catch (error) {
    res.status(400).send(error.message);
  }
});
//////////////////////////////////////////////////////////////////////////////////
router.post('/reporter/login',async(req,res)=>{
    try{
        const reporter=await Reporter.findByCredentials(req.body.email,req.body.password)
        if(reporter)
            {
                await reporter.generateToken()
                res.status(200).send(reporter)
            }
    }
    catch(e){
        res.status(400).send(e.message)
    }
})
////////////////////////////////////////////////////////////////////////
router.get("/reporter/profile", auth, async (req, res) => {
  res.status(200).send(req.reporter);
});
/////////////////////////////////////////////////////////////////////////
router.delete('/reporter/logout',auth,async(req,res)=>{
    try{
        req.reporter.tokens=req.reporter.tokens.filter((token)=>token !==req.token)
        req.reporter.save()
        res.status(200).send('Loged out successfully :) ')
       }
    catch(e){
        res.status(500).send(e.message)
    }
})
///////////////////////////////////////////////////////////////////////////////
router.delete('/reporter/logoutAll',auth,async(req,res)=>{
    try{
        req.reporter.tokens=[]
        req.reporter.save()
        res.status(200).send('Loged out successfully :) ')
       }
    catch(e){
        res.status(500).send(e.message)
    }
})
///////////////////////////////////////////////////////////////////////////////
router.patch('/reporter/update',auth,async(req,res)=>{
    try{
        const updates=Object.keys(req.body)
        updates.forEach(value=>{
            req.reporter[value]=req.body[value]
        })
        await req.reporter.save()
        res.status(200).send(req.reporter)
    }
    catch(error){
        res.status(400).send(error.message)
    }
})
////////////////////////////////////////////////////////////////////////////////////
router.delete('/reporter/delete',auth,async(req,res)=>{
    try{
        const _id=req.reporter._id
        const reporter=await Reporter.findByIdAndDelete(_id)
        res.status(200).send({reporter,Deleted:true})
    }
    catch(error){
        res.status(400).send(error.message)
    }
})
//////////////////////////////////////////////////////////////////////////////////
const upload=multer({
   
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jif)$/))
          return cb( new Error('please  insert valid img extension '))
        cb(null,true)
    },
    limits:{
        fileSize:2000000
    }
})

////////////////////////////////////////////////////////////////////////////////////
router.post('/reporter/avatar',auth,upload.single('avatar'),async(req,res)=>{
    try{
        req.reporter.avatar=req.file.buffer
        await req.reporter.save()
        res.status(200).send("Avatar is here now "+req.reporter)
    }
    catch(error){
        res.status(400).send(error.message)
    }

})
/////////////////////////////////////////////////////////////////////
router.delete('/reporter/deleteAvatar',auth,async(req,res)=>{
    try{
        req.reporter.avatar=null
        await req.reporter.save()
        res.status(200).send("Avatar gone now "+req.reporter)
    }
    catch(error){
        res.status(400).send(error.message)
    }
})
/////////////////////////////////////////////////////////////////////////////
router.get('/reporter/getAll',auth,async(req,res)=>{
    try{
        const allrep=await Reporter.find({})
        if(!allrep) return res.send(404).send('Cannot find news')
        res.status(200).send(allrep)
    }
    catch(error){
        res.status(400).send(error.message)
    }
})
////////////////////////////////////////////////////////////////////////////////////
router.get('/reporter/getbyID/:id',auth,async(req,res)=>{
    try{
        const rep=await Reporter.findOne({_id:req.params.id})
        if(!rep) return res.send(404).send('Cannot find news')
        res.status(200).send(rep)
    }
    catch(error){
        res.status(400).send(error.message)
    }
})


module.exports = router;
