const mongodb = require("mongodb")

const mongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectId

const id = new ObjectID()
console.log(id.toHexString(), id.getTimestamp())

connectionURL = "mongodb://127.0.0.1:27017"
db_name = "task-manager"

mongoClient.connect(connectionURL, {useNewUrlParser: true}, (err, client) => {
    if(err) {
        return console.log(err)
    }
    console.log(db_name+": connected")
    const dbo = client.db(db_name).collection('users')
    dbo.updateOne({user:"shahriar khan"}, {$inc: {age: 1}}).then((result)=> {
        console.log(result.ops)
        client.close()
    }).catch((error) => {
        client.close()
    });
    /*
    dbo.collection('users').insertOne({ user: "bissu", age: 10},(err,res) => {
        if(err) {
            return console.log(err)
        }
        console.log(res)
        client.close()
    })*/
    dbo
})