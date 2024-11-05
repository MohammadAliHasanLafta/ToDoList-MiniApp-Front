<template >
  <div @click.self="closeMenu" class="h-screen w-screen flex justify-center items-center bg-[#ffffff9f]">
    <div class="p-6 max-w-md mx-4">
      <div class="text-center mb-6">
        <h2 class="font-semibold text-2xl text-gray-800 mt-2"></h2>
        <button @click="toggleMenu" class="absolute top-4 right-4">
          <i class="fa-solid fa-ellipsis-vertical text-gray-400"></i>
        </button>
        <div
          v-if="isMenuOpen"
          class="absolute top-12 right-4 bg-white border border-gray-200 shadow-lg rounded-lg w-40 z-10">
          <button @click="showEditModal = true; isMenuOpen = false" class="w-full text-green-700 text-center px-4 py-2 hover:bg-gray-100">
            <i class="fa-solid fa-pen"></i>
            ویرایش پروفایل
          </button>
          <button @click="signOut" class="w-full text-center text-red-700 px-4 py-2 hover:bg-gray-100">
            <i class="fa-solid fa-right-from-bracket"></i>
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
            <span class="text-lg font-bold text-[#FF5C5C]">{{ pendingtask }}</span>
            <p class="text-xs text-gray-600">انجام نشده</p>
          </div>
          <div class="text-center pl-10">
            <span class="text-base font-bold text-[#5A8DEE]">{{ taskdone }}</span>
            <p class="text-xs text-gray-600">انجام شده</p>
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
  props: ['userId', 'phoneNumber', 'firstName', 'todos'],
  data() {
    return {
      isMenuOpen: false,
      id: "",
      profile: null,
      userName: "",
      userEmail: "",
      mobile: "",
      showEditModal: false, 
      taskdone: 0,
      pendingtask: 0,
    };
  },
  mounted(){
    this.getProfile();
    this.getMobile()
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
        this.pendingtask = todos.filter(todo => todo.isComplete == false).length;
      } catch (error) {
        console.error('مشکل در دریافت لیست کارها:', error);
        this.error = 'خطا در دریافت لیست کارها';
      }

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
        
        this.userEmail = this.profile.email;
        this.id = this.profile.id;
      } catch (error) {
        console.error('مشکل در دریافت لیست کارها:', error);
        this.error = 'خطا در دریافت لیست کارها';
      }


    },

    async getMobile() {
      const et = window.Eitaa.WebApp;

      try {
        const response = await axios.get(`https://todominiapp.runasp.net/get-miniappuser-mobile?UserId=${this.userId}`, {
          headers: {
            'accept': '*/*'
          }
        });
        if (response.status == 200) {
          this.mobile = response.data;
          console.log("mobile : "+this.mobile);
          
        } else {
          et.requestContact((isShared) => {
            if (!isShared) {
              sessionStorage.setItem("isPhoneShared", "false");
            }
          });

          et.onEvent("contactRequested", (contact) => {
            this.sendMessengerPhone(contact);
          });
        }
      } catch (error) {
        console.error("Error checking user phone:", error);
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
/* Toggle Switch Styling */
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

/* Menu Dropdown */
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
</style>


