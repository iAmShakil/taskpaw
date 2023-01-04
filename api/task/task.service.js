const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getTasksByUserId = ({ userId, startTime, endTime }) => {
  return prisma.task.findMany({
    where: {
      user_id: Number(userId),
      create_time: {
        gte: startTime,
        lte: endTime
      }
    }
  })
}

const createTask = (taskData) => {
  return prisma.task.create({
    data: taskData
  })
}

const createManyTasks = (taskData = []) => {
  const waitFor = (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  }
  taskData.forEach(async (task) => {
    await waitFor(5)
    await prisma.task.create({
      data: task
    })
  })
  return true
}

const updateTaskStatus = async (userId, taskData) => {
  const updateData = {
    status: taskData.status
  }
  if (taskData.taskTime.type === 'start') {
    updateData.start_time = String(taskData.taskTime.value)
  }
  if (taskData.taskTime.type === 'end') {
    updateData.end_time = String(taskData.taskTime.value)
  }
  const task = await prisma.task.findFirst({
    where: {
      id: taskData.id
    }
  })
  if (task.user_id !== userId) { throw new Error('unauthorized') }
  return prisma.task.update({
    where: {
      id: taskData.id
    },
    data: updateData
  })
}

const deleteTask = async (userId, taskId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId
    }
  })
  if (task.user_id !== userId) { throw new Error('unauthorized') }
  return prisma.task.delete({
    where: {
      id: taskId
    }
  })
}

const updateTaskOrders = async (userId, taskOrders = []) => {
  const tasksByUser = await prisma.task.findMany({
    where: {
      user_id: userId
    }
  })
  const taskIdsByUser = tasksByUser.map(task => task.id)
  taskOrders.forEach((task) => {
    if (!taskIdsByUser.includes(task.id)) { throw new Error('unauthorized') }
  })

  const updatePromiseArr = taskOrders.map((taskOrder) => {
    return prisma.task.update({
      where: {
        id: taskOrder.id
      },
      data: {
        order: taskOrder.order
      }
    })
  })
  return prisma.$transaction(updatePromiseArr)
}

module.exports = {
  getTasksByUserId,
  createTask,
  updateTaskStatus,
  deleteTask,
  createManyTasks,
  updateTaskOrders
}
