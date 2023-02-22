const bcrypt = require('bcrypt');
const User = require('../model/userModel');
const Cohort = require('../model/cohortModel');
const { findOneAndUpdate } = require('../model/cohortModel');



const userController = {

    async signup(req, res, next) {
        try {
            const user = await new User(
                {
                    username: req.body.username,
                    password: req.body.password,
                    cohort: req.body.cohort,
                    isAdmin: req.body.isAdmin
                });

            user.save();
            const cohort = await Cohort.findOneAndUpdate(
                { cohort: req.body.cohort },
                { $push: { students: user } },
                { new: true }
            );
            res.locals.user = user;
            res.locals.cohort = cohort;
            return next()


        } catch (err) {
            return next({
                log: `err: ${err}`,
                status: 500,
                message: { err: 'error in usercontroller.signup middleware' }
            })
        }
    },

    async login(req, res, next) {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username })
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.locals.user = user;
            return next();
        } else {
            return next({ error: "try again" })
        }
    },

    async addpoint(req, res, next) {
        try {
            const user = await User.findOneAndUpdate(
                { username: req.body.username },
                { $inc: { participation: 1 } },
                { new: true }
            );
            user.save();
            //possibly redirect to signup page with then

            res.locals.user = user;
            return next()
        } catch (err) {
            return next({
                log: `err: ${err}`,
                status: 500,
                message: { err: 'error in usercontroller.addpoint middleware' }
            })
        }
    },

    async delete(req, res, next) {
        try {
            const cohort = await Cohort.findOneAndUpdate(
                { cohort: req.params.cohort },
                { $pull: { students: { username: req.body.username },  chosen: { username: req.body.username }  }},
    
                { new: true })
            await User.deleteOne({ username: req.body.username })
    
            res.locals.cohort = cohort;
            console.log(`user: ${req.body.username} has been deleted`)
            return next();
        } catch (err) {
            return next({
                log: `err: ${err}`,
                status: 500,
                message: { err: 'error in usercontroller.delete middleware' }
            })
        }
    }



}

module.exports = userController;






















// const User = require('../model/userModel');

// const userController = {}

// userController.signUp = async function (req, res, err, next){
//     const { username, password } = req.body;
//     if (!username || !password) (err) => next(err);
//     const user = await new User({
//         username: req.body.username,
//         password: req.body.password,
//         cohortNumber: req.body.cohortNumber

//     });
//     await user.save()
//     res.locals.user = user

//     return next()
// }

// userController.addOne = async function(req, res, next) {
//     const user = await User.findOneAndUpdate(
//         { username: req.body.username },
//         { $inc: { participation: 1 } },
//         { new: true }
//     )
//     res.locals.user = user
//     return next()
// }




// module.exports = userController;