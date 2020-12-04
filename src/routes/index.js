const { Router } = require('express');
const router = Router();

const User = require('../models/User');

const jwt = require('jsonwebtoken')

router.get('/', (req,res) => res.send('Hello World'))

router.post('/signup', async (req,res) => {
    const { user, password } = req.body;
    const newUser = new User({ user, password});
    await newUser.save();
   
    const token = jwt.sign({ _id: newUser._id }, 'secretkey')

    res.status(200).json({ token })
})

router.post('/signin', async (req,res) => {

    const { user, password } = req.body;
    const nUser = await User.findOne({user})
    if (!nUser) return res.status(401).send("The User doesn't exists.");
    if (nUser.password !== password) return res.status(401).send("Wrong Password.");

    const token = jwt.sign({_id: user._id}, 'secretkey')
    return res.status(200).json({ token });
});

router.get('/tasks', (req,res) => {
    res.json([
        {
            _id: 1,
            name: "Doguinho 1",
            description: "Filhote de pelagem marrom...",
            data: "2020-11-20T18:44:37.965Z"
        },
        {
            _id: 2,
            name: "Doguinho 2",
            description: "Adulto de pelagem preta...",
            data: "2020-11-20T18:44:37.965Z"
        },
        {
            _id: 3,
            name: "Doguinho 3",
            description: "Filhotes...",
            data: "2020-11-20T18:44:37.965Z"
        }
    ])
})

router.get('/private-tasks', verifyToken, (req,res) => {
    res.json([
        {
            _id: 1,
            name: "Doguinho 1",
            description: "Filhote de pelagem marrom...",
            data: "2020-11-20T18:44:37.965Z"
        },
        {
            _id: 2,
            name: "Doguinho 2",
            description: "Adulto de pelagem preta...",
            data: "2020-11-20T18:44:37.965Z"
        },
        {
            _id: 3,
            name: "Doguinho 3",
            description: "Filhotes...",
            data: "2020-11-20T18:44:37.965Z"
        }
    ])
})

router.get('/profile', verifyToken, (req,res) => {
    res.send(req.userId);
})

module.exports = router;

function verifyToken(req, res, next) {
        if(!req.headers.authorization){
            return res.status(401).send('anUnthorize  Request');
        }

        const token = req.headers.authorization.split(' ')[1]
        if (token === 'null'){
            return res.status(401).send('Unthorize Request');
        }

        const payload = jwt.verify(token, 'secretkey');
        req.userId = payload._id;
        next();
    }

