<template>
  <div class="bg-[#ffffffb7] p-8 rounded-xl shadow-lg w-full max-w-md text-center border-solid border-2 border-[#F37F00] mx-auto">
    
    <div class="flex justify-center mb-4">
      <img
        src="../assets/profile.png"
        alt="عکس پروفایل"
        class="w-32 h-32 rounded-full border-4 border-[#F37F00] shadow-lg object-cover" />
    </div>

    <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ userName }}</h2>
    <p class="text-gray-600 mb-4">{{ userEmail }}</p>

    <div class="space-y-4">
      <button
        @click="showEditModal = true"
        class="w-full bg-[#FF8100] hover:bg-[#FFA242] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
        ویرایش پروفایل
      </button>

      <button
        @click="logout"
        class="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
        خروج از حساب
      </button>
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
              type="submit"
              class="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              ذخیره
            </button>
            <button
              @click="showEditModal = false"
              type="button"
              class="w-full bg-gray-400 hover:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              لغو
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

---

### اسکریپت (Script):

```javascript
<script>
import axios from 'axios';

export default {
  props: ['userId', 'phoneNumber'],
  data() {
    return {
      id: "",
      profile: null,
      userName: "",
      userEmail: "",
      showEditModal: false, 
    };
  },
  mounted(){
    this.getProfile();
  },
  methods: {
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
        this.userName = this.profile.userName;
        this.userEmail = this.profile.email;
        this.id = this.profile.id;
      } catch (error) {
        console.error('مشکل در دریافت لیست کارها:', error);
        this.error = 'خطا در دریافت لیست کارها';
      }
    },
    async updateProfile() {
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
    async logout() {
      try {
        await axios.delete(
          `https://todominiapp.runasp.net/remove-profile/${this.id}`
        );
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
      this.$router.push({
          path: '/',
        });
    },
  },
};
</script>
