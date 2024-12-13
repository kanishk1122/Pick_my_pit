const { default: mongoose } = require('mongoose');


const Post = mongoose.Schema({
    Owner : mongoose.Schema.Types.ObjectId,
    images :{
        type :Array,
        default : []
    },
    title : String,
    discription : String,
})