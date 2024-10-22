<template>
    <div class="bg-[#ffffffb7] p-8 rounded-xl shadow-lg w-full max-w-md text-center border-solid border-2 border-[#F37F00]">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">لیست کارهای شما</h2>

      <form @submit.prevent="addTodo" class="mb-4 space-y-4" dir="rtl">
        <input
          v-model="newTodoTitle"
          placeholder="کار جدید خود را اضافه کنید..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]" />
        <button
          type="submit"
          class="w-full bg-[#FF8100] hover:bg-[#FFA242] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          اضافه کردن
        </button>
      </form>

      <div v-if="todos.length === 0" class="text-center">
        <p dir="rtl">هیچ کاری ثبت نشده است.</p>
      </div>

      <div v-else class="overflow-y-auto max-h-40">
        <ul class="space-y-2" dir="rtl">
          <li
            v-for="todo in todos"
            :key="todo.id"
            class="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
            <span :class="{ 'line-through': todo.isComplete }">{{ todo.context }}</span>
            <div class="flex space-x-2">
              <button
                @click="updateTodo(todo)"
              class="bg-green-500  hover:bg-green-400 text-white py-1 px-2 rounded-lg ml-2">
                {{ todo.isComplete ? 'لغو' : 'انجام شد' }}
              </button>
              <button
                @click="deleteTodo(todo.id)"
                class="bg-red-600 hover:bg-red-500 text-white py-1 px-2 rounded-lg">
                حذف
              </button>
            </div>
          </li>
        </ul>
      </div> 
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['userId', 'phoneNumber'],
  data() {
    return {
      newTodoTitle: '',
      todos: [],
    //   phoneNumber: null,
    //   userId: null, 
    };
  },
  mounted(){
    this.loadTodos();
  },
  methods: {
  async loadTodos() {
      try {
        let response = null;

        if (this.userId) {
          response = await axios.get(`https://todominiapp.runasp.net/get-all-todos`, {
            params: { UserId: this.userId },
            headers: { 'Accept': 'text/plain' },
          });
        } else if (this.phoneNumber) {
          response = await axios.get(`https://todominiapp.runasp.net/get-all-todos`, {
            params: { PhoneNumber: this.phoneNumber },
            headers: { 'Accept': 'text/plain' },
          });
        } else {
          throw new Error('User ID یا شماره تلفن موجود نیست.');
        }

        this.todos = response.data;
      } catch (error) {
        console.error('مشکل در دریافت لیست کارها:', error);
        this.error = 'خطا در دریافت لیست کارها';
      }
    },
    async addTodo() {
      if (this.newTodoTitle.trim() !== '') {
        const newTodo = {
          context: this.newTodoTitle,
          userId: this.userId || 0,
          phoneNumber: this.phoneNumber || null
        };

        try {
          await axios.post(
            'https://todominiapp.runasp.net/create-todo',
            newTodo,
            { headers: { 'Content-Type': 'application/json' } }
          );

          this.todos.push(this.loadTodos());
          this.newTodoTitle = '';
        } catch (error) {
          console.error('Failed to add todo:', error);
        }
      }
    },
    async updateTodo(todo) {
      try {
        const updatedTodo = {
          id: todo.id,
          context: todo.context,
          isComplete: !todo.isComplete,
        };

        await axios.put(
          `https://todominiapp.runasp.net/update-todo/${todo.id}`,
          updatedTodo,
          { headers: { 'Content-Type': 'application/json' } }
        );

        todo.isComplete = !todo.isComplete;
      } catch (error) {
        console.error('Failed to update todo:', error);
      }
    },
    async deleteTodo(todoId) {
      try {
        await axios.delete(
          `https://todominiapp.runasp.net/remove-todo/${todoId}`
        );

        this.todos = this.todos.filter((t) => t.id !== todoId);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    },
  },
};
</script>

<style>
.line-through {
  text-decoration: line-through;
}
</style>