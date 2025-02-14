const { default: mongoose } = require("mongoose");
const AddressSchema = require('./Address.js')


const PostSchema = mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        require : true,
    },
    images :{
        type :Array,
        default : []
    },
    title : String,
    discription : String,
    date :{
        type : Date,
        default : Date.now()
    },
    type : {
        type :String,
        enum : ["free", "paid"],
        default : "free"
    },
    address : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
      },
    category : String,
    species : String,
    status : {
        type : String,
        default : "pending"
    },
    amount : Number,
})

const Post = mongoose.model("Post", PostSchema);


module.exports = Post;