const jwt=require('jsonwebtoken')

const Reporter=require('../Models/Reporter')


const auth=async (req,res,next)=>{

   try{
         const token=req.header('Authorization')
         const decode=jwt.verify(token,process.env.JWT_SECRET)
         const reporter=await Reporter.findOne({_id:decode._id,tokens:token})
   
    if(!reporter)

       throw new Error('not Authorized')

    req.reporter=reporter
    req.token=token

    next()
   }
   catch(e){
       res.status(401).send("need Authenticate !")
   }
}

module.exports=auth 
