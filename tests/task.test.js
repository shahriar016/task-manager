const app = require("../src/app")
const request = require("supertest")
const mongoose = require("mongoose")
const {createDB, user1Id, user1, user2, User, Task, user2Id,
    task1, task2, task3} = require("./fixtures/db")

beforeEach(createDB)

test("creating task test", async () => {
    const res = await request(app)
        .post('/tasks')
        .set({"Authorization": `Bearer ${user1.tokens[0].token}`})
        .send({
            description: "My test task"
        })
        .expect(201)
    //console.log(res.body.task)
    const task = await Task.findById(res.body.task._id)
    //console.log(task)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('fetch user tasks', async () => {
    const res = await request(app)
        .get('/tasks')
        .set({"Authorization": `Bearer ${user1.tokens[0].token}`})
        .send().expect(200)
    //console.log(res.body)
    expect(res.body.length).toBe(2)
})

test('task delete test incorrect user', async () => {
    const res = await request(app)
        .delete(`/tasks/${task1._id}`)
        .set({"Authorization": `Bearer ${user2.tokens[0].token}`})
        .send().expect(404)
    const task = await Task.findById(task1._id)
    expect(task).not.toBeNull()
})

test('task delete test correct user', async () => {
    const res = await request(app)
        .delete(`/tasks/${task2._id}`)
        .set({"Authorization": `Bearer ${user2.tokens[0].token}`})
        .send().expect(200)
    const task = await Task.findById(task2._id)
    expect(task).toBeNull()
})