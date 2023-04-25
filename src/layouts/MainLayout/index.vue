<template>
  <q-layout
    view="hhh lpR Lff"
    class="mainlayout bg-main"
    :class="isAndroid ? 'mainlayout_android' : ''"
  >
    <q-page-container>
      <q-scroll-area
        class=""
        content-style="width:100%"
        :visible="false"
        ref="mainRef"
        style="width: 100%"
        :style="{ height: vh + 'px' }"
      >
        <router-view />
      </q-scroll-area>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useMetaStore } from "src/stores/meta";
import { provide, ref } from "vue";
export default {
  name: "MainLayout",
  components: {
  },
  setup() {
    let left = ref(true);
    let bg = ref(null);
    let vh = ref(window.innerHeight);
    const meta = useMetaStore();
    const mainRef = ref(null);
    meta.setMainRef(mainRef);
    provide("leftDrawer", ref(true));
    const isAndroid =
      navigator.userAgent.indexOf("Android") > -1 ||
      navigator.userAgent.indexOf("Adr") > -1;

    return { left, bg, vh, isAndroid, mainRef };
  },
};
</script>

<style lang="scss">
#sky {
  position: absolute;
}
.white-bg {
  background: linear-gradient(145deg, #4071a1 20%, #e4b04f 70%);
}
.mainlayout {
}
</style>
