<template>
  <q-fab
    icon="unfold_more"
    active-icon="unfold_less"
    class="float-text-shadow"
    label-class="bg-accent"
    style="background: rgba(154, 154, 154, 0.5)"
    text-color="white"
    color="transparent"
    flat
    padding="10px"
    direction="up"
  >
    <q-fab-action
      text-color="white"
      external-label
      class="float-text-shadow"
      flat
      label="会话"
      label-position="left"
      color="transparent"
      icon="session"
      ><template v-slot:icon>
        <chat-list><q-icon name="chat"></q-icon></chat-list>
      </template>
    </q-fab-action>
    <q-fab-action
      text-color="white"
      @click="toBottom"
      flat
      external-label
      class="float-text-shadow"
      label="最下"
      label-position="left"
      color="transparent"
      icon="arrow_downward"
    />
    <q-fab-action
      text-color="white"
      @click="toTop"
      external-label
      class="float-text-shadow"
      unelevated
      label="最上"
      label-position="left"
      color="transparent"
      icon="arrow_upward"
    />
  </q-fab>
</template>

<script>
import { useMetaStore } from "src/stores/meta";
import { defineComponent } from "vue";
import ChatList from "./chatList.vue";

export default defineComponent({
  name: "FabBtn",
  setup() {
    const meta = useMetaStore();

    function toBottom() {
      const mainRef = meta.getMainRef().value;
      mainRef.setScrollPosition(
        "vertical",
        mainRef.getScroll().verticalSize,
        300
      );
    }
    function toTop() {
      const mainRef = meta.getMainRef().value;
      mainRef.setScrollPosition("vertical", 0, 300);
    }

    return {
      toBottom,
      toTop,
    };
  },
  components: { ChatList },
});
</script>

<style lang="sass"></style>
