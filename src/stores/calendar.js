import { defineStore } from 'pinia'

export const useCalendarStore = defineStore({
  id: 'calendar',
  state: () => ({
    calendar: localStorage.getItem('calendar') ? JSON.parse(localStorage.getItem('calendar')) : {}
  }),
  getters: {
    getMoodByMonth: (state) => (year, month) => {
      const key = `${year}-${month}`
      return state.calendar[key] || {}
    }
  },
  actions: {
    addMood(day, month, year, moodLevel) {
      const key = `${year}-${month}`
      const dateKey = `${day}`
      if (!this.calendar[key]) {
        this.calendar[key] = {}
      }
      this.calendar[key][dateKey] = moodLevel
      localStorage.setItem('calendar', JSON.stringify(this.calendar))
    }
  }
})
