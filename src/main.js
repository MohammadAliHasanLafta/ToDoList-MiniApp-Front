import './assets/Index.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import TodoList from '../src/components/ToDoList.vue';
import Profile from '../src/components/Profile.vue';


const routes = [
  { path: '/app', component: App },
  { path: '/', component: TodoList },
  { path: '/profile', component: Profile },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
  });

export default router;

const app = createApp(App);
app.use(router);
app.mount('#app');
