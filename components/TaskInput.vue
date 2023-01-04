<template>
  <form class="flex items-center flex-1 overflow-hidden border rounded-2xl h-[70px]" @submit.prevent="submitHandler">
    <div class="w-full h-full col-12 col-md-8">
      <input v-model="taskTitle" required class="w-full h-full pt-2 pb-2 pl-3 pr-3 md:pr-8 md:pl-8 focus-visible:outline-none" placeholder="Task title">
    </div>
    <div class="flex flex-row items-center h-full ml-auto">
      <div class="h-full col-12 col-md-2 pr-0 md:pr-5">
        <select id="estimatedTime" class="h-full rounded-none" name="estimatedTime" @change="estimatedTimeChangeHandler">
          <option v-for="estimatedTimeOption in estimatedTimeOptions" :key="estimatedTimeOption.id" :selected="estimatedTimeOption.id === estimatedTime" :value="estimatedTimeOption.id">
            {{ estimatedTimeOption.label }}
          </option>
        </select>
      </div>
      <div class="h-full">
        <button type="submit" class="flex items-center justify-center w-20 h-full px-2 py-2 font-bold text-white bg-indigo-500 rounded-r md:px-4 md:w-36 hover:bg-indigo-600">
          <svg
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            x="0px"
            y="0px"
            width="45px"
            height="45px"
            viewBox="0 0 122.879 122.88"
            enable-background="new 0 0 122.879 122.88"
            xml:space="preserve"
          ><g><path fill="#ffffff" d="M17.995,17.995C29.992,5.999,45.716,0,61.439,0s31.448,5.999,43.445,17.995c11.996,11.997,17.994,27.721,17.994,43.444 c0,15.725-5.998,31.448-17.994,43.445c-11.997,11.996-27.722,17.995-43.445,17.995s-31.448-5.999-43.444-17.995 C5.998,92.888,0,77.164,0,61.439C0,45.716,5.998,29.992,17.995,17.995L17.995,17.995z M57.656,31.182 c0-1.84,1.492-3.332,3.333-3.332s3.333,1.492,3.333,3.332v27.383h27.383c1.84,0,3.332,1.492,3.332,3.332 c0,1.841-1.492,3.333-3.332,3.333H64.321v27.383c0,1.84-1.492,3.332-3.333,3.332s-3.333-1.492-3.333-3.332V65.229H30.273 c-1.84,0-3.333-1.492-3.333-3.333c0-1.84,1.492-3.332,3.333-3.332h27.383V31.182L57.656,31.182z M61.439,6.665 c-14.018,0-28.035,5.348-38.731,16.044C12.013,33.404,6.665,47.422,6.665,61.439c0,14.018,5.348,28.036,16.043,38.731 c10.696,10.696,24.713,16.044,38.731,16.044s28.035-5.348,38.731-16.044c10.695-10.695,16.044-24.714,16.044-38.731 c0-14.017-5.349-28.035-16.044-38.73C89.475,12.013,75.457,6.665,61.439,6.665L61.439,6.665z" /></g></svg>
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import humanizeDuration from 'humanize-duration'

export default {
  data () {
    return {
      taskTitle: '',
      tags: '',
      estimatedTime: 1000 * 60 * 5 // minutes in ms
    }
  },
  computed: {
    estimatedTimeOptions () {
      const oneMin = 1000 * 60 // in ms
      const options = [
        {
          id: oneMin * 5
        }, {
          id: oneMin * 10
        }, {
          id: oneMin * 15
        }, {
          id: oneMin * 20
        }, {
          id: oneMin * 25
        }, {
          id: oneMin * 30
        }
      ]
      return options.map((option) => {
        return {
          ...option,
          label: humanizeDuration(option.id)
        }
      })
    }
  },
  methods: {
    humanizeDuration,
    submitHandler () {
      this.$emit('taskSubmit', {
        taskTitle: this.taskTitle,
        tags: this.tags,
        estimatedTime: Number(this.estimatedTime)
      })
      this.resetTaskInput()
    },
    estimatedTimeChangeHandler ($event) {
      this.estimatedTime = $event.target.value
    },
    resetTaskInput () {
      this.taskTitle = ''
      this.tags = ''
      this.estimatedTime = 1000 * 60 * 5 // minutes in ms
    }
  }
}
</script>
