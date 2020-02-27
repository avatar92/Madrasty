const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UsersSchema=new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:Buffer,
        contentType:String
    },
    role:{
        type:String,
        required:true
    },
    school:{
        type:Schema.Types.ObjectId,
        ref:"Schools"
    }
})

module.exports=Users=mongoose.model('Users',UsersSchema,"users")