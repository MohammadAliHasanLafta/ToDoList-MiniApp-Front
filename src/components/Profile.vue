<template >
  <div @click.self="closeMenu" class="h-screen w-screen flex justify-center items-center bg-[#ffffff25]">
    <div class="p-6 max-w-md mx-4">
      <div class="text-center mb-6">
        <h2 class="font-semibold text-2xl text-gray-800 mt-2"></h2>
        <button @click="toggleMenu" class="absolute top-4 right-4">
          <i class="fa-solid fa-ellipsis-vertical text-gray-400"></i>
        </button>
        <div
          v-if="isMenuOpen"
          class="absolute top-12 right-4 bg-white border border-gray-200 shadow-lg rounded-lg w-44 z-10" dir="rtl">
          <button @click="showEditModal = true; isMenuOpen = false" class="w-full text-right text-gray-800 px-4 py-2 hover:bg-gray-100">
            <i class="fa-solid fa-pen pl-4"></i>
            ویرایش پروفایل
          </button>
          <button @click="signOut" class="w-full text-right text-gray-800 px-4 py-2 hover:bg-gray-100">
            <i class="fa-solid fa-gear pl-4"></i>
            تنظیمات
          </button>
          <button @click="signOut" class="w-full text-right text-gray-800 px-4 py-2 hover:bg-gray-100 hover:text-red-600">
            <i class="fa-solid fa-right-from-bracket pl-4"></i>
            خروج از حساب
          </button>
        </div>
      </div>

      <div class="text-center mb-6">
        <img src="../assets/profile.png" alt="Profile Picture" class="w-20 h-20 rounded-full mx-auto border-4 border-[#F37F00] shadow-md object-cover" />
        <h2 class="text-lg font-semibold text-gray-800 mt-4">{{ userName }}</h2>
        <p class="text-gray-500 text-base">{{ mobile }}</p>
        <p class="text-gray-500 text-sm">{{ userEmail }}</p>
      </div>

      <div class="bg-gray-100 rounded-lg py-4 px-4 mb-6 shadow-sm">
        <div class="text-center mb-3">
          <h3 class="text-lg font-semibold text-gray-700">وضعیت کارها</h3>
        </div>
        <div class="flex justify-between items-center">
          <div class="text-center">
            <span
              class="text-lg font-bold text-[#FF5C5C]"
              @click="showTasks('pending')"
            >
              {{ pendingtask }}
            </span>
            <p @click="showTasks('pending')" class="text-xs text-gray-600">انجام نشده</p>
          </div>
          <div class="text-center pl-10">
            <span
              class="text-base font-bold text-[#5A8DEE]"
              @click="showTasks('done')"
            >
              {{ taskdone }}
            </span>
            <p @click="showTasks('done')" class="text-xs text-gray-600">انجام شده</p>
          </div>
        </div>

        <div v-if="isModalVisible" class="modal" dir="rtl">
          <div class="modal-content">
            <div class="modal-header">
              <h4>{{ modalTitle }}</h4>
              <span class="close" @click="closeModal">&times;</span>
            </div>
            <div class="modal-body" dir="rtl">
              <ul>
                <li v-for="task in modalTasks" :key="task.id">{{ task.context }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div 
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h3 class="text-xl font-bold mb-4 text-gray-800">ویرایش پروفایل</h3>
        <form @submit.prevent="updateProfile" >
          <div class="mb-4" dir="rtl">
            <input
              v-model="userName"
              placeholder="نام"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]" />
          </div>
          <div class="mb-4" dir="rtl">
            <input
              v-model="userEmail"
              placeholder="ایمیل"
              type="email"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]" />
          </div>
          <div class="flex space-x-2">
            <button
              @click="showEditModal = false"
              type="button"
              class="w-full bg-gray-400 hover:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              لغو
            </button>
            <button
              type="submit"
              class="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['userId', 'phoneNumber', 'firstName', 'todos', 'mobile'],
  data() {
    return {
      isMenuOpen: false,
      id: "",
      profile: null,
      userName: "",
      userEmail: "",
      showEditModal: false, 
      taskdone: 0,
      pendingtask: 0,
      donetask: [],
      undonetask: [],
      isModalVisible: false,
      modalTitle: '',
      modalTasks: [],
    };
  },
  mounted(){
    this.getProfile();
    this.calculateTodos();
  },
  watch: {
    todos: {
      handler(newTodos) {
        this.calculateTodos(newTodos);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async calculateTodos(todos){
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
        this.taskdone = todos.filter(todo => todo.isComplete).length;
        this.pendingtask = todos.filter(todo => !todo.isComplete).length;

        this.donetask = todos.filter(todo => todo.isComplete);
        this.undonetask = todos.filter(todo => !todo.isComplete);
      } catch (error) {
        console.error('مشکل در دریافت لیست کارها:', error);
        this.error = 'خطا در دریافت لیست کارها';
      }

    },
    showTasks(status) {
      this.isModalVisible = true;
      if (status === 'done') {
        this.modalTitle = 'کار های انجام شده';
        this.modalTasks = this.donetask;
      } else if (status === 'pending') {
        this.modalTitle = 'کار های انجام نشده';
        this.modalTasks = this.undonetask;
      }
    },

    closeModal() {
      this.isModalVisible = false;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    async getProfile() {
      try {
        let response = null;

        if (this.userId) {
          await axios.get(`https://todominiapp.runasp.net/get-profile`, {
            params: { UserId: this.userId },
            headers: { 'Accept': 'text/plain' },
          }).then(response => {
            this.profile = response.data;
          });
        } else if (this.phoneNumber) {
          response = await axios.get(`https://todominiapp.runasp.net/get-profile`, {
            params: { PhoneNumber: this.phoneNumber },
            headers: { 'Accept': 'text/plain' },
          }).then(response => {
            this.profile = response.data;
          });
        } else {
          throw new Error('User ID یا شماره تلفن موجود نیست.');
        }
        if(this.firstName == null){
          this.userName = this.profile.userName;
        }
        else{
          this.userName = this.firstName;
        }

        if (this.profile.email == "example@gmail.com") {
          this.userEmail = "";
        }
        else {
          this.userEmail = this.profile.email;
        }
        this.id = this.profile.id;
      } catch (error) {
        console.error('مشکل در دریافت لیست کارها:', error);
        this.error = 'خطا در دریافت لیست کارها';
      }


    },

    async updateProfile() {
      this.isMenuOpen = false;
      try {
        const updatedProfile = {
          id: this.id,
          userName: this.userName,
          email: this.userEmail,
        };

        await axios.put(
          `https://todominiapp.runasp.net/update-profile/${this.id}`,
          updatedProfile,
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
      this.showEditModal = false;
    },
    async signOut() {
      this.isMenuOpen = false;
      try {
        await axios.delete(
          `https://todominiapp.runasp.net/remove-profile/${this.id}`
        );
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
      if(window.Eitaa.WebApp.initData){
        window.Eitaa.WebApp.close();
      }
      else{
        this.$router.push({
          path: '/',
        });
        setTimeout(function() {
            window.location.reload();
        }, 50);
      } 
    },
  },
};
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e4e9f0;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4CAF50;
}

input:checked + .slider:before {
  transform: translateX(18px);
}

.absolute {
  position: absolute;
}
.top-12 {
  top: 3rem;
}
.right-4 {
  right: 1rem;
}
.bg-white {
  background-color: white;
}
.border {
  border: 1px solid #e5e7eb;
}
.shadow-lg {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.rounded-lg {
  border-radius: 8px;
}
.z-10 {
  z-index: 10;
}
.hover\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

.modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); 
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #ffffff;
  padding: 30px 40px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-family: Arial, sans-serif;
  color: #333;
  animation: fadeIn 0.3s ease-in-out;
  direction: rtl; 
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  position: relative;
}

.modal-header h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #5d91f3;
  text-align: center;
}

.close {
  position: absolute;
  right: 0;
  color: #aaa;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close:hover,
.close:focus {
  color: #FF5C5C; 
}

.modal-body {
  font-size: 1rem;
  color: #666;
  text-align: right;
}

.modal-body ul {
  list-style-type: decimal;
  list-style-position: inside; 
  padding: 0;
  margin: 0;
  max-height: 200px; 
  overflow-y: auto; 
}

.modal-body ul li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  text-align: right;
}

.modal-body ul li:last-child {
  border-bottom: none;
}

.modal-body ul::-webkit-scrollbar {
  width: 6px;
}

.modal-body ul::-webkit-scrollbar-thumb {
  background-color: #F37F00;
  border-radius: 10px;
}

.modal-body ul::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}


</style>


