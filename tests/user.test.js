const app = require("../src/app")
const request = require("supertest")
const mongoose = require("mongoose")
const {createDB, user1Id, user1, user2, User, Task, user2Id} = require("./fixtures/db")

beforeEach(createDB)

test("create new user", async () => {
    const res = await request(app).post('/users').send({
        name: "shahriar",
        email: "shahriar@gmail.com",
        password: "MyPassTest"
    }).expect(201)
    //console.log(res.body)
    const user = await User.findById(user1._id)
    expect(user).not.toBeNull()
    expect(res.body).toMatchObject({
        name: "shahriar",
        email: "shahriar@gmail.com"
    })
})

test("login test", async () => {
    await request(app).post('/users/login').send({
        email: user1.email,
        password: user1.password
    }).expect(200)
})

test("wrong credentials test", async () => {
    await request(app).post('/users/login').send({
        email: "shahriar@gmail.com",
        password: "MyPassTest"
    }).expect(400)
})

test("delete user test", async () => {
    await request(app).delete("/users/me")
        .set({"Authorization": `Bearer ${user1.tokens[0].token}`})
        .send().expect(200)
    const user = await User.findById(user1._id)
    expect(user).toBeNull()
})

test("avatar upload test", async () => {
    //console.log(user1Id, token)
    const res = await request(app)
        .post("/users/upload")
        .set({"Authorization": `Bearer ${user1.tokens[0].token}`})
        .attach('avatar', 'tests/fixtures/avatar.jpg')
        .expect(200)
    const user = await User.findById(user1._id)
    //console.log(res.body)
    expect(user).not.toBeNull()
    //console.log(typeof user.avatar)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("user info update test", async () => {
    const res = await request(app)
        .patch("/users/me")
        .set({"Authorization": `Bearer ${user1.tokens[0].token}`})
        .send({
            name: "changedName"
        })
        .expect(200)
    const user = await User.findById(user1._id)
    expect(user.name).toEqual("changedName")
})

test("user info update test with invalid fields", async () => {
    const res = await request(app)
        .patch("/users/me")
        .set({"Authorization": `Bearer ${user1.tokens[0].token}`})
        .send({
            location: "location"
        })
        .expect(400)
})