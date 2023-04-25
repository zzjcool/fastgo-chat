import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { ref, watch } from 'vue';
import { copyObj, generateRandomString } from 'src/utils/tools';


const CHAT_MEGS_KEY = "chat-messages"
const CHAT_LIST_KEY = "chat-list"

const initChat = {
  id: generateRandomString(10),
  title: "闲聊",
  prompt: "你是ChatGPT，你的回答将用markdown展示。",
  msgs: [],
  contextSize: 10,
}

function genInitChat () {
  let genChat = copyObj(initChat)
  genChat.id = generateRandomString(10)
  return genChat
}

const msgs = ref([])


const chatList = ref({
  currentId: initChat.id,
  idChat: { [initChat.id]: initChat }
})

export const useChatStore = defineStore('chat', () => {


  const localChatList = LocalStorage.getItem(CHAT_LIST_KEY)
  if (localChatList != null) {
    chatList.value = localChatList
  }
  if (!chatList.value.idChat[chatList.value.currentId]) {
    chatList.value.idChat[chatList.value.currentId] = genInitChat()
  }
  msgs.value = chatList.value.idChat[chatList.value.currentId].msgs

  const localMessages = LocalStorage.getItem(CHAT_MEGS_KEY)
  if (localMessages != null) {
    msgs.value = localMessages
  }


  watch(chatList.value, (newVal) => {
    LocalStorage.set(CHAT_LIST_KEY, newVal)
  }, { immediate: true })


  function getMsgs () {
    return msgs
  }

  function saveMsgs () {
    LocalStorage.set(CHAT_MEGS_KEY, msgs.value)
    chatList.value.idChat[chatList.value.currentId].msgs = msgs.value
  }

  function cleanMsgs () {
    msgs.value = []
    saveMsgs()
  }

  function newChat () {
    let c = genInitChat()
    chatList.value.idChat[c.id] = c
    selectChat(c.id)
  }

  function deleteChat (id) {
    delete chatList.value.idChat[id]
  }

  function selectChat (id) {
    chatList.value.currentId = id
    msgs.value = chatList.value.idChat[id].msgs
    saveMsgs()
  }

  return { chatList, selectChat, newChat, deleteChat, getMsgs, saveMsgs, cleanMsgs }
})
