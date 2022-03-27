const express=require('express')
const router=express.Router()
const News=require('../Models/News')
const auth=require('../middleware/auth')
const multer=require('multer')




router.post('/news/add',auth,async(req,res)=>{
    try{
        const news=News({...req.body,owner:req.reporter._id})
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})
////////////////////////////////////////////////////////////////////
router.get('/news/getAll',auth,async(req,res)=>{
    try{
        await req.reporter.populate('News')
        res.status(200).send(req.reporter.News)
    }
    catch(error){
        res.status(400).send("error"+error.message)
    }
})
////////////////////////////////////////////////////////////////////////////////
router.get('/news/getbyID/:id',auth,async(req,res)=>{
try{
    const _id=req.params.id
    const news=await News.findOne({_id,owner:req.reporter._id})
    if(!news) return res.status(404).send('Cannot find the news')
    res.status(200).send(news)
}
catch(error){
    res.status(400).send(error.message)
}
})
////////////////////////////////////////////////////////////////////////////
router.delete('/news/deletebyID/:id',auth,async(req,res)=>{
    try{
        const _id=req.params.id
        const news=await News.findOneAndDelete({_id,owner:req.reporter._id})
        if(!news) return res.status(404).send('Cannot find news')
        res.status(200).send(news.title+" --> is Deleted Successfuly :)")
    }
    catch(error){
        res.status(400).send(error.message)
    }
})
////////////////////////////////////////////////////////////////////////////////
router.get('/news/owner/:id',auth,async(req,res)=>{
    try{
        const _id=req.params.id
        const news=await News.findOne({_id,owner:req.reporter._id})
        if(!news) return res.status(404).send('Cannot find news !')
        await news.populate('owner')
        res.status(200).send(news.owner)
    }
    catch(error){
        res.status(400).send(error.message)
    }
})
/////////////////////////////////////////////////////////////////////////////
const upload=multer({
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jif)$/))
          return cb( new Error('please  insert valid img extension'))
        cb(null,true)
    },
    limits:{
        fileSize:2000000
    }
})
//////////////////////////////////////////////////////////////////////////

router.post('/news/img/:id',auth,upload.single('image'),async(req,res)=>{
    try{
        const _id=req.params.id
        const news=await News.findOne({_id,owner:req.reporter._id})
        if(!req.file) return res.status(400).send('please insert image')
        if(!news) return res.status(404).send('Cannot find news')
        news.image=req.file.buffer
        news.save()
        res.status(200).send("image is here now ")

    
    }
    catch(error){
        res.status(400).send(error.message)
    }

})


router.delete('/news/img/:id',auth,upload.single('image'),async(req,res)=>{
    try{
        const _id=req.params.id
        const news=await News.findOne({_id,owner:req.reporter._id})
        if(!news) return res.status(404).send('Cannot find news')
        news.image=null
        news.save()
        res.status(200).send("Image done now ")
    }
    catch(error){
        res.status(400).send(error.message)
    }

})


  
router.patch('/news/update/:id',auth,async(req,res)=>{
    try{
        const _id=req.params.id
        const updates=Object.keys(req.body)
        const news=await News.findOne({_id,owner:req.reporter._id})
        if(!news) return res.status(404).send('Cannot find news')
        updates.forEach(update=>{
            news[update]=req.body[update]
        })
        news.save()
        res.status(200).send(news)
    }
    catch(error){
        res.status(400).send(error.message)
    }
})


module.exports=router