<template>
  <div class="header">
    <!-- 로고 -->
    <router-link to="/main/map" class="logo-area"
      ><span class="project-name">EVC</span><img src="/img/electric.png" alt="logo"
    /></router-link>

    <!-- 메뉴 -->
    <div class="nav">
      <div class="menu" @click="() => selectMenu('/main/map')" :class="route.path.includes('/main') ? 'active' : ''">
        전기차 충전소
      </div>
      <router-link to="/bookmark" class="menu" active-class="active">즐겨찾기</router-link>
      <router-link to="/dashboard" class="menu" active-class="active">충전소 정보</router-link>
    </div>

    <!-- 로그인/로그아웃 -->
    <div v-if="userData" class="user-area">
      <div class="user">
        <span>{{ userData }}</span
        >님 환영합니다
      </div>
      <button class="basic-btn" @click="onLogout">로그아웃</button>
    </div>
    <div v-else>
      <router-link to="/login"><button class="basic-btn">로그인</button></router-link>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "Header",
  setup() {
    // 라우터 사용
    const route = useRoute();
    const router = useRouter();

    // 스토어 사용
    const store = useStore();
    // 로그인 정보 가져옴
    const userData = computed(() => store.getters["user/userInfo"]);

    // 로그아웃 액션 호출
    const onLogout = () => {
      store.dispatch("user/LOGOUT");
    };

    // 메뉴 선택 이벤트
    const selectMenu = (path) => {
      router.push(path);
    };

    return {
      userData,
      onLogout,
      selectMenu,
      route,
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/header.scss";
</style>
