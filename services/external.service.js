const dbService = require('./db.service')
const ObjectId = require('mongodb').ObjectId

const taskService = require('../api/task/task.service')


module.exports = {
    execute,
    intervalExecute
}
function execute(task) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('execute');
            if (Math.random() > 0.5) {
                task.success = true;
                task.doneAt = new Date();
                resolve(task)
            }
            else reject(task);
        }, 0)
    })
}
function intervalExecute(tasks) {
    setInterval(async tasks => {
        const collection = await dbService.getCollection('task')
        try {
            const tasks = await collection.find({}).sort({ triesCount: 1, importance: 1 }).toArray();
            const task = tasks.find(task => !task.success)

            if (task) {
                try {
                    await execute(task)
                } catch (error) {
                    task.success = false;
                    task.lastTriedAt = new Date();
                } finally {
                    task.triesCount++;
                    try {
                        task._id = ObjectId(task._id);
                        await collection.replaceOne({ "_id": task._id }, task)
                    } catch (error) {
                        console.log('ERROR: cannot update task')
                    }
                }
            } else return;
        } catch (error) {
            console.log('ERROR: cannot find tasks')
        }

    }, 3000);
}