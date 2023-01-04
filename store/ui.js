import moment from 'moment'

export const state = () => ({
  selectedDate: moment().subtract(10, 'years').startOf('day'),
  isDateLoaded: false
})

export const mutations = {
  setSelectedDate (state, date) {
    state.selectedDate = date
  },
  setIsDateLoaded (state, isDateLoaded) {
    state.isDateLoaded = isDateLoaded
  }
}

export const getters = {
  selectedDate (state) {
    return state.selectedDate
  },
  isDateToday (state) {
    return moment(state.selectedDate).isSame(new Date(), 'day')
  },
  isDateLoaded (state) {
    return state.isDateLoaded
  }
}
