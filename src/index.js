app = require("./app")

const port = process.env.port||PORT
app.listen(port, () => {
    console.log("Server started at the port: "+port)
})