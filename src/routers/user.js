const express = require("express")
const User = require("../db/user-model")
const Task = require("../db/task-model")
const auth = require("../middlewares/auth")
const router = new express.Router()
const multer = require("multer")
const sharp = require("sharp")

// user sign up
router.post('/users',async (req, res) => {
    const allowed = ["name", "password", "email", "age"]
    const isOk = Object.keys(req.body).every((key) => allowed.includes(key))
    
    if(!isOk) return res.status(400).send()
    try {
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        //user.tokens = user.tokens.concat({token})
        await user.save()
        let {name,age=0,email} = user
        res.status(201).send({email,name,age,token})
    } catch(e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})
// user login
router.post("/users/login", async (req,res) => {
    //return res.send(req.body)
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //console.log(user)
        const token = await user.generateAuthToken()
        //console.log(token)
        await user.save()
        let {name,age=0,email} = user
        res.status(200).send({email,name,age,token})
    } catch(e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})
router.post("/users/logout",auth, async (req,res) => {
    //return res.send(req.user)
    console.log(req.user.tokens)
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        }) 
        //return res.send(req.user)
        await req.user.save()
        let {name,age=0,email} = user
        res.status(200).send({email,name,age,token})
    }catch(e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})
router.post("/users/logoutAll",auth, async (req,res) => {
    //return res.send(req.user)
    console.log(req.user.tokens)
    try {
        req.user.tokens = []
        //return res.send(req.user)
        await req.user.save()
        res.status(200).send(req.user)
    }catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.get("/users", auth, (req,res) => {
    User.find({}).then((users) => {
        if(!users) {
            return res.status(404).send()
        }
        res.send({users})
    }).catch((err) => {
        res.status(500).send(err)
    })
})
router.get('/users/me', auth, async (req,res) => {
    try {
        let {name, age=0,email} = req.user
        res.status(200).send({email, name, age, token: req.token})
    } catch(e) {
        console.log(e)
        res.status(500).send({"error":e.message})
    }
})
router.patch('/users/me', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowed = ["name", "password", "email", "age"]
    const isValid = updates.every((update) => allowed.includes(update))
    if(!isValid) {
        return res.status(400).send({"error": "Invalid Updates"})
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        //console.log(user)
        let {email, name, age=0} = req.user
        let message = "User Updated Successfully"
        res.send({email, name, age, message})
    } catch(e) {
        console.log(e)
        res.status(500).send({"error":e.message})
    }
})

router.delete('/users/me', auth, async (req,res) => {
    try {
        /*const tasks = await Task.find({owner: req.user._id.toString()})
        for(const task of tasks) {
            await task.remove()
        }*/
        await Task.deleteMany({owner: req.user._id.toString()})
        //return res.send(tasks)
        await req.user.remove()
        let {email, name, age=0} = req.user
        let message = "User Deleted Successfully"
        res.send({email, name, age, message})
    } catch(e) {
        console.log(e)
        res.status(500).send({"error":e.message})
    }
})
const upload = multer({
    limits: {
        fileSize: 500000 // in bytes
    }, fileFilter: (req,file,cb) => {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
            cb("file format must be jpg, jpeg or png")
        }
        cb(undefined, true)
    }
})
router.post("/users/upload", auth, upload.single("upload"), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer // buffer is accessible only if dest is not set
    await req.user.save()
    res.send("File Uploaded Successfully")
}, (e, req,res,next) => {
    res.send({"Error": e.message})
})
router.post("/users/delete/avatar", auth, async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send({success: "Avatar was deleted successfully"})
}, (e,req,res,next) => {
    res.status(400).send({error:e.message})
})
router.get("/users/:id/avatar", async (req,res) => {
    //return res.send("Hi There")
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error("avatar is not available")
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    } catch(e) {
        res.send({error: e.message})
    }
}, (e,req,res,next) => {
    //console.log(e)
    res.status(400).send({error: e.message})
})
module.exports = router
