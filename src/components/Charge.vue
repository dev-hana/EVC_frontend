<template>
  <div class="charge-page">
    <div class="charge-title">
      <!-- 충전소이름 -->
      <span class="charge-point-title">{{ evDetailData[0]?.csNm[0] }}</span>
      <!-- 충전소 주소 -->
      <div class="charge-address">{{ evDetailData[0]?.addr[0] }}</div>

      <!-- 로그인했을 시에만 즐겨찾기 추가 버튼 표시 -->
      <div v-if="userData">
        <HeartFilled v-if="isBookmark" @click="deleteBookMark" />
        <HeartOutlined v-else @click="addBookMark" />
      </div>
    </div>

    <div class="charge-contents">
      <div class="charge-left">
        <!-- 충전기 목록 -->
        <div class="charge-detail-group">
          <div class="sub-title">충전기 목록</div>
          <div class="charge-detail-item" v-for="data in evDetailData" :key="data.cpId[0]">
            <div class="charge-detail-row">
              <div class="charge-name">
                <!-- 충전기상태 색상 표시 -->
                <span v-if="data.cpStat[0] === '1'" class="status-dot bg-blue"></span>
                <span v-if="data.cpStat[0] === '2'" class="status-dot bg-red"></span>
                <span v-if="data.cpStat[0] === '3'" class="status-dot bg-grey"></span>
                <span v-if="data.cpStat[0] === '4'" class="status-dot bg-grey"></span>
                <span v-if="data.cpStat[0] === '5'" class="status-dot bg-grey"></span>
                <!-- 충전기이름 및 충전기id -->
                {{ data.cpNm[0] }} <span class="charge-id">({{ data.cpId[0] }})</span>
              </div>
            </div>

            <!-- 충전기상태 -->
            <div class="charge-detail-row">
              <div class="row-title">충전기상태</div>
              <div class="row-value">
                <div v-if="data.cpStat[0] === '1'">
                  충전가능
                </div>
                <div v-else-if="data.cpStat[0] === '2'">
                  충전중
                </div>
                <div v-else-if="data.cpStat[0] === '3'">
                  고장/점검
                </div>
                <div v-else-if="data.cpStat[0] === '4'">
                  통신장애
                </div>
                <div v-else-if="data.cpStat[0] === '5'">
                  통신미연결
                </div>
              </div>
            </div>

            <!-- 충전기타입 -->
            <div class="charge-detail-row">
              <div class="row-title">충전기타입</div>
              <div class="row-value">
                <div v-if="data.chargeTp[0] === '1'">완속</div>
                <div v-else>급속</div>
              </div>
            </div>

            <!-- 충전방식 -->
            <div class="charge-detail-row">
              <div class="row-title">충전방식</div>
              <div class="row-value">
                <div v-if="data.cpTp[0] === '1'">B타입(5핀)</div>
                <div v-else-if="data.cpTp[0] === '2'">C타입(5핀)</div>
                <div v-else-if="data.cpTp[0] === '3'">BC타입(5핀)</div>
                <div v-else-if="data.cpTp[0] === '4'">BC타입(7핀)</div>
                <div v-else-if="data.cpTp[0] === '5'">DC차데모</div>
                <div v-else-if="data.cpTp[0] === '6'">AC3상</div>
                <div v-else-if="data.cpTp[0] === '7'">DC콤보</div>
                <div v-else-if="data.cpTp[0] === '8'">DC차데모+DC콤보</div>
                <div v-else-if="data.cpTp[0] === '9'">DC차데모+AC3상</div>
                <div v-else-if="data.cpTp[0] === '10'">DC차데모+DC콤보+AC3상</div>
              </div>
            </div>

            <!-- 업데이트 시간 -->
            <div class="charge-detail-row">
              <div class="row-title">업데이트 시간</div>
              <div class="row-value">
                {{ data.statUpdateDatetime[0] }}
              </div>
            </div>
          </div>
        </div>

        <!-- 리뷰 -->
        <div class="charge-detail-group">
          <div class="sub-title">리뷰</div>
          <!-- 별점 -->
          <a-rate v-model:value="star" allow-half />
          <!-- 리뷰 내용 -->
          <textarea id="review" v-model="reviewContents" rows="3" class="reivew-textarea" />
          <!-- 등록 버튼 -->
          <button :class="`basic-btn ${userData ? '' : 'disabled'}`" @click="onAddReview">등록</button>

          <!-- 로그인한 사용자가 등록한 리뷰 목록 -->
          <div class="review-list" v-for="(item, index) in reviewList" :key="index">
            <div class="review-row">
              <a-rate v-model:value="item.star" allow-half :disabled="!targetData" />
              <div class="review-buttons">
                <!-- 수정 버튼 -->
                <FormOutlined @click="() => setTargetData(item)" />
                <!-- 삭제 버튼 -->
                <DeleteOutlined @click="() => onDeleteReview(item)" />
              </div>
            </div>
            <!-- 본인일 시  -->
            <div v-if="targetData" class="review-row">
              <textarea id="review-item" v-model="item.content" rows="3" class="reivew-textarea" />
              <button class="basic-btn edit-btn" @click="onEditReview">수정</button>
            </div>
            <div v-else class="contents">{{ item.content }}</div>
          </div>
        </div>

        <!-- 모든 리뷰 목록-->
        <div class="review-list" v-for="(item_, index_) in reviewListNonMem" :key="index_">
          <hr />
          <div class="review-row">
            <a-rate v-model:value="item_.star" allow-half :disabled="!targetData" />
            <span> {{ item_.mem_id }}</span>
          </div>
          <div class="contents">{{ item_.content }}</div>
        </div>
      </div>

      <div class="charge-right">
        <!-- grafana -->
        <div class="charge-detail-group">
          <div class="sub-title">이용자 현황</div>
          <iframe
            :src="
              `http://34.64.137.56:3000/d-solo/sHburURnk/csidreview?orgId=1&panelId=4&theme=light&var-csId=${evDetailData[0]?.csId[0]}`
            "
            width="450"
            height="200"
            frameborder="0"
          ></iframe>
          <iframe
            :src="
              `http://34.64.137.56:3000/d-solo/sHburURnk/csidreview?orgId=1&panelId=7&theme=light&var-csId=${evDetailData[0]?.csId[0]}`
            "
            width="450"
            height="200"
            frameborder="0"
          ></iframe>
          <iframe
            :src="
              `http://34.64.137.56:3000/d-solo/sHburURnk/csidreview?orgId=1&panelId=2&theme=light&var-csId=${evDetailData[0]?.csId[0]}`
            "
            width="450"
            height="200"
            frameborder="0"
          ></iframe>
        </div>

        <!-- 지도 -->
        <div class="charge-detail-group">
          <div class="sub-title">위치</div>
          <div id="map" class="map" style="width:100%; height:300px;margin-top:10px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";
import { onMounted, reactive, toRefs } from "vue";
import axios from "axios";
import { HeartOutlined, HeartFilled, FormOutlined, DeleteOutlined } from "@ant-design/icons-vue";

export default {
  name: "Charge",
  components: {
    HeartOutlined,
    HeartFilled,
    FormOutlined,
    DeleteOutlined,
  },
  setup() {
    // 스토어 사용
    const store = useStore();
    // 로그인 정보 가져옴
    const userData = computed(() => store.getters["user/userInfo"]);

    const state = reactive({
      map: null, // 지도
      evDetailData: [], // 충전소 정보
      reviewList: [], // 로그인한 사용자 리뷰 정보
      reviewListNonMem: [], // 로그인한 사용자를 제외한 사용자 리뷰 정보
      reviewContents: "", // 리뷰 작성 내용(textarea)
      star: 0, // 별점
      targetData: null, // 수정/삭제할 선택 리뷰 정보
      isBookmark: false, // 즐겨찾기 등록 여부
    });

    onMounted(() => {
      // 충전소 정보 호출
      onGetEv();
    });

    // 지도 호출
    const addKakaoMapScript = () => {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(getPosition());
      script.src = "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=a254914d8251dd53660a2cb48826fad6";
      document.head.appendChild(script);
    };

    // 현재위치 호출
    const getPosition = (evDetailData) => {
      initMap(evDetailData[0].lat, evDetailData[0].longi);
    };

    // 맵 초기화
    const initMap = async (x, y) => {
      const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
      const options = {
        //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(x, y), //지도의 중심좌표.
        level: 5, //지도의 레벨(확대, 축소 정도)
      };

      state.map = new kakao.maps.Map(container, options);

      let imageSrc = "/img/marker_blue.png";

      let imageSize = new kakao.maps.Size(35, 35);
      // 마커 이미지를 생성합니다
      let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
      // 마커가 표시될 위치입니다
      let markerPosition = new kakao.maps.LatLng(x, y);

      // 마커를 생성합니다
      let marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage, // 마커 이미지
      });
      // 마커 맵 추가
      marker.setMap(state.map);
      state.map.setDraggable(false);
    };

    // 충전소 상세 정보 조회
    const onGetEv = async () => {
      const splitPath = window.location.pathname.split("/");
      const address = splitPath[splitPath.length - 1];

      await axios.get(`/api/ev/detail`, { params: { addr: address } }).then((response) => {
        if (response.data) {
          state.evDetailData = response.data;
          window.kakao && window.kakao.maps ? getPosition(response.data) : addKakaoMapScript();

          onGetNomReview(response.data[0].csId[0]);

          if (userData.value) {
            onGetReview(response.data[0].csId[0]);
            onGetBookMark(response.data[0].csId[0]);
          }
        }
      });
    };

    // 로그인한 사용자 리뷰 조회
    const onGetReview = async (csId) => {
      const csIdValue = csId || state.evDetailData[0].csId[0];
      await axios.get(`/api/review/?mem_id=${userData.value}&csId=${parseInt(csIdValue)}`).then((response) => {
        if (Array.isArray(response.data)) {
          state.reviewList = response.data;
        } else if (response.data == "none") {
          state.reviewList = [];
        }
      });
    };

    // 비수정 리뷰 목록 조회
    const onGetNomReview = async (csId) => {
      const csIdValue = csId || state.evDetailData[0].csId[0];
      await axios.get(`/api/review/?csId=${parseInt(csIdValue)}`).then((response) => {
        if (Array.isArray(response.data)) {
          state.reviewListNonMem = response.data;
        } else if (response.data == "none") {
          state.reviewListNonMem = [];
        }
      });
    };

    // 리뷰 등록
    const onAddReview = () => {
      if (!state.reviewContents && !state.star) {
        alert("리뷰 내용을 작성해주세요.");
      } else {
        const params = {
          mem_id: userData.value,
          star: state.star,
          csId: parseInt(state.evDetailData[0].csId[0]),
          content: state.reviewContents,
        };

        axios.post(`/api/review/new`, params).then((response) => {
          if (response.data) {
            if (response.data === "Fail") {
              alert("이미 리뷰를 등록한 충전소입니다.");
            } else {
              onGetReview();
            }

            state.reviewContents = "";
            state.star = 0;
            document.getElementById("review").value = "";
          }
        });
      }
    };

    // 리뷰 수정
    const onEditReview = () => {
      const { mem_id, star, csId, content } = state.targetData;
      const params = { mem_id: mem_id, star: star, csId: csId, content: content };

      axios.patch(`/api/review/mod`, params).then((response) => {
        if (response.data) {
          state.targetData = null;
          onGetReview();
        }
      });
    };

    // 리뷰 삭제
    const onDeleteReview = (targetData) => {
      const result = confirm("리뷰를 삭제하시겠습니까?");

      if (result) {
        const { mem_id, csId } = targetData;
        axios.delete(`/api/review/nomore?mem_id=${mem_id}&csId=${csId}`).then((response) => {
          if (response.data) {
            state.targetData = null;
            onGetReview();
          }
        });
      }
    };

    // 수정할 대상 리뷰 정보 저장
    const setTargetData = (data) => {
      state.targetData = data;
    };

    // 즐겨찾기 정보 조회
    const onGetBookMark = (evDataCsId) => {
      axios.get(`/api/bookmark/search?mem_id=${userData.value}`).then((response) => {
        if (response.data) {
          if (
            userData.value === response.data[0].mem_id &&
            response.data.filter((data) => data.csId === evDataCsId).length > 0
          ) {
            state.isBookmark = true;
          }
        }
      });
    };

    // 즐겨찾기에 추가
    const addBookMark = () => {
      axios
        .post(`/api/bookmark/book`, { mem_id: userData.value, csId: parseInt(state.evDetailData[0]?.csId[0]) })
        .then((response) => {
          if (response.data) {
            state.isBookmark = true;
          }
        });
    };

    // 즐겨찾기에서 삭제
    const deleteBookMark = () => {
      axios
        .delete(`/api/bookmark/unbook?mem_id=${userData.value}&csId=${parseInt(state.evDetailData[0]?.csId[0])}`)
        .then((response) => {
          if (response.data) {
            state.isBookmark = false;
          }
        });
    };

    return {
      ...toRefs(state),
      addBookMark,
      deleteBookMark,
      onAddReview,
      onEditReview,
      onDeleteReview,
      setTargetData,
      onGetNomReview,
      userData,
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/charge.scss";
</style>
