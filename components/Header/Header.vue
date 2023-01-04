<template>
  <div class="flex justify-between mt-4 md:mt-6">
    <!-- logo -->
    <div><img src="./logo.png" class="max-w-[200px] h-auto" alt="logo"></div>
    <!-- user area -->
    <div>
      <div v-if="$auth.loggedIn">
        <!-- dropdown starts -->
        <div class="relative inline-block text-left">
          <div>
            <button
              id="menu-button"
              type="button"
              class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              aria-expanded="true"
              aria-haspopup="true"
              @click="toggleMenu"
            >
              <img class="w-5 h-5 mr-1 rounded-full md:mr-3" :src="$auth.user.profile_photo" alt="profile photo"><div class="hidden md:block">
                {{ $auth.user.name }}
              </div>
              <!-- Heroicon name: mini/chevron-down -->
              <svg class="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div
            v-if="isMenuOpen"
            class="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabindex="-1"
          >
            <div class="py-1" role="none">
              <span id="menu-item-0" href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1">{{ $auth.user.email }}</span>
              <a
                id="menu-item-1"
                href="#"
                class="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabindex="-1"
                @click="logoutHandler"
              >Logout</a>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="container mx-auto">
        <LoginWithGoogleNav />
      </div>
    </div>
  </div>
</template>

<script>
import LoginWithGoogleNav from '~/components/LoginWithGoogleNav.vue'

export default {
  components: {
    LoginWithGoogleNav
  },
  data () {
    return {
      isMenuOpen: false
    }
  },
  methods: {
    logoutHandler () {
      this.$store.commit('tasks/emptyTasksStore')
      this.$auth.logout()
      window.location.reload()
    },
    toggleMenu () {
      this.isMenuOpen = !this.isMenuOpen
    }
  }
}
</script>
