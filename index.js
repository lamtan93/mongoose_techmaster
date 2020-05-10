const {
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
} = require('./database/userController');

//Inserer les users dans la base
/*
insertUser('Corgi18', 18, 'corgi18@gmail.com');
insertUser('Corgi19', 19, 'corgi19@gmail.com');
insertUser('Corgi20', 20, 'corgi20@gmail.com');
insertUser('Corgi21', 21, 'corgi21@gmail.com');
insertUser('Corgi22', 22, 'corgi22@gmail.com');
insertUser('Corgi23', 23, 'corgi23@gmail.com');
insertUser('Corgi24', 24, 'corgi24@gmail.com');
*/

//Delete all users(enregistrements) de la collection User(table)
//deleteAllUsers();

//findUserById('5eb602297d32f636e479a123456');
//findSomeUsers();

//updateUser('5eb602297d32f636e479aec3', 'Corgi188',18,'Corgi188@gmail.com');
//deleteUserById('5eb602297d32f636e479aec3');

//createSomeUsersAndPosts();

//populateUsers();
//populateBlogPosts();
populateComments();