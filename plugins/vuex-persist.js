import { VuexPersistence } from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
  /* your options */
    storage: typeof window === 'undefined' ? {} : window.localStorage,
    modules: ['tasks'],
    filter: () => {
      if (!store.state.auth.loggedIn) {
        return true
      }
    }
  }).plugin(store)
}
