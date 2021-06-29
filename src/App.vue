<template>
  <div class="app-page">
    <!-- 상단 메뉴 -->
    <Header />

    <!-- 하단 내용 -->
    <div class="app-body">
      <!-- 라우터 화면 전환 -->
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";

export default {
  name: "App",
  components: {
    Header,
  },
};
</script>
<style lang="scss">
@import "@/styles/app.scss";
</style>
