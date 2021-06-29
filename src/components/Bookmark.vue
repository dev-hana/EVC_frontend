<template>
  <div class="bookmark-page">
    <div class="bookmark-title">즐겨찾기 목록</div>
    <div class="bookmark-contents">
      <div class="contents-left">
        <div
          class="bookmark-list"
          v-for="data in bookMark"
          :key="data.mem_id[0]"
          @click="() => onMoveDetail(data.addr)"
        >
          <div class="bookmark-info">
            <div class="bookmark-name">
              {{ data.csNm }} <span class="bookmark-csid">({{ data.csId }})</span>
            </div>
            <div class="bookmark-text">{{ data.addr }}</div>
            <div class="bookmark-date">
              {{
                `${new Date(data.date).getFullYear()}/${new Date(data.date).getMonth()}/${new Date(
                  data.date
                ).getDate()} ${new Date(data.date).getHours()}:${new Date(data.date).getMinutes()}:${new Date(
                  data.date
                ).getSeconds()}`
              }}
            </div>
          </div>
        </div>
      </div>
      <!-- Grafana Iframe-->
      <div class="contents-right">
        <iframe
          :src="
            `http://34.64.137.56:3000/d-solo/sHburURnk/csidreview?orgId=1&panelId=6&theme=light&var-mem_id=${userData}`
          "
          width="450"
          height="200"
          frameborder="0"
        ></iframe>
        <iframe
          :src="
            `http://34.64.137.56:3000/d-solo/sHburURnk/csidreview?orgId=1&&panelId=10&theme=light&var-mem_id=${userData}`
          "
          width="450"
          height="200"
          frameborder="0"
        ></iframe>
        <iframe
          :src="
            `http://34.64.137.56:3000/d-solo/sHburURnk/csidreview?orgId=1&panelId=8&theme=light&var-mem_id=${userData}`
          "
          width="450"
          height="200"
          frameborder="0"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";
import { useRouter } from "vue-router";

export default {
  name: "Bookmark",

  setup() {
    // 라우터 사용
    const router = useRouter();
    // 스토어 사용
    const store = useStore();
    // 로그인 정보 가져옴
    const userData = computed(() => store.getters["user/userInfo"]);

    const state = reactive({
      bookMark: [], // 즐겨찾기 목록
    });

    onMounted(() => {
      onGetBookmark();
    });

    // 즐겨찾기 목록 조회
    const onGetBookmark = () => {
      axios.get(`/api/bookmark/search`, { params: { mem_id: userData.value } }).then((response) => {
        if (response.data) {
          state.bookMark = response.data;
          for (let i = 0; i < state.bookMark.length; i++) {
            axios.get(`/api/charge/csId`, { params: { id: state.bookMark[i].csId } }).then((response_) => {
              if (response_.data) {
                if (response_.data == "Fail") {
                  state.bookMark[i].addr = "";
                } else {
                  state.bookMark[i].addr = response_.data["addr"];
                  state.bookMark[i].csNm = response_.data["name"];
                }
              }
            });
          }
        }
      });
    };

    // 상세보기로 이동
    const onMoveDetail = (addr) => {
      router.push(`/main/charge/${addr}`);
    };

    return {
      ...toRefs(state),
      userData,
      onMoveDetail,
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/bookmark.scss";
</style>
