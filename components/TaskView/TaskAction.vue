<template>
  <div
    class=" cursor-pointer flex items-center justify-center w-[37px] h-[37px] rounded-full bg-indigo-500"
    :style="{
      'background': actionButtonText === 'COMPLETED' ? 'green' : 'rgb(99, 102, 241)'
    }"
    @click="actionHandler"
  >
    <svg
      v-if="actionButtonText === 'DONE'"
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 11.375C12 12.3402 11.2312 13.125 10.2857 13.125H1.71429C0.76875 13.125 0 12.3402 0 11.375V2.625C0 1.65977 0.76875 0.875 1.71429 0.875H10.2857C11.2312 0.875 12 1.65977 12 2.625V11.375Z" fill="white" />
    </svg>
    <svg
      v-else-if="actionButtonText === 'START'"
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 7L0 13.9282L0 0.0717969L12 7Z" fill="white" />
    </svg>
    <svg
      v-else
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 11.1063L1.88192 9.36742C4.08283 10.4326 5.47892 11.242 7.95208 13.0057C12.6023 7.72842 15.6759 5.05083 21.3877 1.49692L22 2.90492C17.2893 7.01525 13.8398 11.594 8.87242 20.5031C5.808 16.8951 3.76292 14.5943 0 11.1063Z" fill="white" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'TaskAction',
  props: {
    actionButtonText: {
      type: String,
      required: true
    }
  },
  methods: {
    actionHandler (event) {
      if (this.actionButtonText === 'COMPLETED') { return }
      this.$emit('click', event)
    }
  }
}
</script>
