const mongoose=require('mongoose')
const validator=require('validator')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const time$date = require('mongoose-timestamp')

const reporterSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
            throw new Error('Please enter a valid E-mail')
        }
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        validate(value){
            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            if(!strongRegex.test(value))
            throw new Error('Enter A Strong Passowrd that contains at least 1 special character, 1 Lowercase, 1 Uppercase,1 Number, and min length is 8 characters')
        }
    },
    phonenumber:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isMobilePhone(value,'ar-EG'))
              throw new Error('Please enter  number start with +20')
        }
    },
    avatar:{
        type:Buffer
    },
    tokens:[{
        type:String,
        required:true
    }]
},
 
time$date
)

reporterSchema.pre('save',async function(){
    const reporter=this
    if(reporter.isModified('password'))
    {
        const hashedPassword=await bcryptjs.hash(reporter.password,8)
        reporter.password=hashedPassword
    }
})

reporterSchema.statics.findByCredentials=async function(email,password){

    const reporter=await Reporter.findOne({email})
    if(reporter){
        const pass=await bcryptjs.compare(password,reporter.password)
        if(pass)
         return reporter
        else
          throw new Error('Wrong Password')
    } 
    throw new Error('Can not find needed')
}

reporterSchema.methods.generateToken= async function(){
    const reporter=this
    const token= jwt.sign({_id:reporter._id.toString()},process.env.JWT_SECRET)
    reporter.tokens=reporter.tokens.concat(token)
    await reporter.save()
    return token
}

reporterSchema.methods.toJSON= function(){
    const reporter=this
    const reporterObj=reporter.toObject()
    delete reporterObj.password
    delete reporterObj.tokens
    return reporterObj
}

reporterSchema.virtual('News',{
    ref:'News',
    localField:'_id',
    foreignField:'owner'
})

const Reporter=mongoose.model('Reporter',reporterSchema)
module.exports=Reporter