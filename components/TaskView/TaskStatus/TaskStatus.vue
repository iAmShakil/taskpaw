<template>
  <TaskStatusCircle :circle-color="circleBorderColor" :remaining-percentage="percentOfTimeRemaining" :time-remaining="timeRemaining" />
</template>

<script>
import moment from 'moment'
import TaskStatusCircle from './TaskStatusCircle.vue'
import { TASK_STATUS } from '~/constants'

export default {
  name: 'TaskStatus',
  components: {
    TaskStatusCircle
  },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    timeRemainingMs () {
      if (this.task.status === 'NOT_STARTED') { return this.task.estimated_time } else if (this.task.status === 'RUNNING') {
        const estimatedEndTime = this.task.start_time + this.task.estimated_time
        return estimatedEndTime - moment().valueOf()
      } else {
        // task completed
        const estimatedEndTime = this.task.start_time + this.task.estimated_time
        return estimatedEndTime - this.task.end_time
      }
    },
    percentOfTimeRemaining () {
      return Number((this.timeRemainingMs >= 0 ? (this.timeRemainingMs / this.task.estimated_time) * 100 : 0).toFixed(0))
    },
    timeRemaining () {
      return this.timeRemainingMs
    },
    circleBorderColor () {
      if (this.task.status === TASK_STATUS.RUNNING) {
        return this.timeRemainingMs >= 0 ? 'blue' : 'red'
      }
      return this.timeRemainingMs >= 0 ? 'green' : 'red'
    }
  }
}
</script>
