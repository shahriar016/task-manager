const jwt = require("jsonwebtoken")
const User = require("../../src/db/user-model")
const Task = require("../../src/db/task-model")

const user1Id = new mongoose.Types.ObjectId()
const user1 = {
    _id: user1Id ,
    name: "Mike",
    email: "mike@example.com",
    password: "mike@pass!!",
    tokens: [{
        token: jwt.sign({_id: user1Id},process.env.JWT_KEY)
    }]
}

const user2Id = new mongoose.Types.ObjectId()
const user2 = {
    _id: user2Id ,
    name: "David",
    email: "David@example.com",
    password: "David@pass!!",
    tokens: [{
        token: jwt.sign({_id: user2Id},process.env.JWT_KEY)
    }]
}

const task1 = {
    _id: new mongoose.Types.ObjectId(),
    description: "task one description",
    completed: false,
    owner: user1._id
}
const task2= {
    _id: new mongoose.Types.ObjectId(),
    description: "task two description",
    completed: true,
    owner: user2._id
}
const task3 = {
    _id: new mongoose.Types.ObjectId(),
    description: "task three description",
    completed: false,
    owner: user1._id
}
const createDB = async () => {
    await User.deleteMany()
    await new User(user1).save()
    await new User(user2).save()

    await Task.deleteMany()
    await new Task(task1).save()
    await new Task(task2).save()
    await new Task(task3).save()
}

module.exports = {
    createDB, user1Id, user1, user2, User, Task, user2Id,
    task1, task2, task3
}