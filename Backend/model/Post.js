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
        default : "free",
        index: true // Add index for better query performance
    },
    address : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
      },
    category : {
        type: String,
        trim: true,
        index: true,
    },
    species : {
        type: String,
        trim: true,
        lowercase: true, // Store in lowercase for consistent querying
        index: true
    },
    breed: {
        type: String,
        required: false,
        trim: true,
        lowercase: true, // Store in lowercase for consistent querying
        index: true
    },
    status : {
        type : String,
        default : "pending"
    },
    amount : {
        type: Number,
        min: 0,
        default: 0,
        index: true // Add index for price range queries
    }
})


// Add compound indexes for common filter combinations
PostSchema.index({ species: 1, category: 1 }); // category is now used as breed
PostSchema.index({ type: 1, amount: 1 });
PostSchema.index({ category: 1, type: 1 });

const Post = mongoose.model("Post", PostSchema);


module.exports = Post;