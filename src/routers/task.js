const express = require("express")
const mongodb = require("mongodb")
const ObjectId = mongodb.ObjectId
const Task = require("../db/task-model")
const auth = require("../middlewares/auth")
const router = new express.Router()


router.post('/tasks', auth, async (req,res) => {
    //const task = new Task(req.body)
    //console.log("from /tasks post",req.body)
    const task = new Task({
        ...req.body, 
        owner: req.user._id
    })
    try {
        await task.save()
        const t = await Task.findById(task._id)
        //console.log(t)
        res.status(201).send({task})
    } catch(e) {
        res.status(500).send(e.message)
    }
})

// example url for this route
// localhost:8081/tasks?sortBy=createdAt:asc&completed=true&limit=10&skip=20
router.get("/tasks",auth, async (req,res) => {
    //return res.send(req.query)
    const match = {owner: req.user._id}
    const sort = {}
    if(req.query.completed) {
        match.completed = req.query.completed === "true"
    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(":")
        if(parts.length==2) {
            sort[parts[0]] = (parts[1]==='desc'?-1:1)
        } else {
            sort[parts[0]] = 1 
        }
    }
    try {
        //const tasks = await req.user.populate('tasks').execPopulate()
        const tasks = await Task.find(
            match, // query values
            '_id description completed owner createdAt', // which values to return. if null then all
            {
                limit: parseInt(req.query.limit), // skipped if not provided 
                skip: parseInt(req.query.skip), // skipped if not provided
                sort 
            }
        ).exec()

        if(!tasks) return res.status(404).send()
        //console.log(tasks)
        res.send(tasks)
    } catch(e) {
        //console.log(e)
        res.status(500).send(e.message)
    }
})
router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task) {
            return res.status(404).send("Task is not available")
        }
        res.send(task)
    } catch(e) {
        res.status(500).send(e.message)
    }
})
router.patch('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowed = ["description", "completed"]
    const isValid = updates.every((update) => allowed.includes(update))
    if(!isValid) {
        return res.status(400).send({"error": "Invalid Updates"})
    }
    try {
        const task = await Task.findOne({_id, owner: req.user._id.toString()})
        if(!task) return res.status(404).send()
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch(e) {
        console.log(e)
        res.status(400).send(e.message)
    }

})
router.delete('/tasks/:id',auth,async (req,res) => {
    _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task) return res.status(404).send()
        console.log(task)
        await task.remove()
        res.send(task)
    } catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router