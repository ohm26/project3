const mongoose=require('mongoose')
const time$date = require('mongoose-timestamp')
const newsSchema=new mongoose.Schema({

    title:{
        type:String,
        required:true,
        unique:true
    },

    description:{
        type:String,
        required:true
    },

    reporter:{
        type:mongoose.Types.ObjectId,
        required:true,
        
    },
    
    img:{
        type:Buffer
    }
},
time$date
)

const News=mongoose.model('News',newsSchema)
module.exports=News