export const user = {
  namespaced: true,

  // state
  state: () => ({
    userInfo: localStorage.getItem("user"),
  }),

  // mutations
  mutations: {
    // 로그인 시 사용자 정보 저장
    LOGIN(state, payload) {
      localStorage.setItem("user", payload.id);
      state.userInfo = payload.id;
    },
    // 로그아웃 시 사용자 정보 제거
    LOGOUT(state) {
      localStorage.removeItem("user");
      state.userInfo = null;
      // 지도화면으로 이동
      window.location.href = "/main/map";
    },
  },

  // getters
  getters: {
    userInfo(state) {
      return state.userInfo;
    },
  },

  // actions
  actions: {
    // 로그인
    LOGIN({ commit }, payload) {
      commit("LOGIN", payload);
    },
    // 로그아웃
    LOGOUT({ commit }) {
      commit("LOGOUT");
    },
  },
};
