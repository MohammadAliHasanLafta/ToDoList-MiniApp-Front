<template>
  <div id="app" class="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
    <div v-if="isLoggedIn" class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
      <h1 class="text-2xl font-bold text-gray-800 mb-20" dir="rtl">در حال دریافت اطلاعات...</h1>

      <div class="text-center ">
              <div role="status">
                  <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-blue-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span class="sr-only">Loading...</span>
              </div>
          </div>

          <!-- <button @click="closeApp" class="close-button">Close Web App</button> -->

      <!-- <form v-if="!otpSent" @submit.prevent="sendOtp" class="space-y-4" dir="rtl">
        <div>
          <input v-model="phoneNumber" 
            placeholder="شماره خود را وارد کنید..." 
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" 
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors items-center">
          <span v-if="!isLoading">ارسال کد</span>
          <div v-else class="text-center ">
              <div role="status">
                  <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-100" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span class="sr-only">Loading...</span>
              </div>
          </div>
        </button>
      </form>
      
      <div v-if="otpSent" class="mt-6 space-y-4">
        <h4 dir="rtl">کد ارسال شده به {{ phoneNumber }} را وارد کنید.</h4>
        <div class="flex justify-center space-x-2">
          <input v-for="(digit, index) in otp" :key="index" type="text" maxlength="1"
            v-model="otp[index]" 
            @input="moveToNext($event, index)" 
            @keydown.backspace="moveToPrev($event, index)"
            class="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg" />
        </div>
        <button @click="verifyOtp" 
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors">
          تایید کد
        </button>
      </div> -->
    </div>

    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">لیست کارهای شما</h2>

      <form @submit.prevent="addTodo" class="mb-4 space-y-4" dir="rtl">
        <input v-model="newTodoTitle" 
          placeholder="کار جدید خود را اضافه کنید..." 
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="submit" 
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          اضافه کردن
        </button>
      </form>

      <div v-if="todos.length == 0" class="text-center ">
          <div role="status">
              <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span class="sr-only">Loading...</span>
          </div>
      </div>
      <div v-else class="overflow-y-auto max-h-40">
        <ul class="space-y-2" dir="rtl">
          <li v-for="(todo, index) in todos" :key="index" class="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
            <span :class="{'line-through': todo.completed}">{{ todo.title }}</span>
            <div class="flex space-x-2">
              <button @click="toggleComplete(index)" 
                class="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-lg ml-2">
                {{ todo.completed ? 'واگرد' : 'انجام شد' }}
              </button>
              <button @click="deleteTodo(index)" 
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
      isLoading: false,
      user: null,
      initData: "",
      expirationTime: 7 * 24 * 60 * 60 * 1000,
    };
  },
  mounted() {
    const tg = window.Telegram.WebApp;

    this.initData = tg.initData || "";
    tg.expand();

    this.verifyInitData();

    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
    }
  },

  methods: {
    async verifyInitData() {
    try {
      const response = await axios.post(
        "http://192.168.1.5:7298/api/v1/account/verify-initdata", 
        {
          initData:
            this.initData
        },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json"
          }
        }
      );

      this.user = response.data.user;
      this.isLoggedIn = true;
    } catch (error) {
      console.error("Verification failed:", error);
      alert("احراز هویت ناموفق بود.");
    } finally {
      this.isLoading = false; 
    }
  },

    // moveToNext(event, index) {
    //   const input = event.target;
    //   if (input.value.length === 1 && input.nextElementSibling) {
    //     input.nextElementSibling.focus(); 
    //   }
    // },

    // moveToPrev(event, index) {
    //   const input = event.target;
    //   if (event.key === 'Backspace' && input.value === '' && input.previousElementSibling) {
    //     input.previousElementSibling.focus(); 
    //   }
    // },

    saveTodos() {
      const data = {
        todos: this.todos,
        timestamp: Date.now() 
      };
      localStorage.setItem(`todos_${this.user.id}`, JSON.stringify(data));
    },

    loadTodos() {
      const storedData = localStorage.getItem(`todos_${this.user.id}`);
      if (storedData) {
        const { todos, timestamp } = JSON.parse(storedData);
        const now = Date.now();

        if (now - timestamp < this.expirationTime) {
          this.todos = todos; 
        } else {
          localStorage.removeItem(`todos_${this.user.id}`); 
        }
      }
    },

    addTodo() {
      if (this.newTodoTitle.trim() !== '') {
        this.todos.push({ title: this.newTodoTitle, completed: false });
        this.newTodoTitle = ''; 
        this.saveTodos(); 
      }
    },

    toggleComplete(index) {
      this.todos[index].completed = !this.todos[index].completed;
      this.saveTodos();
    },

    deleteTodo(index) {
      this.todos.splice(index, 1);
      this.saveTodos(); 
    },
  }
};
</script>

<style>
.line-through {
  text-decoration: line-through;
}
</style>
