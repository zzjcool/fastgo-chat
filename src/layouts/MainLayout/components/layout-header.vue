<template>
  <q-header
    bordered
    class="header-style bg-main text-black print-hide"
    height-hint="98"
  >
    <q-toolbar class="row justify-between">
      <div class="text-h6">fastgo</div>
      <q-toolbar-title class="col-auto">
        <div class="row justify-center items-center">
          <img
            fit
            @click="this.$router.push({ name: 'info' })"
            style="width: 24px; height: 24px"
            class=""
            src="~assets/openai.svg"
          />
        </div>
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script>
import { openURL, useQuasar } from "quasar";
import { inject } from "vue";
export default {
  name: "LayoutHeader",

  setup() {
    const $q = useQuasar();
    const link = {
      homePage: "https://zzj.cool",
      zhihu: "https://www.zhihu.com/people/toi-toi-toi",
      github: "https://github.com/zzjcool",
      home: "/",
    };
    let leftDrawer = inject("leftDrawer");
    if ($q.screen.gt.md) {
      leftDrawer.value = true;
    } else {
      leftDrawer.value = false;
    }

    const jump = (name, target = "_blank") => {
      console.log(target);
      openURL(link[name], null, {
        target: target,
      });
    };

    return { leftDrawer, jump, link, openURL };
  },
};
</script>

<style lang="scss" scoped>
.header-style {
  // background: #24292f;
  // background-image: linear-gradient(#000, #00000000);
  padding: 4px;
  backdrop-filter: blur(2px);
}

.mainlayout_android .header {
  // background: rgba(61, 61, 61, 0.7);
}
</style>
