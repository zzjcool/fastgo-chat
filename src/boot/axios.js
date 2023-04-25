import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Notify } from 'quasar'



// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.API_ADDRESS, timeout: 600000 })



export default boot(({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
  api.interceptors.request.use(
    config => {
      return config
    }
  )

  api.interceptors.response.use(
    response => {
      const res = response.data
      if (response.status !== 200) {

        console.log(response)
        return Promise.reject(new Error(res.data.message || '系统错误！'))
      }

      return res
    },
    error => {
      if (!error.response) {
        console.log(error)
        Notify.create({
          type: 'negative',
          message: "服务器繁忙！"
        })
        return Promise.reject(null)
      }

      console.log(error.response)
      return Promise.reject(error)
    }
  )

})

export { api }
