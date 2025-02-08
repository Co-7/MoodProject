import { defineStore } from 'pinia'
import axios from 'axios'

export const useCalendarStore = defineStore({
  id: 'calendar',
  state: () => ({
    calendar: localStorage.getItem('calendar') ? JSON.parse(localStorage.getItem('calendar')) : {}
  }),
  actions: {
    async addMood(dateSelected, moodLevel) {
      const postData = {
        private_id: localStorage.getItem('pv'),
        value: moodLevel,
        date: dateSelected.value
      }
      await axios.post('http://localhost:8080/add_mood', postData);
      return true;
    }
  }
})
