<template>
  <div class="find-password-page">
    <div class="title">{{ userId ? "비밀번호 재설정" : "비밀번호 찾기" }}</div>

    <!-- 비밀번호 재설정 화면 -->
    <div v-if="userId" class="find-complete pwd">
      <Form @submit="onSetPwd">
        <div class="contents-item">
          <div class="contents-text">비밀번호</div>
          <Field name="pwd" type="password" rules="required" class="form-input" />
          <ErrorMessage name="pwd" class="error-message" />
        </div>
        <div class="contents-item">
          <div class="contents-text">비밀번호 재확인</div>
          <Field name="pwdCheck" type="password" rules="required|pwdCheck:@pwd" class="form-input" />
          <ErrorMessage name="pwdCheck" class="error-message" />
        </div>
        <button type="submit" class="basic-btn ok-btn">비밀번호 변경</button>
      </Form>
    </div>

    <!-- 이메일 인증 화면 -->
    <div v-else>
      <Form @submit="onFindId" v-slot="{ values, errors }">
        <div class="contents-item">
          <div class="contents-text">본인확인 이메일</div>
          <div class="contents-row">
            <Field name="email" type="text" rules="required|email" class="form-input" />
            <button
              :class="`basic-btn auth-email-btn ${errors.email ? 'disabled' : ''}`"
              @click="emailAuth(values.email)"
            >
              인증번호 받기
            </button>
          </div>
          <ErrorMessage name="email" class="error-message" />
          <div v-if="sendMsg" class="success-message">{{ sendMsg }}</div>

          <div v-if="sendMsg" class="input-key">
            <Field name="authKey" type="text" rules="required" class="form-input" placeholder="인증번호 입력" />
            <div v-if="authResult.msg" class="error-message">
              {{ authResult.msg }}
            </div>
          </div>
        </div>

        <button type="submit" class="basic-btn ok-btn">확 인</button>
      </Form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import axios from "axios";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useRouter } from "vue-router";

export default {
  name: "FindId",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const state = reactive({
      sendMsg: "", // 인증번호 전송 메시지
      authResult: {}, // 인증 결과 정보
      userId: "", // 사용자 아이디
    });

    // 라우터 사용
    const router = useRouter();

    // 인증메일 전송
    const emailAuth = (email) => {
      if (!email) return;
      // 이메일 저장 여부 확인
      axios.get(`/api/users/exist/email`, { params: { email: email } }).then((response) => {
        if (!response.data) {
          //false: 있음
          axios.post(`/api/users/send/email`, { sndEmail: email }).then((response_) => {
            if (response_.data) {
              state.sendMsg = "인증번호가 전송되었습니다.";
              state.authResult = { key: response_.data };
            }
          });
        } else {
          //true: 없음
          alert("회원정보가 존재하지 않습니다.");
        }
      });
    };

    // 비밀번호 재설정 값을 위한 아이디 찾기
    const onFindId = (values) => {
      if (values.authKey && values.authKey === state.authResult.key.toString()) {
        axios.get(`/api/users/find/id`, { params: { email: values.email } }).then((response) => {
          if (response.data) {
            state.authResult = {};
            state.userId = response.data;
          }
        });
      } else if (values.authKey) {
        state.authResult = { ...state.authResult, msg: "인증번호가 일치하지 않습니다." };
      }
    };

    // 비밀번호 재설정
    const onSetPwd = (values) => {
      const params = {
        id: state.userId,
        password: values.pwd,
      };
      axios.post(`/api/users/repassword`, params).then((response) => {
        if (response.data) {
          alert("비밀번호가 변경되었습니다.");
          router.push("/login");
        }
      });
    };

    // 로그인 화면으로 이동
    const changePage = () => {
      router.push("/login");
    };

    return {
      ...toRefs(state),
      emailAuth,
      onFindId,
      onSetPwd,
      changePage,
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/find.scss";
</style>
