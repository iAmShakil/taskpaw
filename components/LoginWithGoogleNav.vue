<template>
  <button class="py-3 md:py-3 font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl px-4 md:px-11" @click="signInWithGoogle">
    <span class=" block md:hidden">Login</span><span class="hidden md:block">Sign in with Google</span>
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
