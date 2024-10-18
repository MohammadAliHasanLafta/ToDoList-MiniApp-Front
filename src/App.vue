<template>
  <div id="app" class="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
    <div v-if="!isLoggedIn" class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
      <h1 class="text-2xl font-bold text-gray-800 mb-20" dir="rtl">در حال دریافت اطلاعات...</h1>

      <div class="text-center">
        <div role="status">
          <svg
            aria-hidden="true"
            class="inline w-8 h-8 text-gray-200 animate-spin dark:text-blue-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor" />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill" />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <div v-else class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">لیست کارهای شما</h2>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ error }}</h2>
      

      <form @submit.prevent="addTodo" class="mb-4 space-y-4" dir="rtl">
        <input
          v-model="newTodoTitle"
          placeholder="کار جدید خود را اضافه کنید..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
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
                class="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-lg ml-2">
                {{ todo.isComplete ? 'واگرد' : 'انجام شد' }}
              </button>
              <button
                @click="deleteTodo(todo.id)"
                class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-lg">
                حذف
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isLoggedIn: false,
      newTodoTitle: '',
      todos: [],
      initData : `
    query_id=AAEAAQAAAAAAAQAAAABBf7z
    &user={"id":123456789,"first_name":"John","username":"johndoe"}
    &auth_date=1697300123
    &hash=098f6bcd4621d373cade4e832627b4f6
  `,
      userId: null, 
      error: null,
      log: null,
    };
  },
  async mounted() {
    // const tg = window.Telegram.WebApp;

    // this.initData = tg.initData || "";
    // tg.expand();

    this.extractUserIdFromInitData();

    if (this.userId) {
      this.loadTodos();
    } else {
      console.error("User ID not found in initData.");
      this.error = "مشکل در دریافت اطلاعات کاربر.";
    }
  },
  methods: {

    extractUserIdFromInitData() {
    try {
      const params = new URLSearchParams(this.initData);
      const user = JSON.parse(params.get("user"));

      if (user && user.id) {
        this.userId = user.id;
        this.log= "User ID: "+ this.userId;

        this.isLoggedIn = true; 
      } else {
        console.warn("User ID not found in initData.");
        this.error = "مشکل در دریافت اطلاعات کاربر.";
      }
    } catch (error) {
      console.error("Failed to extract User ID:", error);
      this.error = "احراز هویت ناموفق بود.";
    }
  },

    async loadTodos() {
      try {
        const response = await axios.get(`https://todominiapp.runasp.net/get-all-todos/${this.userId}`);
        this.todos = response.data;
      } catch (error) {
        console.error('Failed to load todos:', error);
        this.error = 'مشکل در دریافت لیست کارها';
      }
    },
    async addTodo() {
      if (this.newTodoTitle.trim() !== '') {
        const newTodo = {
          context: this.newTodoTitle,
          userId: this.userId,
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
