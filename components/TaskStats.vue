<template>
  <div class="flex">
    <div
      v-for="(stats, index) in taskStats"
      :key="index"
      class="mr-5 w-[90px] h-[90px] flex flex-col items-center justify-center border-solid border-2 rounded-3xl"
    >
      <div class="text-3xl font-bold text-gray-700 ">
        {{ stats.value }}
      </div>
      <div class="text-sm text-gray-500 ">
        {{ stats.label }}
      </div>
    </div>
  </div>
</template>

<script>
import { TASK_STATUS } from '~/constants'
export default {
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  computed: {
    taskStats () {
      return [
        {
          label: 'Running',
          value: this.running
        },
        {
          label: 'Completed',
          value: this.completed
        },
        {
          label: 'Todo',
          value: this.todo
        }
      ]
    },
    running () {
      return this.tasks.filter(task => task.status === TASK_STATUS.RUNNING).length
    },
    todo () {
      return this.tasks.filter(task => task.status === TASK_STATUS.NOT_STARTED).length
    },
    completed () {
      return this.tasks.filter(task => task.status === TASK_STATUS.COMPLETED).length
    }
  }
}
</script>
