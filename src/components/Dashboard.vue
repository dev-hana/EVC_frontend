<template>
  <div class="dashboard-page">
    <div class="dashboard-title">충전소 정보</div>
        <!-- Grafana iframe -->
        <div class="dashboard-detail-group">
          <iframe
            class="dashboard-iframe"
            :src="
              `http://34.64.137.56:3000/d/VS-3mwR7z/dashboard?orgId=1&kiosk&theme=light`
            "
          />
        </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";

export default {
  name: "Dashboard",
  components: {

  },
  setup() {
    // 스토어 사용
    const store = useStore();
    // 로그인 정보 가져옴
    const userData = computed(() => store.getters["user/userInfo"]);
    return {
      userData,
    };
  },
};
</script>
<style lang="scss">
.dashboard-iframe {
  margin-top: 10px;
  width: 100%;
  height: 650px;
  border: none;
  overflow: hidden;
}
.dashboard-title {
    margin-bottom: 30px;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
  }
</style>

