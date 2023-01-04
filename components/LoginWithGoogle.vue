<template>
  <button class="py-3 font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl px-11" @click="signInWithGoogle">
    Sign in with Google
  </button>
</template>

<script>
export default {
  name: 'LoginWithGoogle',
  methods: {
    signInWithGoogle () {
      this.$auth.loginWith('google')
    }
  }
}
</script>
