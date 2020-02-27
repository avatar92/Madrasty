const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SchoolsSchema=new Schema({
    admin:{
        type:Schema.Types.ObjectId,
        ref:"Users"
    },
    name:{
        type:String,
        required:true
    },
    administrationname:{
        type:String
    },
    logo:{
        type:Buffer,
        contentType:String
    },
    news:[
        {
            title:{
                type:String,
                required:true
            },
            content:{
                type:String,
                required:true
            },
            date:{
                type:Date,
                default:Date.now
            }
        }
    ],
    professorschedule:[
        {
            from:{
                type:Number,
                required:true,
                min:8,
                max:16
            },
            to:{
                type:Number,
                required:true,
                min:9,
                max:17
            },
            class:{
                type:String,
                required:true
            },
            professor:{
                type:Schema.Types.ObjectId,
                ref:"Users"
            }
        }
    ]
    
})
//studentschedule:[
    //{
        //from:{
            //type:Number,
            //required:true,
            //min:8,
          //  max:16
        //},
        //to:{
            //type:Number,
            //required:true,
            //min:9,
          //  max:17
        //},
        //subject:{
          //  type:String,
           // required:true
        //},
        //professor:{
        //    type:Schema.Types.ObjectId,
      //      ref:"Users"
    //    }
  //  }
//],
module.exports=Schools=mongoose.model('Schools',SchoolsSchema,"schools")