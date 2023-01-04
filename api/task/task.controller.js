const express = require('express')
const bodyParser = require('body-parser')
const authMiddleware = require('../middlewares/auth.middleware')
const { getTasksByUserId, createTask, updateTaskStatus, deleteTask, createManyTasks, updateTaskOrders } = require('./task.service')
const router = express.Router()

router.use(bodyParser())
router.use(authMiddleware)
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id
    const startTime = req.query.startTime && new Date(Number(req.query.startTime)) // unix timestamp to JS date
    const endTime = req.query.endTime && new Date(Number(req.query.endTime))
    const tasks = await getTasksByUserId({ userId, startTime, endTime })
    res.send({
      tasks: tasks.map((task) => {
        if (task.estimated_time) {
          task.estimated_time = Number(task.estimated_time)
        }
        if (task.start_time) {
          task.start_time = Number(task.start_time)
        }
        if (task.end_time) {
          task.end_time = Number(task.end_time)
        }
        return task
      })
    })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id
    const taskData = req.body.taskData
    taskData.user_id = userId
    taskData.create_time = new Date(taskData.create_time).toISOString()
    taskData.estimated_time = String(taskData.estimated_time)
    await createTask(taskData)
    res.send('ok')
  } catch (error) {
    next(error)
  }
})

router.post('/visitorSync', async (req, res, next) => {
  try {
    const userId = req.user.id
    const taskData = req.body.taskData // array of tasks
    const taskDataMappped = taskData.map((task) => {
      task.user_id = userId
      task.create_time = new Date(task.create_time).toISOString()
      task.estimated_time = String(task.estimated_time)
      if (task.start_time) {
        task.start_time = String(task.start_time)
      }
      if (task.end_time) {
        task.end_time = String(task.end_time)
      }
      return task
    })
    await createManyTasks(taskDataMappped)
    res.send('ok')
  } catch (error) {
    next(error)
  }
})

router.post('/:taskId/status/', async (req, res, next) => {
  try {
    const userId = req.user.id
    const taskData = req.body.taskData
    await updateTaskStatus(userId, taskData)
    res.send('ok')
  } catch (error) {
    next(error)
  }
})

router.delete('/:taskId/delete/', async (req, res, next) => {
  try {
    const userId = req.user.id
    const taskId = req.params.taskId
    await deleteTask(userId, taskId)
    res.send('ok')
  } catch (error) {
    next(error)
  }
})

router.put('/orders', async (req, res, next) => {
  try {
    const userId = req.user.id
    const taskOrders = req.body.taskOrders
    await updateTaskOrders(userId, taskOrders)
    res.send('ok')
  } catch (error) {
    next(error)
  }
})

module.exports = router
