
const DB = require("./Config");
const mongoose = require("mongoose");

const docSchema  = ({
    name:{type:String,require:true},
    email:{type:String,require:true,unique:true,match:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},
    phone:{type:String,require:true,unique:true},
    password:{type:String,default:null, require},
    is_active:{type:Boolean,default:false},
    created_at:{type:Date,default:Date.now()},
    updated_at:{type:Date,default:Date.now()},
    deleted_at:{type:Date,default:null}
  });

  const User = DB.model("User",docSchema);
  User.once("index",err => (err ? console.log("perThreeSixPos Models index error : ", err) : ''));

  module.exports = User;