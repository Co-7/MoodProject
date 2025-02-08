import { createRouter, createWebHistory } from 'vue-router'
import SettingsPage from '../views/SettingsPage.vue'
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    component: HomePage
  },
  {
    path: '/settings',
    component: SettingsPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;
