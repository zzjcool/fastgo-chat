<template>
  <q-page style="width: 100%" class="column">
    <div class="col column items-lg-center full-width">
      <blank-page v-if="messages.length < 1"></blank-page>

      <div
        v-else
        class="column items-center justify-center"
        style="padding-bottom: 80px; width: 100%"
      >
        <div class="col main-width">
          <div style="height: 20px"></div>
          <q-chat-message
            v-for="(msg, idx) in messages"
            :key="idx"
            :sent="msg.role == 'user'"
            :hidden="msg.role == 'system'"
          >
            <template v-slot:avatar>
              <img
                v-if="msg.role == 'user'"
                class="q-message-avatar q-message-avatar--sent"
                style="width: 36px"
                src="~assets/user.png"
                name="fa-regular fa-user"
              />
              <img
                v-else
                fit
                style="width: 36px; height: 36px"
                class="q-message-avatar q-message-avatar--received"
                src="~assets/openai.svg"
              />
            </template>
            <q-spinner-dots v-if="msg.content == ''" size="40px" />
            <MarkdownViewer
              v-else-if="msg.role == 'assistant'"
              :content="msg.content"
            ></MarkdownViewer>
            <pre
              class=""
              style="
                padding: 8px 0;
                margin: 0;
                word-wrap: break-word;
                white-space: pre-wrap;
              "
              v-else
              >{{ msg.content }}</pre
            >
          </q-chat-message>
        </div>
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 88]">
        <fab-btn></fab-btn>
      </q-page-sticky>
      <q-page-sticky
        position="bottom"
        expand
        class="column items-center justify-center content-center"
        style="transform: translate(0px, -20px); left: 0"
      >
        <q-btn
          unelevated
          square
          dense
          v-if="msg.length > 0"
          style="width: 60px"
          icon="expand_less"
          color="secondary"
        >
          <q-popup-edit
            class=""
            style="width: 100vw; overflow-x: scroll; z-index: 99999"
            v-model="msg"
            auto-save
            v-slot="scope"
          >
            <div
              class="fixed-bottom bg-white q-pa-lg"
              style="width: 100vw; max-width: unset"
            >
              <q-input
                input-class="bg-white full-width"
                input-style="min-height: 30vh"
                v-model="scope.value"
                dense
                type="textarea"
                autofocus
                counter
              />
            </div> </q-popup-edit
        ></q-btn>
        <q-form
          style="height: 50px;"
          class="col bg-white row items-center shadow-2 shadow-transition rounded-borders main-width"
        >
          <div class="self-end" style="height: 50px">
            <menu-btn></menu-btn>
          </div>
          <div class="col q-pl-sm">
            <q-input
              v-model="msg"
              autogrow
              input-class="hide-scrollbar"
              dense
              class="hide-scrollbar no-scroll overflow-hidden-y"
              borderless
              :placeholder="tips"
              @keypress.enter="sendMessageHandler"
              @keyup.enter="sendMessageHandler"
              input-style="font-size:120%;"
            ></q-input>
          </div>
          <div class="self-end" style="height: 50px">
            <q-btn
              dense
              flat
              :disable="isSending"
              :loading="isSending"
              class="full-height q-pr-md"
              icon="send"
              @click="sendMessageHandler"
            />
          </div>
        </q-form>
      </q-page-sticky>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { sendMessageWrap } from "src/api/chat";
import { useChatStore } from "src/stores/chat";
import { useMetaStore } from "src/stores/meta";
import { useSettingsStore } from "src/stores/settings";
import { defineAsyncComponent, defineComponent, nextTick, ref,onMounted } from "vue";
import BlankPage from "./blankPage.vue";
import FabBtn from "./fab.vue";
import MenuBtn from "./menu.vue";

export default defineComponent({
  name: "ChatGPT",
  setup() {
    // 初始化定义
    const $q = useQuasar();
    const meta = useMetaStore();
    let isSending = ref(false);
    let freshKey = ref(new Date());
    let msg = ref("");
    let oldMsg = msg.value;
    let tips = ref("开始一段对话吧");
    const chat = useChatStore();
    const settings = useSettingsStore();
    let messages = chat.getMsgs();

    function onError(err) {
      msg.value = oldMsg;
      let popMsg = messages.value.pop();
      if (popMsg.role == "assistant") {
        messages.value.pop();
      }
      if (err) {
        $q.notify({
          type: "negative",
          message: "出错了！错误信息：" + err,
        });
      }
    }

    function scrollToEnd() {
      nextTick(() => {
        const mainRef = meta.getMainRef().value;
        mainRef.setScrollPosition(
          "vertical",
          mainRef.getScroll().verticalSize,
          800
        );
      });
    }
    let sendMessageHandler = async (event) => {
      if (event.type == "keyup") {
        if (!event.shiftKey && msg.value == "\n") {
          msg.value = "";
        }
        return;
      }
      if (event.shiftKey) {
        return;
      }
      if (isSending.value || msg.value == "") {
        return;
      }

      isSending.value = true;

      let sendMessages = [
        {
          role: "system",
          content: chat.chatList.idChat[chat.chatList.currentId].prompt,
        },
      ];

      const n = chat.chatList.idChat[chat.chatList.currentId].contextSize;
      if (messages.value.length > 0 && n > 0) {
        if (n > 30 || n > messages.value.length) {
          sendMessages.push(...messages.value.slice());
        } else {
          sendMessages.push(...messages.value.slice(-n));
        }
      }

      const send = { role: "user", content: msg.value };
      const rec = { role: "assistant", content: "" };
      sendMessages.push(send);
      messages.value.push(send);
      messages.value.push(rec);

      oldMsg = msg.value;
      msg.value = "";
      sendMessageWrap(
        sendMessages,
        (rec) => {
          messages.value[messages.value.length - 1].content =
            messages.value[messages.value.length - 1].content.concat(rec);
        },
        (event, data) => {
          switch (event) {
            case "DONE":
              scrollToEnd();
              if (messages.value[messages.value.length - 1].content == '') {
                onError()
                break
              }
              chat.saveMsgs();
              break;
            default:
              $q.notify({
                type: "negative",
                message: "出错了：" + event + data,
              });
              onError();
              break;
          }
        }
      )
        .catch(onError)
        .finally(() => {
          isSending.value = false;
        });
      scrollToEnd();
    };

    let vh = ref(window.innerHeight);


    return {
      messages,
      msg,
      contextSize: ref(5),
      sendMessageHandler,
      isSending,
      vh,
      tips,
      freshKey,
      settings,
    };
  },

  components: {
    MarkdownViewer: defineAsyncComponent(() =>
      import("components/markdown/index.vue")
    ),
    MenuBtn,
    BlankPage,
    FabBtn,
  },
});
</script>

<style lang="sass">
.base64-text-input
  height: 80vh
  overflow: hidden
  .q-textarea .q-field__control
    min-height: 56px
    height: 100%
.q-message-text--received
  color: #bfc4ca

.q-message-container.row.items-end.no-wrap > div
  max-width: calc(100% - 56px)

.q-scrollarea__content.absolute
  width: 100%

textarea
  max-height: 250px
  overflow: auto
</style>
