<template>
  <div class="" @click="isOpen = !isOpen" name="chat">
    <slot></slot>
    <q-dialog v-model="isOpen" @show="onShow" class="no-shadow">
      <div class="full-width column" style="height: 60%">
        <div class="q-pa-md bg-primary text-white text-subtitle1 text-bold">
          对话记录
        </div>
        <q-scroll-area class="full-width bg-white col" ref="scrollRef">
          <q-card flat>
            <q-list>
              <template v-for="(val, id) in chat.chatList.idChat" :key="id">
                <q-item>
                  <q-item-section avatar>
                    <q-icon
                      :color="
                        chat.chatList.currentId == id ? 'green-5' : 'grey-5'
                      "
                      name="forum"
                    />
                  </q-item-section>
                  <q-item-section
                    v-close-popup
                    @click="chat.selectChat(id)"
                    class="ellipsis cursor-pointer"
                  >
                    <q-item-label>{{ val.title }}</q-item-label>
                    <q-item-label caption>
                      {{
                        (val.msgs[val.msgs.length - 2] &&
                          val.msgs[val.msgs.length - 2].content) ||
                        val.prompt
                      }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon
                      v-if="chat.chatList.currentId == id"
                      @click="chat.deleteChat(id)"
                      color="green-4"
                      name="check_circle"
                    />
                    <q-icon
                      v-else
                      @click="chat.deleteChat(id)"
                      color="red-4"
                      name="delete"
                    />
                  </q-item-section>
                </q-item>
                <q-separator></q-separator>
              </template>
              <q-item>
                <q-btn
                  flat
                  @click="
                    () => {
                      chat.newChat();
                      onShow();
                    }
                  "
                  class="full-width bg-green"
                  icon="add"
                  color="white"
                ></q-btn>
              </q-item>
            </q-list>
          </q-card>
        </q-scroll-area>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { useChatStore } from "src/stores/chat";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ChatList",
  setup() {
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
      onShow,
      isOpen: ref(false),
      chat,
      scrollRef,
    };
  },
  components: {},
});
</script>

<style lang="sass"></style>
