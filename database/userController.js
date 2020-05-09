const {User} = require('./models'); 
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


module.exports = {
    insertUser, 
    deleteAllUsers,
    findUserById,
    findSomeUsers,
    updateUser,
    deleteUserById
};