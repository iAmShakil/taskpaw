<template>
  <div class="flex items-center justify-center flex-col h-full">
    <p class="max-w-2xl mx-auto text-lg leading-8 text-gray-900 mb-4">
      Please login to continue and save your progress
    </p>
    <LoginWithGoogle />
  </div>
</template>

<script>
import LoginWithGoogle from '~/components/LoginWithGoogle.vue'
export default {
  components: {
    LoginWithGoogle
  }
}
</script>
