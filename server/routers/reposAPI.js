const express = require('express')
const path = require('path')
const router = express.Router()
const dbController = require(path.join(__dirname, '../controllers/dbController.js'))

router.get('/:name',
dbController.checkUser,
dbController.getAllUserRepos,
 (req, res) => {
    res.status(200).json(res.locals.allRepos);
})

router.get('/update/:name',
dbController.updateCheck,
(req, res) => {
    res.status(200).send('made it back from updateCheck');
})

router.get('/deleteuser/:name',
dbController.deleteUser,
(req, res) => {
    res.status(200).send('user deleted in db')
})

router.post('/',
dbController.linkVerify,
dbController.checkLink,
dbController.addLink,
dbController.updateUserRepos,
 (req, res) => {
    res.status(200).json(res.locals.ghLink);
    console.log(`${res.locals.ghLink} successfully added to link pool!`)
})


module.exports = router;