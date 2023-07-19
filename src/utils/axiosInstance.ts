import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
// import {
//   showFullScreenLoading,
//   tryHideFullScreenLoading,
// } from "@src/components/Loading";
import { STATUS_CODE } from "../types";

export async function axiosWarpInstance(
  url: string,
  data?: any,
  options?: any
) {
  const {
    type = "get",
    customize = false,
    showLoading = false,
    spinProps,
    ...props
  } = options;
  const methodTemp = type.toLowerCase();
  let getData = data;
  if (customize) {
    const res = await axiosInstance({
      method: methodTemp,
      url,
      showLoading,
      spinProps,
      data,
      ...props,
    });
    return res;
  }
  if (
    !!(window as any).MSInputMethodContext &&
    !!(document as any).documentMode &&
    methodTemp === "get"
  ) {
    getData = { ...data, t: new Date().valueOf() };
  } // 解决ie get请求缓存
  if (
    methodTemp === "get" ||
    methodTemp === "delete" ||
    methodTemp === "head"
  ) {
    const res = await (axiosInstance as any)[methodTemp](url, {
      params: getData,
      showLoading,
      spinProps,
      ...props,
    });
    return res;
  }
  if (methodTemp === "post" || methodTemp === "patch" || methodTemp === "put") {
    const res = await (axiosInstance as any)[methodTemp](url, data, {
      showLoading,
      spinProps,
      ...props,
    });
    return res;
  }
}

const handleError = (
  response = { config: { showError: {} as any, showLoading: {} as any } } as any
) => {
  const {
    config: { showError = {}, showLoading },
    data,
  } = response;
  const { isShow, showPopup, title, onOk } = showError;
  if (isShow) {
    if (showPopup) {
      ElMessageBox.alert(data.message, title, {
        callback: () => {
          if (typeof onOk === "function") {
            onOk();
          }
        },
      });
    } else {
      if (
        data?.code === STATUS_CODE.UNAUTHENTICATED ||
        response?.status === STATUS_CODE.UNAUTHENTICATED
      ) {
        // redirectPage("/lite/login");
        return;
      }
      ElMessage.error(
        data.msg || data.message || data.Message || response.statusText
      );
    }
  }
  if (showLoading !== false) {
    // tryHideFullScreenLoading();
  }
  return Promise.reject(data);
};

const axiosInstance = axios.create({
  // 当创建实例的时候配置默认配置
  // baseURL: '',
  timeout: 1000 * 60 * 3,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  xsrfCookieName: "Ag-Csrf-Token",
  xsrfHeaderName: "Ag-Csrf-Token",
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const defaultShowError = {
      isShow: true,
      showPopup: false,
      title: "",
    };
    const instanceShowError = (config as any).showError;
    (config as any).showError = Object.assign(
      defaultShowError,
      instanceShowError
    );
    if ((config as any).showLoading !== false) {
      // showFullScreenLoading(config.spinProps);
    }
    return config;
  },
  (err) => {
    if (err.request.config.showLoading !== false) {
      // tryHideFullScreenLoading();
    }
    handleError(err.request);
  }
);

// 添加一个响应拦截器
axiosInstance.interceptors.response.use(
  (response): any => {
    const { data, config } = response;
    // skip handler
    if ((config as any).showLoading !== false) {
      // tryHideFullScreenLoading();
    }
    if ((config as any).skipGlobalHandler && !data.code) {
      return Promise.resolve(data);
    }
    // 1.成功
    if (data.code === STATUS_CODE.SUCCESS) {
      return Promise.resolve(data.data);
    }
    // 2.session过期
    if (
      data.code === STATUS_CODE.UNAUTHENTICATED ||
      response?.status === STATUS_CODE.UNAUTHENTICATED ||
      data.code === STATUS_CODE.UNAUTHENTICATED30000
    ) {
      // 重新登录
      // logout(data.data);
      return Promise.reject(data);
    }

    // // 3. 无相关权限
    // if (data.code === STATUS_CODE.PERMISSION_DENIED || data.code === STATUS_CODE.NOT_FOUND) {
    //   window.eventTarget.dispatchEvent(REDIRECT_TO_404);
    //   return Promise.reject(data);
    // }

    // 4.其他失败，比如校验不通过等
    return handleError(response);
  },
  // 5.系统错误，比如500、404等
  (error) => handleError(error.response)
);
export default axiosInstance;
