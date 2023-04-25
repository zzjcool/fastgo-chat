import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { copyObj } from 'src/utils/tools';
import { ref, watch } from 'vue';

const API_TYPE = {
  OPENAI: "openai",
  AZURE: "azure",
};

const apiTypeOption = [
  "openai",
  "azure",
];


const initChat = {
  systemPrompt: '你是ChatGPT，你的回答将用markdown展示。',
  contextSize: 10,
}
const initApi = {
  api: 'https://api.openai.com',
  key: '',
  customApi: true,
  model: "gpt-3.5-turbo",
  apiType: API_TYPE.OPENAI,
  azureVersion: "2023-03-15-preview",
  azureEngine: ""
}
const chat = ref(copyObj(initChat))
const api = ref(copyObj(initApi))

const CHAT_SETTINGS = "chat-settings"
const API_SETTINGS = "api-settings"


function mergeObjects (obj1, obj2) {
  return { ...obj1, ...obj2 };
}

function initSetting (setting, localKey, initVal) {
  const localVal = LocalStorage.getItem(localKey)
  setting.value = mergeObjects(setting.value, localVal)
  watch(setting.value, (newVal) => {
    LocalStorage.set(localKey, newVal)
  }, { immediate: true })

  // return resetFunc
  return function () {
    setting.value = copyObj(initVal);
    LocalStorage.set(localKey, setting.value)
  }
}

export const useSettingsStore = defineStore('settings', () => {

  const resetChat = initSetting(chat, CHAT_SETTINGS, initChat)
  const resetApi = initSetting(api, API_SETTINGS, initApi)

  return { chat, api, resetChat, resetApi, API_TYPE, apiTypeOption }
})
