<script setup>
import BlockMood from '../components/BlockMood.vue';
import { ref, onMounted, onUnmounted } from "vue";
import { useCalendarStore } from '@/stores/calendar';
import axios from 'axios';

const calendarStore = useCalendarStore();
const selectDateMonth = ref(new Date());
const listMoods = ref({});
const numberDay = ref(new Date(selectDateMonth.value.getFullYear(), selectDateMonth.value.getMonth() + 1, 0).getDate());
const daySelected = ref(new Date());
const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const showList = ref(false);
const prefix_space_calendar = ref(0);
updatePrefixSpaceCalendar();

function init() {
  if (localStorage.getItem("pv") === null) {
    axios.get(import.meta.env.VITE_APP_URL + '/init_users')
      .then(function (response) {
        localStorage.setItem("pv", response.data['private_id']);
        getMoodByMonth(selectDateMonth.value.getFullYear(), selectDateMonth.value.getMonth());
      });
  } else {
    getMoodByMonth(selectDateMonth.value.getFullYear(), selectDateMonth.value.getMonth());
  }
}

function getMoodByMonth(year, month) {
  const postData = {
    private_id: localStorage.getItem('pv'),
    year: year,
    month: month + 1,
  };

  axios.post(import.meta.env.VITE_APP_URL + '/get_mood_by_month', postData).then(function (response) {
    listMoods.value = response.data;
  });
}

function updateFocusDay(i) {
  daySelected.value = new Date(selectDateMonth.value.getFullYear(), selectDateMonth.value.getMonth(), i);
  showList.value = false;
}

function setMoodDay(i) {
  listMoods.value[daySelected.value.getDate()] = i;
  calendarStore.addMood(daySelected, i).then(() => {
    showList.value = false;
  });

}

function changeMonth(increment) {
  listMoods.value = {};
  selectDateMonth.value.setMonth(selectDateMonth.value.getMonth() + (increment ? 1 : -1));
  selectDateMonth.value = new Date(selectDateMonth.value);
  numberDay.value = new Date(selectDateMonth.value.getFullYear(), selectDateMonth.value.getMonth() + 1, 0).getDate();
  getMoodByMonth(selectDateMonth.value.getFullYear(), selectDateMonth.value.getMonth());
  updatePrefixSpaceCalendar();
}

function updatePrefixSpaceCalendar() {
  const day = new Date(selectDateMonth.value.getFullYear(), selectDateMonth.value.getMonth(), 1).getDay();

  if (day > 0)
    prefix_space_calendar.value = (day - 1);
  else {
    prefix_space_calendar.value = 6;
  }
}

const handleKeyPress = (event) => {
  if (daySelected.value.getMonth() == selectDateMonth.value.getMonth()) {
    switch (event.key) {
      case "ArrowLeft":
        daySelected.value = new Date(daySelected.value.getFullYear(), daySelected.value.getMonth(), daySelected.value.getDate() == 1 ? numberDay.value : daySelected.value.getDate() - 1);
        break;
      case "ArrowRight":
        daySelected.value = new Date(daySelected.value.getFullYear(), daySelected.value.getMonth(), daySelected.value.getDate() == numberDay.value ? 1 : daySelected.value.getDate() + 1);
        break;
      case "0": case "1": case "2": case "3": case "4": case "5":
        setMoodDay(event.key);
        break;
      default:
        break;
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});

init();

</script>

<template>
  <router-link class='setting_button' to='/settings'>⚙️</router-link>
  <div class="top">
    <span class="material-symbols-outlined arrow" @click="changeMonth(false)">chevron_left</span>
    <span>{{ selectDateMonth.toLocaleString("default", { month: "short", year: "numeric" }) }}</span>
    <span class="material-symbols-outlined arrow" @click="changeMonth(true)">chevron_right</span>
  </div>
  <div class="day_name_list">
    <span class="day_name" v-for="day in daysOfWeek" :key="day">{{ day }}</span>
  </div>
  <div class="calendar">
    <div class="block_calendar" v-for="i in prefix_space_calendar" :key="i"></div>
    <div class="block_calendar" v-for="i in numberDay" :key="i">
      <BlockMood
        :active="daySelected.getDate() === i && daySelected.getMonth() === selectDateMonth.getMonth() && daySelected.getFullYear() === selectDateMonth.getFullYear()"
        :mood="listMoods[i]" @click="updateFocusDay(i)"></BlockMood>
      <span
        :class="{ active: daySelected.getDate() === i && daySelected.getMonth() === selectDateMonth.getMonth() && daySelected.getFullYear() === selectDateMonth.getFullYear() }"
        class="calendar_number">{{ i }}</span>
    </div>
  </div>
  <div class="bottom_abs">
    <Transition name="fade">
      <div v-if="showList" class="list_selectable_mood">
        <BlockMood v-for="i in 6" :key="i" :mood="i - 1" @click="setMoodDay(i - 1)"></BlockMood>
      </div>
    </Transition>
    <div class="button_add_mood" @click="showList = !showList">
      <span v-if="showList">-</span>
      <span v-else>+</span>
    </div>
  </div>
</template>

<style>
.setting_button {
  margin-left: auto;
  margin-right: 20px;
  text-decoration: none;
  position: absolute;
  bottom: 20px;
  left: 20px;
  font-size: 20px;
  z-index: 999;
}

.top_profile button:active {
  background-color: rgb(34, 137, 73);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.top .arrow {
  font-size: 30px;
  user-select: none;
  cursor: pointer;
  padding: 10px 10px;
}

.calendar {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.day_name_list {
  display: flex;
  margin-bottom: 16px;
  gap: 5px;
}

.day_name {
  min-width: calc(100% / 7 - 5px);
  text-align: center;
  font-size: 12px;
  color: gray;
}

.block_calendar {
  min-width: calc((100% / 7) - 5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
}

.block_calendar:focus .img_mood {
  stroke: red;
}

.calendar_number {
  margin-bottom: 4px;
}

.calendar_number.active {
  color: green;
  font-weight: bold;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.08s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list_selectable_mood {
  background-color: rgba(128, 128, 128, 0.099);
  border: 1px solid rgba(0, 0, 0, 0.315);
  display: flex;
  justify-content: center;
  border-radius: 10px;
  max-width: max-content;
  margin: 12px auto;
  padding: 20px 20px 16px 20px;
  gap: 14px;
  flex-wrap: wrap;
}

.bottom_abs {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
}

.button_add_mood {
  margin: 0 auto;
  background-color: rgb(187, 211, 187);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  width: 20px;
  border-radius: 50px;
  font-size: 24px;
  user-select: none;
}
</style>
