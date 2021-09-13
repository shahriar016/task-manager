const jwt = require("jsonwebtoken")
const User = require("../db/user-model")

const auth = async (req,res,next) => {
    try {
        const token = req.header('Authorization').replace(/[^ ]+[ ]*/, '')
        //console.log("Token", token)
        const decoded = await jwt.verify(token, process.env.JWT_KEY)
        //console.log(decoded)
        const user = await User.findOne({_id:decoded._id, 'tokens.token': token})
        //return res.send(user)
        if(!user) throw new Error("user not found")
        req.user = user
        req.token = token
        next()
    } catch(e) {
        //console.log(e)
        return res.status(401).send({"Error": "Please Authenticate"})
    }
}

module.exports = auth