
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const externalService = require('../../services/external.service')

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
    perform
}

async function query() {
    const collection = await dbService.getCollection('task')
    try {
        const tasks = await collection.find().toArray();
        externalService.intervalExecute(tasks)
        return tasks
    } catch (err) {
        console.log('ERROR: cannot find tasks')
        throw err;
    }
}

async function getById(taskId) {
    const collection = await dbService.getCollection('task')
    try {
        const task = await collection.findOne({ "_id": ObjectId(taskId) })
        return task
    }
    catch (err) {
        console.log(`ERROR: while finding task ${taskId}`)
        throw err;
    }
}

async function remove(taskId) {
    const collection = await dbService.getCollection('task')
    try {
        await collection.deleteOne({ "_id": ObjectId(taskId) })
    } catch (err) {
        console.log(`ERROR: cannot remove task ${taskId}`)
        throw err;
    }
}

async function update(task) {
    const collection = await dbService.getCollection('task')
    task._id = ObjectId(task._id);
    try {
        await collection.replaceOne({ "_id": task._id }, task)
        return task
    } catch (err) {
        console.log(`ERROR: cannot update task ${task._id}`)
        throw err;
    }
}

async function add(task) {
    const collection = await dbService.getCollection('task')
    try {
        await collection.insertOne(task);
        return task;
    } catch (err) {
        console.log(`ERROR: cannot insert task`)
        throw err;
    }
}
async function perform(task) {
    try {
        await externalService.execute(task)
    } catch (error) {
        task.success = false;
        task.lastTriedAt = new Date();
    } finally {
        task.triesCount++;
        return task;
    }
}

