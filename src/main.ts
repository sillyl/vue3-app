import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@/views/three-demo3-requestAnimationFrame.js";

const app = createApp(App);
app.use(ElementPlus);
app.use(store);
app.use(router).mount("#app");
