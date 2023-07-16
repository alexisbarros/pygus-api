const User = require('../models/users.model');

/**
 * Register user in db.
 * @param {*} req 
 * @param {*} res 
 */
exports.create = async (req, res) => {

    try {
        
        // Create user in database
        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin || false,
            birthday: req.body.birthday
        });

        // Create user data to return
        let userToFront = {
            _id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            birthday: user.birthday,
        };
        
        console.info('User created successfuly');
        return({
            data: userToFront,
            message: 'User created successfuly',
            code: 200
        });

    } catch(err) {

        console.error(err.message);
        return({
            data: {},
            message: err.message,
            code: 400
        });

    }

};

/**
 * Get one user by id.
 * @param {*} req 
 * @param {*} res 
 */
exports.readOne = async (req, res) => {

    try {
        
        // Get user by id
        let user = await User.findById(req.params.id);
        
        // Check if user was removed
        if(user._deletedAt) throw { message: 'User removed' };

        // Create user data to return
        let userToFront = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            birthday: user.birthday,
        };
        
        console.info('User returned successfully');
        return({
            data: userToFront,
            message: 'User returned successfully',
            code: 200
        });

    } catch(err) {

        console.error(err.message);
        return({
            data: {},
            message: err.message,
            code: 400
        });

    }

}

/**
 * Get all users.
 * @param {*} req 
 * @param {*} res 
 */
exports.readAll = async (req, res) => {

    try {
        
        // Get all users
        let users = await User.find({});

        // Filter user tha wasnt removed
        let usersToFront = users.filter(user => !user._deletedAt);

        // Create user data to return
        usersToFront = usersToFront.map(user => {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                birthday: user.birthday,
            };
        });
        
        console.info('Users returned successfully');
        return({
            data: usersToFront,
            message: 'Users returned successfully',
            code: 200
        });

    } catch(err) {

        console.error(err.message);
        return({
            data: [],
            message: err.message,
            code: 400
        });

    }

};

/**
 * Update a user.
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {

    try {
    
        // Update user data
        let user = await User.findByIdAndUpdate(req.params.id, { ...req.body });

        // Create user data to return
        let userToFront = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            birthday: user.birthday
        };
        
        console.info('User updated successfuly');
        return({
            data: userToFront,
            message: 'User updated successfuly',
            code: 200
        });

    } catch(err) {

        console.error(err.message);
        return({
            data: [],
            message: err.message,
            code: 400
        });

    }

};

/**
 * Delete a user.
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {

    try {
        
        // Delete user by id
        await User.findByIdAndUpdate(req.params.id, { _deletedAt: Date.now() });
    
        console.info('User deleted successfuly');
        return({
            data: {},
            message: 'User deleted successfuly',
            code: 200
        });
        
    } catch(err) {
        
        console.error(err.message);
        return({
            data: [],
            message: err.message,
            code: 400
        });

    }

};