const express = require('express')
// const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getTask, getTasks, deleteTask, updateTask} = require('./task.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getTasks)
router.put('/', updateTask)
router.get('/:id', getTask)
router.delete('/:id', deleteTask)

module.exports = router