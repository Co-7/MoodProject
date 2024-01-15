<script setup>
import BlockMood from './components/BlockMood.vue';
import { ref } from "vue";
import { useCalendarStore } from '@/stores/calendar';

const calendarStore = useCalendarStore();
const selectedDate = ref(new Date());
const listMoods = ref(calendarStore.getMoodByMonth(selectedDate.value.getFullYear(), selectedDate.value.getMonth()));
const numberDay = ref(new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() + 1, 0).getDate());
const dateSelected = ref(new Date());
const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const showList = ref(false);
const prefix_date = ref(new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), 1).getDay());

function updateFocusIndex (i) {
  dateSelected.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), i);
  showList.value = false;
}

function setMoodIndex (i) {
  calendarStore.addMood(dateSelected.value.getDate(), dateSelected.value.getMonth(), dateSelected.value.getFullYear(), i);
  listMoods.value = calendarStore.getMoodByMonth(selectedDate.value.getFullYear(), selectedDate.value.getMonth());
  showList.value = false;
}

function changeDate (increment) {
  selectedDate.value.setMonth(selectedDate.value.getMonth() + (increment ? 1 : -1));
  selectedDate.value = new Date(selectedDate.value);
  numberDay.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() + 1, 0).getDate();
  listMoods.value = calendarStore.getMoodByMonth(selectedDate.value.getFullYear(), selectedDate.value.getMonth());
  updatePrefix();
}

function updatePrefix () {
  const day = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), 1).getDay();

  if (day > 0)
    prefix_date.value = day - 1;
  else {
    prefix_date.value = 6;
  }
}

</script>

<template>
  <div class="top">
    <span class="material-symbols-outlined arrow" @click="changeDate(false)">chevron_left</span>
    <span>{{ selectedDate.toLocaleString("default", { month: "short", year: "numeric" }) }}</span>
    <span class="material-symbols-outlined arrow" @click="changeDate(true)">chevron_right</span>
  </div>
  <div class="day_name_list">
    <span class="day_name" v-for="day in daysOfWeek" :key="day">{{ day }}</span>
  </div>
  <div class="calendar">
    <div class="block_calendar" v-for="i in prefix_date" :key="i"></div>
    <div class="block_calendar" v-for="i in numberDay" :key="i">
      <BlockMood
        :active="dateSelected.getDate() === i && dateSelected.getMonth() === selectedDate.getMonth() && dateSelected.getFullYear() === selectedDate.getFullYear()"
        :mood="listMoods[i]" @click="updateFocusIndex(i)"></BlockMood>
      <span
        :class="{ active: dateSelected.getDate() === i && dateSelected.getMonth() === selectedDate.getMonth() && dateSelected.getFullYear() === selectedDate.getFullYear() }"
        class="calendar_number">{{ i }}</span>
    </div>
  </div>
  <div class="bottom_abs">
    <Transition name="fade">
      <div v-if="showList" class="list_selectable_mood">
        <BlockMood v-for="i in 6" :key="i" :mood="i - 1" @click="setMoodIndex(i - 1)"></BlockMood>
      </div>
    </Transition>
    <div class="button_add_mood" @click="showList = !showList">
      <span v-if="showList">-</span>
      <span v-else>+</span>
    </div>
  </div>
</template>

<style scoped>
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
