const { linkSync } = require('fs');
const path = require('path')
const { User, Link } = require(path.join(__dirname, '../../db_models/models.js'))

const dbController = {};

dbController.getAllUserRepos = (req, res, next) => {
    // get every single repo link

    console.log('made it to line 1 getAllRepos')
    const { name } = req.params;

    User.findOne({ name: name })
    .then((results) => {
        res.locals.allRepos = results;
        return next();
    })
    .catch((err) => {
        const newErr = {
            log: 'Error in controller getting specific user unstarred repos',
            message: { err: 'problem retrieving repos at this time'}
        }
        return next(newErr);
    }) 
}
// !!!! DONT FORGET TO UPDATE REPOS LATER
//     User.updateMany({ name: req.body.user}, {$set: { beenStarred: true }})
//     .then((res) => {
//         console.log('made it inside updateMany part of getAllRepos');
//         console.log('res from updateMany', res);
//         return next();
//     })
//     .catch((err) => {
//         const newErr = {
//             log: 'Error in controller getAllUserRepos with updateMany',
//             message: { err: 'problem retrieving repos at this time'}
//         }
//         return next(newErr);
//     })
// })

dbController.updateCheck = (req, res, next) => {
    // update all the repos to beenStarrred: true
    const { name } = req.params;

    User.updateOne({ name: name }, {$set: { repos: [] } })
    .then((res) => {
        console.log('userRepos have been updated');
        console.log('res of that operation: ', res);
        return next();
    })
    .catch((err) => {
        const newErr = {
            log: 'Error in cont updateUserRepos',
            message: { err: 'problem retrieving repos at this time'}
        }
        return next(newErr);
    })

}

dbController.linkVerify = (req, res, next) => {
    // verify the link we're adding to the link pool is a valid gh repo link
    const ghLink = req.body.link;
    const strArr = ghLink.split('/');
    const secretWord = req.body.secret
    if (strArr[0] === 'https:' && strArr[1] === '' && strArr[2] === 'github.com' && strArr[3] && strArr[4] && secretWord === process.env.SECRET) {
        res.locals.ghLink = ghLink;
        return next();
    } else {
        const newErr = {
            log: 'Error in controller link verification'
        }
        return next(newErr);
    }
}

dbController.addLink = (req, res, next) => {
    // add link to the link pool
    const newLink = new Link({
        link: req.body.link
    })
    res.locals.newLink = newLink;
    newLink.save()
    .then((res) => {
        console.log('saved new link correctly');
        return next();
    })
    .catch((err) => {
        const newErr = {
            log: 'Error in controller adding link'
        }
        return next(newErr);
    })
}

dbController.checkLink = (req,res,next) => {
    const ghLink = req.body.link;
    Link.find({ link: ghLink })
    .then((res) => {
        if (res.length === 0) {
            return next();
        } else {
            const newErr = {
                log: 'Error, link already exists in repo pool!',
                message: { err: 'Link already exists in repo pool!'}
            }
            return next(newErr);
        }
    })
    .catch((err) => {
        const newErr = {
            log: 'Error in controller check link'
        }
        return next(newErr);
    })
}

dbController.checkUser = (req,res,next) => {
    const { name } = req.params
    console.log('req.params is', req.params)

    User.find({ name: name })
    .then((res) => {
        if (res.length === 0) {
            const newUser = new User({
                name: name
            })
            User.create({ name: name })
            .then((res) => {
                Link.find()
                .then((allLinks) => {
                    User.updateOne({ name: name }, { repos: allLinks})
                    .then((res) => {
                        console.log('updated repos with updateOne')
                        return next();
                    })
                    .catch((err) => {
                        return next(err)
                    })
                })
                .catch((err) => {
                    const newErr = {
                        log: 'Error, something in populating users repos gone wrong',
                    }
                    return next(newErr);
                })
            })
            .catch((err) => {
                const newErr = {
                    log: 'Error, saving user in checkUser failed',
                }
                return next(newErr);
            })
        } else {
            return next();
        }
    })
    .catch((err) => {
        const newErr = {
            log: 'Error, gone awry in checkUser user.find, user may not exist',
        }
        return next(newErr);
    })
}

dbController.updateUserRepos =  (req, res, next) => {

    User.updateMany({}, {$push: {repos: res.locals.newLink}})
    .then((res) => {
        console.log('result from updateMany', res);
        return next();
    })
    .catch((err) => {
        const newErr = {
            log: 'Error, its all gone wrong in cont updateRepos goodluck',
            message: { err: 'something wrong updating all the repos'}
        }
        return next(newErr);
    })

}

dbController.deleteUser = (req, res, next) => {
    const { name } = req.params;

    User.findOneAndDelete({ name: name })
    .then((res) => {
        return next()
    })
    .catch((err) => {
        const newErr = {
            log: 'Error, something wrong in cont deleteUser',
            message: { err: 'something wrong deleting user'}
        }
        return next(newErr);
    })
}

module.exports = dbController;