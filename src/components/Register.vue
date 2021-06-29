<template>
  <div class="register-page">
    <!-- 회원가입 완료 화면 -->
    <div v-if="registerComplete" class="register-complete">
      <div class="complete-msg">
        회원가입이 완료되었습니다.
      </div>
      <button @click="changePage" class="basic-btn to-login">로그인하러 가기</button>
    </div>
    <!-- 회원가입 내용 작성 화면 -->
    <div v-else>
      <div class="title">회원가입</div>
      <Form @submit="onRegister" v-slot="{ values, errors }">
        <div class="contents-item">
          <div class="contents-text">아이디</div>
          <div class="contents-row">
            <Field name="id" type="text" rules="required" class="form-input" />
            <button class="basic-btn auth-btn" @click="checkId(values.id)">중복확인</button>
          </div>
          <ErrorMessage name="id" class="error-message" />
          <div v-if="idMsg.success" class="success-message">{{ idMsg.success }}</div>
          <div v-else-if="idMsg.fail" class="error-message">{{ idMsg.fail }}</div>
        </div>
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
        <div class="contents-item">
          <div class="contents-text">이름</div>
          <Field name="name" type="text" rules="required" class="form-input" />
          <ErrorMessage name="name" class="error-message" />
        </div>
        <div class="contents-item">
          <div class="contents-text">이메일</div>
          <div class="contents-row">
            <Field name="email" type="text" rules="required|email" class="form-input" />
            <button class="basic-btn auth-btn" @click="checkEmail(values.email)">
              중복확인
            </button>
          </div>
          <ErrorMessage name="email" class="error-message" />
          <div v-if="!errors.email && emailMsg.success" class="success-message">{{ emailMsg.success }}</div>
          <div v-else-if="!errors.email && emailMsg.fail" class="error-message">{{ emailMsg.fail }}</div>

          <!-- 인증번호 -->
          <div v-if="!errors.email && emailMsg?.success" class="contents-row email-auth">
            <Field name="authKey" type="text" rules="required" class="form-input" placeholder="인증번호 입력" />
            <button
              :class="`basic-btn auth-email-btn ${errors.authKey ? 'disabled' : ''}`"
              @click="emailAuth(values.email)"
            >
              인증번호 받기
            </button>
          </div>
          <div v-if="authResult.msg" class="error-message">
            {{ authResult.msg }}
          </div>
        </div>
        <div class="contents-item">
          <div class="contents-text">휴대전화</div>
          <Field name="phone" type="text" rules="required|phone" class="form-input" />
          <ErrorMessage name="phone" class="error-message" />
        </div>

        <button type="submit" class="basic-btn ok-btn">가입하기</button>
      </Form>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import axios from "axios";
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Register",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const state = reactive({
      idMsg: { success: "", fail: "" }, // id 중복확인 결과
      emailMsg: { success: "", fail: "" }, // email 중복확인 결과
      registerComplete: false, // 회원가입 완료 여부
      authResult: "", // 인증 결과
    });

    // 라우터 사용
    const router = useRouter();

    // 아이디 중복확인
    const checkId = (value) => {
      if (!value) return;

      axios.get(`/api/users/exist/id`, { params: { id: value } }).then((response) => {
        if (response.data) {
          state.idMsg = { success: "사용 가능한 아이디입니다.", fail: "" };
        } else {
          state.idMsg = { success: "", fail: "이미 사용중인 아이디입니다." };
        }
      });
    };

    // 이메일 중복확인
    const checkEmail = (value) => {
      if (!value) return;

      axios.get(`/api/users/exist/email`, { params: { email: value } }).then((response) => {
        if (response.data) {
          state.emailMsg = { success: "사용 가능한 이메일입니다.", fail: "" };
        } else {
          state.emailMsg = { success: "", fail: "이미 사용중인 이메일입니다." };
        }
      });
    };

    // 회원가입 이벤트
    const onRegister = (values) => {
      checkId();
      checkEmail();

      // 아이디&이메일 중복체크 했을 시에만 api 호출
      if (state.idMsg.success && state.emailMsg.success) {
        // 인증번호 일치 여부 확인
        if (values.authKey && values.authKey === state.authResult.key.toString()) {
          const params = {
            id: values.id,
            password: values.pwd,
            name: values.name,
            phone: values.phone,
            email: values.email,
          };
          axios.post(`/api/users/new`, params).then((response) => {
            if (response.data) {
              state.registerComplete = true;
            }
          });
        } else {
          // 인증번호 미일치
          state.authResult = { ...state.authResult, msg: "인증번호가 일치하지 않습니다." };
        }
      } else if (!state.idMsg.success) {
        state.idMsg = { success: "", fail: "아이디 중복확인을 해주세요." };
      } else if (!state.emailMsg.success) {
        state.emailMsg = { success: "", fail: "이메일 중복확인을 해주세요." };
      }
    };

    // 로그인 화면으로 이동
    const changePage = () => {
      router.push("/login");
    };

    // 인증메일 전송
    const emailAuth = (email) => {
      if (!email) return;

      axios.post(`/api/users/send/email`, { sndEmail: email }).then((response) => {
        if (response.data) {
          state.sendMsg = "인증번호가 전송되었습니다.";
          state.authResult = { key: response.data };
        }
      });
    };

    return {
      ...toRefs(state),
      checkId,
      checkEmail,
      onRegister,
      changePage,
      emailAuth,
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/register.scss";
</style>
