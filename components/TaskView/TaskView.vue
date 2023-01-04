<template>
  <div
    class="task-item flex flex-row min-h-[82px] px-3 md:px-7 border-gray-800 border-solid border-2 shadow-2xl rounded-lg mb-6"
    :style="{
      'background-color': bgColor
    }"
  >
    <div class="flex flex-col justify-center flex-1">
      <div class="text md:text-base">
        {{ task.title }}
      </div>
      <div v-if="task.status === 'COMPLETED'" class="flex flex-col md:flex-row items-baseline">
        <div v-if="taskActualTime" class="text-sm text-gray-700 bg-primary">
          {{ moment(task.start_time).format('hh:mm A') }} - {{ moment(task.end_time).format('hh:mm A') }}
        </div>
        <div class="md:ml-2 text-xs text-gray-500 bg-primary">
          {{ taskActualTime }}
        </div>
      </div>
    </div>
    <div class="flex flex-row items-center justify-between w-[140px]">
      <div
        type="button"
        class="cursor-pointer "
        @click="$emit('task-delete', $event, {
          task: task
        })"
      >
        <DeleteIcon />
      </div>
      <div
        :class="{
          'animate-heart': task.status === 'RUNNING'
        }"
      >
        <TaskStatus :key="statusKey" :task="task" />
      </div>
      <TaskAction :action-button-text="actionButtonText" @click="taskActionHandler" />
    </div>
    <!-- two main wrapper ends -->
  </div>
</template>
<script>
import humanizeDuration from 'humanize-duration'
import moment from 'moment'
import TaskAction from './TaskAction.vue'
import DeleteIcon from './DeleteIcon.vue'
import TaskStatus from './TaskStatus/TaskStatus.vue'
import { TASK_UPDATE_TYPES, TASK_STATUS } from '~/constants'

export default {
  components: {
    TaskAction,
    DeleteIcon,
    TaskStatus
  },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      TASK_UPDATE_TYPES,
      statusKey: Math.random()
    }
  },
  computed: {
    bgColor () {
      if (this.task.status === TASK_STATUS.RUNNING) {
        return '#f2f2f2'
      }
      if (this.task.status === TASK_STATUS.COMPLETED) {
        return '#DADADA'
      }
      return '#ffffff'
    },
    actionButtonText () {
      if (this.task.status === TASK_STATUS.COMPLETED) {
        return 'COMPLETED'
      } else if (this.task.status === TASK_STATUS.NOT_STARTED) {
        return 'START'
      } else {
        // TASK_STATUS === 'RUNNING'
        return 'DONE'
      }
    },
    taskActualTime () {
      if (this.task.status === TASK_STATUS.COMPLETED) {
        return this.humanizeDuration(this.task.start_time - this.task.end_time, { round: true })
      }
      return null
    },
    isActionButtonDisabled () {
      return this.task.status === TASK_STATUS.COMPLETED
    }
  },
  mounted () {
    const refreshStatus = () => {
      if (this.task.status === TASK_STATUS.RUNNING) { this.statusKey = this.statusKey + 1 }
      this.clearRefreshId = setTimeout(() => {
        refreshStatus()
      }, 1000)
    }
    refreshStatus()
  },
  beforeDestroy () {
    if (this.clearRefreshId) { clearTimeout(this.clearRefreshId) }
  },
  methods: {
    moment,
    humanizeDuration,
    taskActionHandler (event) {
      this.$emit('task-update', event, {
        type: TASK_UPDATE_TYPES.STATUS,
        task: this.task
      })
    }
  }
}
</script>
