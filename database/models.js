//Création de Models, Schemas, connection à MongoDB

const mongoose = require('mongoose');

//Or : {Schema} = mongoose
const mgo_schemas = mongoose.Schema; 

//Or: {ObjectId} = Schema
const mgo_objId = mgo_schemas.ObjectId; 


const connectDb = async() =>{
    try {
        let uri = 'mongodb://lamtan:lamtan@localhost:27018/mongoex';
        let options = {
            connectTimeoutMS: 10000, //10s
            useNewUrlParser: true, //su dung string nay de ket noi
            useCreateIndex: true, //indexation pour accélérer la recherche des collections    
            useUnifiedTopology: true
        }
        await mongoose.connect(uri, options);
        console.log('Connect Mongo Database OK');
    } catch (error) {
        console.log(`Connect Mongo Database KO, error:  ${error}`);
    }
}

connectDb();

//Shemas de la collection <User>
const UserSchema = new mgo_schemas({
    name: {type: String, default: 'unknown'},
    age: {type: Number, min: 18, index: true},
    email: {type: String, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/},

    //Quan he giua 2 ban: User - BlogPost(1 - n)
    blogPosts: [{type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost'}]
});

//Schema BlogPost
const BlogPostSchema = new mgo_schemas({
    title: {type: String, default: 'Haha'},
    content: {type: String, default: ''},
    date: {type: Date, default: Date.now},
    
    //Quan he giua 2 ban: BlogPost - User (1 - 1)
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]

});

/*
User -> Comments (1 - n)
Comment -> User (1 - 1)

BlogPost -> Comments (1-n)
Product -> Comments (1-n)

//Dynamic Ref:
Comment -> BlogPost ou Product (1 - 1)

*/
//Shcema Product
const ProductSchema = new mgo_schemas({
    name: {type: String, default: ''},
    yearOfProduction: {type: Number, min: 2000},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

//Schema Comment
const CommentSchema = new mgo_schemas({
    body: {type: String, require: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    //Dynamic ref
    commentOn: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        require: true,
        enum: ['BlogPost', 'Product']
    }
})



//Schema -> Model (bean)
const User = mongoose.model('User', UserSchema);
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
const Product = mongoose.model('Product', ProductSchema);
const Comment = mongoose.model('Comment', CommentSchema);

// Or: module.exports = {User};
module.exports = {User, BlogPost, Product, Comment}; 
