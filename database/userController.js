const {User, BlogPost, Product, Comment} = require('./models'); 
const {ObjectId} = require('mongoose').Types;

const insertUser = async(name, age, email) => {
    try {
        const newUser = new User();
        newUser.name = name;
        newUser.age = age;
        newUser.email = email;
        await newUser.save();
        console.log(`[insertUser]success : ${newUser}`);
    } catch (error) {
        console.log(`[insertUser]erreur : ${error}`);
    }
};


const deleteAllUsers = async() =>{
    try {
        await User.deleteMany();
        console.log('[deleteAllUsers]success :');
    } catch (error) {
        console.log(`[deleteAllUsers]erreur: ${error}`);
    }
};

//Chercher par _id
const findUserById = async(id)=>{
    try {
        let foundUser = await User.findById(id);
        if(foundUser !== null){
            console.log(`[findUserById] OK: ${JSON.stringify(foundUser)}`)
        }else{
            console.log(`[findUserById] user not found`)
        }
        
    } catch (error) {
        if(error.name === 'CastError'){
            console.log(`_id de user est incorrect`);
        }else{
            console.log(`[findUserById] erreur : ${JSON.stringify(error)}`);
        }  
    };
};

//Find and Filter
const findSomeUsers = async () =>{
    try {
        let foundUsers = await User.find(
//afficher tous les enrs
            {},              
//Filter par name qui contient Corgi2* et age > 23, i : non sensible à la case
            //{age: {$gte: 23}, name: /gi/i},
//OR: {'name':1, 'email': 1}
            ['name', 'age'], //n'afficher que les champs name et email
            {
                sort: {           
                    name: 1       //classer par age décroissant
                }
            },//Pagination
        ).skip(3*2).limit(2)

        foundUsers.forEach(element => {
            console.log(`[findSomeUsers] OK: ${JSON.stringify(element)}`)
        });
        console.log(`Total: ${foundUsers.length}`);
    } catch (error) {
        console.log(`[findSomeUsers]erreur: ${error}`);
    }
};


//Update User
const updateUser = async(_id, name, age, email)=>{
    try {
        let newUser = {};
        //Neu 1 trong nhung thong tin khong nhap thi khong update
        if(name !== undefined){
            newUser.name = name;
        };

        if(age !== undefined){
            newUser.age = age;
        };

        if(email !== undefined){
            newUser.email = email;
        }
        
        let updatedUser = await User.findOneAndUpdate(
            {_id: ObjectId(_id)},
            newUser
        );

        if(updatedUser){
            console.log(`[updateUser]OK: ${JSON.stringify(updatedUser)}`);
        }else{
            console.log(`[updateUser]user not found: ${_id}`);
        }
        
    } catch (error) {
        console.log(`[updateUser]erreur: ${error}`);
    }
};

//Delete user by Id
const deleteUserById = async (_id)=>{
    try {
        let deleteUserById = await User.deleteOne({
            _id: ObjectId(_id)
        })
        console.log(`[deleteUserById]OK: ${JSON.stringify(deleteUserById)}`);
    } catch (error) {
        console.log(`[deleteUserById]erreur: ${error}`);
    }
}

//Taọ 1 user, user này viết 5 bài posts.
const createSomeUsersAndPosts = async()=>{
    try {
        let author1 = new User({
            name: 'Victor Hugo',
            age:  82,
            email: 'VictoHugo@gmail.com',
            blogPosts:  []
        });
        
        //-------------1--------------
        let blogPost1 = new BlogPost({
            title: 'Les Misérables',
            content: 'Les misérables de la terre se retrouve dans une maison heureuse',
            date: Date.now(),
            author: author1
        });

        await blogPost1.save();
        await author1.blogPosts.push(blogPost1);
        await author1.save();

        //-------------2--------------
        let blogPost2 = new BlogPost({
            title: 'Apple Iphone 2017',
            content: 'Présentation Iphone 2017',
            date: Date.now(),
            author: author1
        });

        await blogPost2.save();
        await author1.blogPosts.push(blogPost2);
        await author1.save();

        //-------------3--------------
        let blogPost3 = new BlogPost({
            title: 'Apple Iphone 2018',
            content: 'Présentation Iphone 2018',
            date: Date.now(),
            author: author1
        });

        await blogPost3.save();
        await author1.blogPosts.push(blogPost3);
        await author1.save();

        //-------------4--------------
        let blogPost4 = new BlogPost({
            title: 'Apple Iphone 2019',
            content: 'Présentation Iphone 2019',
            date: Date.now(),
            author: author1
        });

        await blogPost4.save();
        await author1.blogPosts.push(blogPost4);
        await author1.save();


        console.log('[createSomeUsersAndPosts]create author1 OK');
    } catch (error) {
        console.log(`[createSomeUsersAndPosts]error: ${error}`)
    }
};

//Case study: Hiện danh sách Users kèm chi tiết các bài BlogPosts
//Cần Join 2 bảng user và blogpost
const populateUsers = async ()=>{
    try {
        let findUsers = await User.find({
            age: {$gte: 20}
        },['name', 'age']).populate({
            path: 'blogPosts', //afficher en détail le tableau blogPosts de User
            select: ['title', 'content'], //N'affiche que les champs title et content
            //Filter les résultats du tableau blogPosts de User
            match: {content: /Iphone/i},
            options: {limit: 2}
        }).exec();

        findUsers.forEach(user => {
            console.log(`[populateUsers] OK: ${user}`);    
        });
        
    } catch (error) {
        console.log(`[populateUsers] error : ${error}`);
    }
};

//BlogPosts -> User
const populateBlogPosts = async ()=>{
    try {
          let blogPosts = await BlogPost.find(
              {title: /Apple/i}, //Filter something
              ['title', 'author']
          ).populate({
              path: 'author',
              select: ['name', 'age'],
          }).exec();

          for (const b of blogPosts) {
              console.log(`\n [populateBlogPosts] OK: ${b} \n`);
          }
    } catch (error) {
        console.log(`[populateBlogPosts] error : ${error}`);
    }
};

const populateComments = async () =>{
    try {
        //Get the user Victo_Hugo
        let user_VictorHugo = await User.findById('5eb626a082d0f04dc04f2207');
        
        //userVictor ecrit un commentaire sur un BlogPost Les Miserables
        let blogPost_miserables = await BlogPost.findById('5eb626a082d0f04dc04f2208');

        //console.log(`user_VictorHugo: ${user_VictorHugo}
        //           \n blogPost_miserables: ${blogPost_miserables}`);
        
        //Model.Create({}) -> method static != new Model().save()
        //comment1 created by user_VictoHugo dans un blogPost_miserable
        let comment1 = await Comment.create({
            body: `It's a very interingting book`,
            author: user_VictorHugo,
            commentOn: blogPost_miserables,
            onModel: 'BlogPost'
        });

        blogPost_miserables.comments.push(comment1);
        await comment1.save();
        await blogPost_miserables.save();

        //comment2 created by user_VictoHugo dans un product_iphone
        let product_iphone = await Product.create({
            name: 'iphone 2019',
            yearOfProduction: 2019,
        });
        let comment2 = await Comment.create({
            body : 'A fanstatic iphone\'s 2019',
            author: user_VictorHugo,
            commentOn: product_iphone,
            onModel: 'Product'
        });

        product_iphone.comments.push(comment2);
        await comment2.save();
        await product_iphone.save();
        
        console.log('[populateComments] Operation success');

    } catch (error) {
        console.log(`[populateComments] error : ${error}`);
    }
};


module.exports = {
    insertUser, 
    deleteAllUsers,
    findUserById,
    findSomeUsers,
    updateUser,
    deleteUserById,
    createSomeUsersAndPosts,
    populateUsers,
    populateBlogPosts,
    populateComments
};