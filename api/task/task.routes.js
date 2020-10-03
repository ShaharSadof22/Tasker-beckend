const express = require('express')
// const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {performTask, getTasks, deleteTask, updateTask, addTask} = require('./task.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getTasks)
router.put('/', updateTask)
router.put('/start', performTask)
router.post('/', addTask)
// router.get('/:id', getTask)
router.delete('/:id', deleteTask)

module.exports = router