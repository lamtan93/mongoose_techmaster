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
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});


//Schema -> Model (bean)
const User = mongoose.model('User', UserSchema);
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

// Or: module.exports = {User};
module.exports = {User, BlogPost}; 
