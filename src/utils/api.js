import { api } from 'boot/axios'


const apiWrap = async (config) => {
  try {
    const data = await api(config)
    return [null, data]
  } catch (err) {
    return [err, null]
  }
}
export { apiWrap }
