<template>
  <q-btn
    class="full-height"
    @click="isOpen = !isOpen"
    color="primary"
    flat
    icon="menu"
  >
    <q-dialog v-model="isOpen" @show="onShow" class="no-shadow">
      <div class="full-width column" style="height: 60%">
        <div class="q-pa-md bg-primary text-white text-subtitle1 text-bold">
          设置
        </div>
        <q-scroll-area class="full-width bg-white col" ref="scrollRef">
          <q-card flat>
            <q-list style="min-width: 100px">
              <q-item class="row items-center">
                <q-item-section avatar>
                  <q-icon color="blue-8" name="fa-solid fa-robot" />
                </q-item-section>
                <div class="setting-name">API类型</div>
                <q-item-section side>
                  <q-select
                    class="q-pl-md"
                    dense
                    style="width: 100px"
                    v-model="settings.api.apiType"
                    :options="settings.apiTypeOption"
                  />
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                  >
                    选择API类型，默认openai
                  </q-tooltip>
                </q-item-section>
              </q-item>

              <q-item
                v-if="settings.api.customApi"
                class="row justify-center items-center"
              >
                <q-item-section avatar>
                  <q-icon color="green-5" name="api" />
                </q-item-section>
                <div class="setting-name">API接入点</div>
                <div class="col q-pl-md">
                  <q-input v-model="settings.api.api" dense></q-input>
                </div>
              </q-item>

              <q-item
                v-if="settings.api.customApi"
                class="row justify-center items-center"
              >
                <q-item-section avatar>
                  <q-icon color="blue-5" name="key" />
                </q-item-section>
                <div class="setting-name">Key</div>
                <div class="col q-pl-md">
                  <q-input v-model="settings.api.key" dense></q-input>
                </div>
              </q-item>
              <q-item
                v-if="
                  settings.api.customApi &&
                  settings.api.apiType == settings.API_TYPE.OPENAI
                "
                class="row justify-center items-center"
              >
                <q-item-section avatar>
                  <q-icon color="lime-7" name="send_time_extension" />
                </q-item-section>
                <div class="setting-name">模型</div>
                <div class="col q-pl-md">
                  <q-input v-model="settings.api.model" dense></q-input>
                </div>
              </q-item>
              <q-item
                v-if="
                  settings.api.customApi &&
                  settings.api.apiType == settings.API_TYPE.AZURE
                "
                class="row justify-center items-center"
              >
                <q-item-section avatar>
                  <q-icon color="lime-7" name="send_time_extension" />
                </q-item-section>
                <div class="setting-name">部署名称</div>
                <div class="col q-pl-md">
                  <q-input v-model="settings.api.azureEngine" dense></q-input>
                </div>
              </q-item>
              <q-item
                v-if="
                  settings.api.customApi &&
                  settings.api.apiType == settings.API_TYPE.AZURE
                "
                class="row justify-center items-center"
              >
                <q-item-section avatar>
                  <q-icon color="blue-5" name="fa-brands fa-microsoft" />
                </q-item-section>
                <div class="setting-name">Api版本</div>
                <div class="col q-pl-md">
                  <q-input v-model="settings.api.azureVersion" dense></q-input>
                </div>
              </q-item>

              <q-item @click="settings.resetApi" clickable>
                <q-item-section avatar>
                  <q-icon
                    color="negative"
                    name="restart_alt"
                  /> </q-item-section
                ><q-item-section>重置API配置</q-item-section>
              </q-item>
              <q-separator></q-separator>

              <q-item class="row items-center">
                <q-item-section avatar>
                  <q-icon color="blue-6" name="title" />
                </q-item-section>
                <div class="setting-name">对话标题</div>
                <div class="col q-pl-md">
                  <q-input
                    v-model="
                      chat.chatList.idChat[chat.chatList.currentId].title
                    "
                    dense
                  ></q-input>
                </div>
              </q-item>
              <q-separator></q-separator>
              <q-item class="row items-center">
                <q-item-section avatar>
                  <q-icon color="indigo-6" name="tag" />
                </q-item-section>
                <div class="setting-name">提示语</div>
                <div class="col q-pl-md">
                  <q-input
                    v-model="
                      chat.chatList.idChat[chat.chatList.currentId].prompt
                    "
                    dense
                  ></q-input>
                </div>
              </q-item>
              <q-separator></q-separator>
              <q-item class="row items-center">
                <q-item-section avatar>
                  <q-icon color="primary" name="info" />
                </q-item-section>
                <div>
                  <div class="text-bold">计费提示：</div>
                  每次对话的上下文都会统计字数，即上下文越多，消耗越多，为避免浪费，请合理设置上下文数量。
                </div>
              </q-item>
              <q-separator></q-separator>
              <q-item class="row items-center">
                <q-item-section avatar>
                  <q-icon color="lime-7" name="manage_history" />
                </q-item-section>
                <div class="setting-name">上下文数量</div>
                <div class="col row">
                  <q-slider
                    class="col q-pl-md"
                    v-model="
                      chat.chatList.idChat[chat.chatList.currentId].contextSize
                    "
                    color="green"
                    :min="0"
                    :step="1"
                    :max="31"
                  />
                  <div class="q-pl-md" style="width: 50px">
                    {{
                      chat.chatList.idChat[chat.chatList.currentId]
                        .contextSize >= 31
                        ? "不限"
                        : chat.chatList.idChat[chat.chatList.currentId]
                            .contextSize
                    }}
                  </div>
                </div>

                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  每次请求携带的上下文数量，为0表示不携带上下文。
                </q-tooltip>
              </q-item>
              <q-separator></q-separator>
              <chat-list
                ><q-item clickable>
                  <q-item-section avatar>
                    <q-icon color="green-4" name="forum" /> </q-item-section
                  ><q-item-section>会话列表</q-item-section>
                </q-item></chat-list
              >
              <q-item @click="cleanMsgs" clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon
                    color="negative"
                    name="cleaning_services"
                  /> </q-item-section
                ><q-item-section>清空对话记录</q-item-section>
              </q-item>

              <q-item href="https://github.com/zzjcool/fastgo-chat" target="fastgo-chat" clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon
                    color="blue"
                    name="link"
                  /> </q-item-section
                ><q-item-section>Github项目：zzjcool/fastgo-chat</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-scroll-area>
      </div>
    </q-dialog>
  </q-btn>
</template>

<script>
import { useChatStore } from "src/stores/chat";
import { useSettingsStore } from "src/stores/settings";
import { defineComponent, ref } from "vue";
import ChatList from "./chatList.vue";

export default defineComponent({
  name: "MenuBtn",
  setup() {
    const settings = useSettingsStore();
    const chat = useChatStore();
    const scrollRef = ref(null);

    function onShow() {
      scrollRef.value.setScrollPosition(
        "vertical",
        scrollRef.value.getScroll().verticalSize,
        300
      );
    }

    return {
      settings,
      onShow,
      isOpen: ref(false),
      cleanMsgs: chat.cleanMsgs,
      chat,
      scrollRef,
    };
  },
  components: { ChatList },
});
</script>

<style lang="sass">
.setting-name
  width: 80px
</style>
