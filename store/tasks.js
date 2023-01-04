import moment from 'moment'
import { TASK_STATUS } from '~/constants'
import { waitForMs } from '~/utils/common'
import { getRandomConfettingFunction } from '~/utils/confetti'

export const state = () => ({
  tasks: [],
  tasksLoading: false
})

export const mutations = {
  setTasks (state, tasks) {
    state.tasks = tasks
  },
  addTask (state, taskData) {
    state.tasks.push(taskData)
  },
  deleteTask (state, taskId) {
    state.tasks = state.tasks.filter(task => task.id !== taskId)
  },
  // workaround for a persistent storage bug
  emptyTasksStore (state) {
    state.tasks = []
  },
  updateTaskStatus (state, payload) {
    const task = state.tasks.find(task => task.id === payload.id)
    if (!task) { return }
    task.status = payload.status
    if (payload.taskTime.type === 'start') {
      task.start_time = payload.taskTime.value
    }
    if (payload.taskTime.type === 'end') {
      task.end_time = payload.taskTime.value
    }
  },
  setTasksLoading (state, isLoading) {
    state.tasksLoading = isLoading
  }
}

export const actions = {
  addTask (store, taskInput) {
    const taskData = {
      id: Math.random().toString(),
      title: taskInput.taskTitle,
      tags: taskInput.tags,
      estimated_time: taskInput.estimatedTime,
      status: TASK_STATUS.NOT_STARTED,
      start_time: null,
      end_time: null,
      create_time: new Date().valueOf(),
      order: store.state.tasks.length
    }
    if (store?.rootState?.auth?.loggedIn) {
      fetch('/api/task', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskData
        })
      })
    }
    store.commit('addTask', taskData)
  },

  updateTaskStatus (store, taskId) {
    const task = store.state.tasks.find(task => task.id === taskId)
    const currentStatus = task.status
    let updatePayload = {}
    if (currentStatus === TASK_STATUS.NOT_STARTED) {
      // transitioning from (not_started) creation time status to running
      updatePayload = {
        id: task.id,
        status: TASK_STATUS.RUNNING,
        taskTime: {
          type: 'start',
          value: new Date().valueOf()
        }
      }
    } else if (currentStatus === TASK_STATUS.RUNNING) {
      getRandomConfettingFunction()()
      updatePayload = {
        id: task.id,
        status: TASK_STATUS.COMPLETED,
        taskTime: {
          type: 'end',
          value: new Date().valueOf()
        }
      }
    }
    store.commit('updateTaskStatus', updatePayload)
    if (store?.rootState?.auth?.loggedIn) {
      fetch(`/api/task/${task.id}/status`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskData: updatePayload
        })
      })
    }
  },
  deleteTask (store, taskId) {
    store.commit('deleteTask', taskId)
    if (store?.rootState?.auth?.loggedIn) {
      fetch(`/api/task/${taskId}/delete`, {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' }
      })
    }
  },
  updateTasksOrders (store, event) {
    if (!event.moved) { return }
    const tasksCloned = [...store.getters.tasks]
    const newIndex = tasksCloned[event.moved.newIndex].order
    const oldIndex = tasksCloned[event.moved.oldIndex].order
    const isMoveUp = newIndex < oldIndex
    tasksCloned.forEach((task) => {
      if (isMoveUp) {
        if (task.order === oldIndex) {
          task.order = newIndex
          return
        }
        if (task.order >= newIndex && task.order < oldIndex) {
          task.order = task.order + 1
        }
      } else {
        // moveDown
        if (task.order === oldIndex) {
          task.order = newIndex
          return
        }
        if (task.order <= newIndex && task.order > oldIndex) {
          task.order = task.order - 1
        }
      }
    })
    store.commit('setTasks', tasksCloned)
    if (store?.rootState?.auth?.loggedIn) {
      fetch('/api/task/orders', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskOrders: tasksCloned.map(task => ({
            id: task.id,
            order: task.order
          }))
        })
      })
    }
  },
  async fetchTasks (store) {
    try {
      store.commit('setTasksLoading', true)
      const selecteDate = store?.rootState?.ui?.selectedDate || new Date()
      const startTime = moment(selecteDate).local().startOf('day').valueOf()
      const endTime = moment(selecteDate).local().endOf('day').valueOf()
      const response = await fetch('/api/task?' + new URLSearchParams({
        startTime,
        endTime
      }))
      if (process.env.NODE_ENV === 'development') {
        await waitForMs(500)
      }
      const data = await response.json()
      store.commit('setTasks', data.tasks)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    } finally {
      store.commit('setTasksLoading', false)
    }
  }
}

// export const plugins = [vuexLocal.plugin]

export const getters = {
  tasks (state, _, rootState) {
    const day = rootState.ui.selectedDate
    const tasks = state.tasks.filter(task => moment(day).isSame(task.create_time, 'day')) || []
    return tasks.sort((a, b) => a.order - b.order)
  },
  tasksLoading (state) {
    return state.tasksLoading
  }
}
