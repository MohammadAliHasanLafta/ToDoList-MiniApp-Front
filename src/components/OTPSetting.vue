<template>
    <div class="bg-[#ffffffb7] p-8 rounded-xl shadow-lg w-full max-w-md text-center border-solid border-2 border-[#F37F00] mx-auto">
      
      <div class="flex justify-center mb-4">
        <img
          src="https://kavenegar.com/images/logo.svg"
          alt="کاوه نگار"
          class="w-32 h-32 rounded-full border-4 border-[#F37F00] shadow-lg object-cover" />
      </div>
  
      <h2 class="text-1xl font-bold text-gray-800 mb-5">راهنمای وصل کردن سیستم ارسال پیامکی کاوه نگار</h2>
  
      <div class="space-y-4">
        <button
          @click="setting"
          class="w-full bg-[#FF8100] hover:bg-[#FFA242] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          راهنما
        </button>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return {
      };
    },
    methods: {
      async setting() {
        window.Eitaa.WebApp.openLink("https://kavenegar.com/rest.html");
        // window.location.href = "https://kavenegar.com/rest.html";
        this.$router.replace({
          path: '/',
        });
      },
    },
  };
  </script>
  