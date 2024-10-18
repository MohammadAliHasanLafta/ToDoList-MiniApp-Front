<template>
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
</template>

<script>

</script>

<style>

</style>