const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/task-manager", {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
})



/*const task = new Task({description:"learn mongoose for nodeJS", completed: false})

task.save().then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})

const user = new User({name: "Kelvin Brown", age: 27, email: "kelVin@yahoo.com"
, password: "myPass for ok"})

user.save().then((result) => {console.log(result)}).catch((err) => {console.log(err)}) */
