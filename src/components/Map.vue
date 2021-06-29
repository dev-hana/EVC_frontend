<template>
  <!-- 메인 화면 -->
  <div class="map-area">
    <!-- 검색 -->
    <div class="search-list">
      <a-select
        class="search-ev"
        showSearch
        v-model:value="searchText"
        placeholder="충전소명 검색"
        :filterOption="false"
        showArrow
        @change="onSaveDetailInfo"
        @search="onSearchEv"
        not-found-content="검색 결과가 없습니다."
        style="width: 100%"
      >
        <template v-if="loading" #notFoundContent>
          <a-spin size="small" />
        </template>
        <a-select-option v-for="data in searchResultList" :key="data._id" :title="data.addr" @click="onMoveEv">
          {{ data.name }}
        </a-select-option>
      </a-select>

      <div class="near-list">
        <div class="near-title">가까운 충전소 목록</div>
        <div v-for="data in nearResultList" :key="data._id" class="near-item">
          <div class="near-link" @click="onInfoclick(data.lat, data.longi)">
            <div class="near-name">{{ data.name }}</div>
            <div class="near-addr">{{ data.addr }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 지도 -->
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import axios from "axios";

export default {
  name: "Map",
  setup() {
    const state = reactive({
      // 지도
      map: null,
      geocoder: null,
      chargeDataList: [],
      // 검색어
      searchText: null,
      // 검색 결과 리스트
      searchResultList: [],
      // 검색한 충전소 요약 정보
      evDetailInfo: {},
      // 근처 결과 리스트
      nearResultList: [],
    });
    onMounted(() => {
      window.kakao && window.kakao.maps ? getPosition() : addKakaoMapScript();
    });
    // 지도 호출
    const addKakaoMapScript = () => {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(getPosition());
      script.src = "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=APPKEY";
      document.head.appendChild(script);
    };
    // 위치 호출
    const getPosition = () => {
       initMap(37.498526,126.866274);
      // 현재위치 호출(http에선 ssl문제로 동작x)
      // navigator.geolocation.getCurrentPosition((pos) => {
      //   initMap(pos.coords.latitude, pos.coords.longitude);
      // });
    };

    const initMap = async (x, y) => {
      const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
      const options = {
        //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(x, y), //지도의 중심좌표.
        level: 5, //지도의 레벨(확대, 축소 정도)
      };
      // 맵 옵션 적용
      state.map = new kakao.maps.Map(container, options);
      // 이미지 선택
      const imageSrc = "/img/marker_blue.png";
      // 마커 이미지의 이미지 크기 입니다
      let imageSize = new kakao.maps.Size(50, 55);
      // 마커 이미지를 생성합니다
      let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
      // 충전소 정보 호출
      await axios.get(`/api/charge/charge`).then((response) => {
        state.chargeDataList = response.data;
        let marker = null;
        for (let i = 0; i < state.chargeDataList.length; i++) {
          // 위치값 할당
          let latlng = new kakao.maps.LatLng(state.chargeDataList[i].lat, state.chargeDataList[i].longi);
          // 마커를 생성
          marker = new kakao.maps.Marker({
            map: state.map, // 마커를 표시할 지도
            position: latlng, // 마커를 표시할 위치
            title: state.chargeDataList[i].name, // 마커의 , 마커에 마우스를 올리면 타이틀이 표시
            image: markerImage, // 마커 이미지
            clickable: true, // 클릭가능여부
          });

          const content = `<div class="wrap">
                <div class="info">
                    <div class="title">
                        ${state.chargeDataList[i].name}
                        <div id="close" class="close" title="닫기">
                    </div>
                </div>
                <div class="body">
                    <div class="desc">
                        <div class="ellipsis">${state.chargeDataList[i].name}</div>
                        <div class="jibun ellipsis">${state.chargeDataList[i].addr}</div>
                        <div><a class="link" href="/main/charge/${state.chargeDataList[i].addr}">상세보기</a></div>
                    </div>
                </div>
            </div>
            `;

          // 커스텀 오버레이 생성
          let overlay = new kakao.maps.CustomOverlay({
            content: content,
            position: marker.getPosition(),
          });

          // 마커에 클릭이벤트로 커스텀오버레이 열기
          kakao.maps.event.addListener(marker, "click", function() {
            overlay.setMap(state.map);
          });
        }
        // 주소-좌표 변환 객체를 생성
        state.geocoder = new kakao.maps.services.Geocoder();
        searchAddrFromCoords(state.map.getCenter(), displayCenterInfo);

        // 맵 생성
        marker.setMap(state.map);
      });
    };

    // 충전소 검색
    const onSearchEv = async (value) => {
      if (!value.trim()) {
        state.searchResultList = [];
        return;
      }
      state.loading = true;
      await axios
        .get(`/api/charge/search/${value}`)
        .then((response) => {
          state.searchResultList = response.data;
          state.loading = false;
        })
        .catch((err) => {
          console.log("onSearchEv", err);
        });
    };
    // 검색한 충전소 정보 저장
    const onSaveDetailInfo = async (value) => {
      const detailInfo = state.searchResultList.filter((data) => data._id === value)[0];
      state.evDetailInfo = detailInfo;
    };
    // 검색한 위치로 이동
    const onMoveEv = async () => {
      let moveLatLon = new kakao.maps.LatLng(state.evDetailInfo.lat, state.evDetailInfo.longi);
      // 지도 중심을 이동
      state.map.setCenter(moveLatLon);
      let coords = new kakao.maps.LatLng(state.evDetailInfo.lat, state.evDetailInfo.longi);
      searchAddrFromCoords(coords, displayCenterInfo);
    };
    // 좌표로 행정동 주소 정보를 요청 콜백
    const searchAddrFromCoords = async (coords, callback) => {
      state.geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
    };
    // 좌표로 행정동 주소 정보를 요청
    const displayCenterInfo = async (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        for (var i = 0; i < result.length; i++) {
          // 행정동의 region_type 값은 'H' 이므로
          if (result[i].region_type === "H") {
            let centeraddr = result[i].address_name;
            centeraddr = centeraddr.split(" ");
            const addr = centeraddr[0] + " " + centeraddr[1];
            await axios
              .get(`/api/charge/near/${addr}`)
              .then((response) => {
                state.nearResultList = response.data;
              })
              .catch((err) => {
                console.log("displayCenterInfo", err);
              });
          }
        }
      }
    };
    // 리스트 클릭시 지도이동
    const onInfoclick = async (lat, longi) => {
      let moveLatLon = new kakao.maps.LatLng(lat, longi);
      // 지도 중심을 이동 시킵니다
      state.map.setCenter(moveLatLon);
    };

    return {
      ...toRefs(state),
      onSearchEv,
      onSaveDetailInfo,
      onMoveEv,
      onInfoclick,
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/map.scss";
</style>
