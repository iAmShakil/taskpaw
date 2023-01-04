<template>
  <div>
    <div class="flex flex-col flex-1">
      <div v-if="!$auth.loggedIn" class="container pt-5 mx-auto md:pt-10">
        <h1 class="pt-5 text-5xl font-bold text-center text-gray-800 md:pt-10">
          Never procrastinate again!
        </h1>
        <p class="mt-5 text-center text-gray-600">
          Your tasks gamified to boost productivity
        </p>
      </div>
      <div v-else class="container pt-5 md:pt-10 mx-auto max-w-[800px]">
        <TaskStats :tasks="tasks" />
      </div>
      <div class="container mx-auto my-10 mb-3 max-w-[800px]">
        <DayHeading />
      </div>
      <div class="container mx-auto max-w-[800px] mb-14">
        <TaskInput @taskSubmit="taskInputHandler" />
      </div>
      <div class="container mx-auto max-w-[800px]">
        <TasksLoading v-if="tasksLoading" />
        <Draggable
          v-else
          v-model="tasks"
          draggable=".task-item"
          class="list-group"
          v-bind="dragOptions"
          @change="dragDropChangeHandler"
          @start="drag = true"
          @end="drag = false"
        >
          <transition-group type="transition" :name="drag ? 'flip-list' : null">
            <TaskView
              v-for="task in tasks"
              :key="task.id"
              class="list-group-item"
              :task="task"
              @task-update="taskUpdateHandler"
              @task-delete="taskDeleteHandler"
            />
          </transition-group>
        </Draggable>
      </div>
    </div>
    <div v-if="!$auth.loggedIn" class="mx-auto max-w-[1100px] mt-40 mt-auto mb-20">
      <Features />
      <div class="mx-auto text-center">
        <LoginWithGoogle />
      </div>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import TaskInput from '~/components/TaskInput.vue'
import TaskView from '~/components/TaskView/TaskView.vue'
import DayHeading from '~/components/DateHeading.vue'
import LoginWithGoogle from '~/components/LoginWithGoogle.vue'
import { TASK_UPDATE_TYPES } from '~/constants'
import TaskStats from '~/components/TaskStats.vue'
import Features from '~/components/Features.vue'
import LoginWall from '~/components/LoginWall.vue'
import TasksLoading from '~/components/TasksLoading.vue'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { TaskInput, TaskView, DayHeading, LoginWithGoogle, TaskStats, Features, LoginWall, TasksLoading, Draggable },
  data () {
    return {
      drag: false
    }
  },
  computed: {
    tasks () {
      return this.$store.getters['tasks/tasks']
    },
    tasksLoading () {
      return this.$store.getters['tasks/tasksLoading']
    },
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  async mounted () {
    if (this.$auth.loggedIn) {
      // first time logged in, post temp tasks to backend
      try {
        const vuexString = localStorage.getItem('vuex')
        const localStore = JSON.parse(vuexString)
        const taskData = localStore?.tasks?.tasks
        if (taskData && taskData.length) {
          localStorage.clear('vuex')
          await fetch('/api/task/visitorSync', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              taskData
            })
          })
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
      this.$store.dispatch('tasks/fetchTasks')
    }
  },
  methods: {
    taskInputHandler (taskData) {
      if (!this.$auth.loggedIn && this.tasks.length >= 4) {
        this.showLoginWall()
        return
      }
      this.$store.dispatch('tasks/addTask', taskData)
    },
    taskUpdateHandler (_, payload) {
      if (payload.type === TASK_UPDATE_TYPES.STATUS) {
        this.$store.dispatch('tasks/updateTaskStatus', payload.task.id)
      }
    },
    taskDeleteHandler (_, payload) {
      this.$store.dispatch('tasks/deleteTask', payload.task.id)
    },
    showLoginWall () {
      this.$modal.show(
        LoginWall,
        {},
        {
          styles: {
            'border-radius': '8px'
          },
          adaptive: true
        }
      )
    },
    dragDropChangeHandler (event) {
      this.$store.dispatch('tasks/updateTasksOrders', event)
    }
  }
}
</script>
<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
