<template>
  <div class="login-page">
    <div class="title">로그인</div>
    <Form @submit="onLogin">
      <div class="contents-item">
        <div class="contents-text">아이디</div>
        <Field name="id" type="text" rules="required" class="form-input" />
        <ErrorMessage name="id" class="error-message" />
      </div>
      <div class="contents-item">
        <div class="contents-text">비밀번호</div>
        <Field name="pwd" type="password" rules="required" class="form-input" />
        <ErrorMessage name="pwd" class="error-message" />
        <div v-if="errorMsg" class="error-message">{{ errorMsg }}</div>
      </div>
      <button type="submit" class="basic-btn ok-btn">로그인</button>
    </Form>

    <!-- 하단 메뉴 -->
    <div class="sub-contents">
      <router-link to="/findId" class="sub-text">아이디 찾기</router-link>
      <router-link to="/findPwd" class="sub-text">비밀번호 찾기</router-link>
      <router-link to="/register" class="sub-text">회원가입</router-link>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import axios from "axios";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { reactive, toRefs } from "@vue/reactivity";

export default {
  name: "Login",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    // 라우터 사용
    const router = useRouter();
    // 스토어 사용
    const store = useStore();

    const state = reactive({
      errorMsg: "",
    });

    // 로그인 처리
    const onLogin = (values) => {
      const params = {
        id: values.id,
        password: values.pwd,
      };
      // API 호출
      axios.post(`/api/users/signin`, params).then((response) => {
        if (response.data !== false) {
          // 액션 호출
          store.dispatch("user/LOGIN", params);
          // 메인 화면으로 이동
          router.push("/main/map");
        } else {
          state.errorMsg = "아이디/비밀번호가 일치하지 않습니다.";
        }
      });
    };

    return {
      ...toRefs(state),
      onLogin,
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/login.scss";
</style>
