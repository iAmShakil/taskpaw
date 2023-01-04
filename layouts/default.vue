<template>
  <div v-if="!loading" class="flex flex-col min-h-screen px-4">
    <Header class="container mx-auto 2xl:max-w-[1440px]" />
    <nuxt-child class="flex flex-col flex-1" />
    <Footer />
  </div>
</template>

<script>
import Footer from '~/components/Footer.vue'
import Header from '~/components/Header/Header.vue'

export default {
  name: 'DefaultLayout',
  components: {
    Header,
    Footer
  },
  data: () => ({
    loading: true
  }),
  created () {
    // vuex-persist issue fix
    this.$nextTick(function () {
      this.loading = false
    })
  }
}
</script>

<style>
html {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
