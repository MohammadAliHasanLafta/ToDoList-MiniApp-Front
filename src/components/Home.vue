<template>
  <div @click.self="closeMenu" class="h-screen w-screen flex justify-center items-start bg-[#ffffff25]">
      <div class="p-6 w-full max-w-xs mx-auto mt-4 text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">لیست کارهای شما</h2>

          <div v-if="todos.length === 0" class="text-center mb-4 text-gray-500" dir="rtl">
              <p>هیچ کاری ثبت نشده است.</p>
          </div>

          <div class="custom-scroll overflow-y-auto">
              <ul class="space-y-3" dir="rtl">
                  <li
                      v-for="todo in todos"
                      :key="todo.id"
                      class="flex justify-between items-center bg-gray-50 p-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
                      
                      <span 
                          :class="{ 'line-through text-gray-400': todo.isComplete }" 
                          class="flex-1 text-right text-lg font-medium text-gray-700 pr-2">
                          {{ todo.context }}
                      </span>
                      
                      <div class="flex space-x-2">
                          <button
                              @click="updateTodo(todo)"
                              class="text-blue-500 p-2">
                              <i :class="todo.isComplete ? 'fas fa-undo' : 'fas fa-check'"></i>
                          </button>

                          <button
                              @click="deleteTodo(todo.id)"
                              class="text-red-500 p-2">
                              <i class="fas fa-trash-alt"></i>
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
  props: ['userId', 'phoneNumber', 'todos'],
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
  watch: {
    todos: {
      handler(newTodos) {
        this.loadTodos(newTodos);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
  async loadTodos(todos) {
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

        todos = response.data;
      } catch (error) {
        console.error('مشکل در دریافت لیست کارها:', error);
        this.error = 'خطا در دریافت لیست کارها';
      }
      this.todos = todos.reverse();
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
.custom-scroll {
  max-height: calc(90vh - 8rem); /* محدود کردن ارتفاع به اندازه صفحه */
  overflow-y: auto;
}

.custom-scroll::-webkit-scrollbar {
  width: 8px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #ff9500;
  border-radius: 10px;
  border: 2px solid #f0f0f0;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #ff7a00;
}
</style>