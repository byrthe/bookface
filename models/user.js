const mongoose = require('mongoose');
const UserSchema  = new mongoose.Schema({
  name :{
      type  : String,
      required : true
  } ,
  email :{
    type  : String,
    required : true
    } ,
    password :{
        type  : String,
        required : true
    } ,
    birthdate :{
        type : String,
        required: true
    },
    date :{
        type : Date,
        default : Date.now
    }
});



const User= mongoose.model('User',UserSchema);

// to search:
// db.users.createIndex( { name: "text", description: "text" } )


module.exports = User;