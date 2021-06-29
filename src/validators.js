import { defineRule } from "vee-validate";

defineRule("required", (value) => {
  return value && value.trim() ? true : "필수 입력 항목입니다.";
});
defineRule("pwdCheck", (value, [target]) => {
  return value === target ? true : "비밀번호가 일치하지 않습니다.";
});
defineRule("email", (value) => {
  return /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z0-9]+/.test(value) ? true : "올바른 이메일 형식이 아닙니다.";
});
defineRule("phone", (value) => {
  return /^([0-9]{3})([0-9]{3,4})([0-9]{4})$/.test(value) ? true : "'-'을 제외한 숫자만 입력이 가능합니다.";
});
defineRule("authKey", (value, [target]) => {
  return value === target ? true : "인증번호가 일치하지 않습니다.";
});
