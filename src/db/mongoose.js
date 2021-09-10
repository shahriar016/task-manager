const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URL, {
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
