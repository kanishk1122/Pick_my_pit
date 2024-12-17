const { default: mongoose } = require("mongoose");


const Post = mongoose.Schema({
    Owner : mongoose.Schema.Types.ObjectId,
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
        enum : ["free", "paid"]
    },
    category : String,
    species : String,
    status : String,
    amount : Number,
})