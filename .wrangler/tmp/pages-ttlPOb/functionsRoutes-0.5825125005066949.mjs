import { onRequestGet as __api_updates_js_onRequestGet } from "D:\\Coder\\JUNE_2026\\portfolio\\functions\\api\\updates.js"

export const routes = [
    {
      routePath: "/api/updates",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_updates_js_onRequestGet],
    },
  ]