import { createWebHistory, createRouter } from "vue-router";
import Login from "@/components/Login.vue";
import Main from "@/components/Main.vue";
import Map from "@/components/Map.vue";
import Charge from "@/components/Charge.vue";
import Bookmark from "@/components/Bookmark.vue";
import Register from "@/components/Register.vue";
import FindId from "@/components/FindId.vue";
import FindPwd from "@/components/FindPwd.vue";
import store from "@/store";
import Dashboard from "@/components/Dashboard.vue";

// 로그인 여부 검증
const requireAuth = () => (to, from, next) => {
  if (store.getters["user/userInfo"]) {
    return next();
  }
  next("/login");
};

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/main/map",
  },
  {
    path: "/main",
    component: Main,
    children: [
      {
        path: "map",
        component: Map,
      },
      {
        path: "charge/:addr",
        component: Charge,
      },
    ],
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/findId",
    name: "FindId",
    component: FindId,
  },
  {
    path: "/findPwd",
    name: "FindPwd",
    component: FindPwd,
  },
  {
    path: "/bookmark",
    name: "Bookmark",
    component: Bookmark,
    beforeEnter: requireAuth(),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: requireAuth(),
  },
  {
    path: "/:catchAll(.*)",
    component: Login,
  },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
