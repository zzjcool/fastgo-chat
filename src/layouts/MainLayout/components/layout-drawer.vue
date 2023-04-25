<template>
  <q-drawer
    class="print-hide bg-main draw-bg overflow-hidden"
    content-class="draw-bg overflow-hidden"
    :breakpoint="0"
    bordered
    v-model="leftDrawer"
    :overlay="!screenGtMd"
    side="left"
  >
    <q-scroll-area class="fit">
      <div class="column">
        <div class="q-gutter-y-md">
          <div>
            <q-list class="">
              <q-item
                v-for="v in data.sideList"
                v-bind:key="v.route + data.updateTime"
                :to="{ name: v.route }"
                exact
                active-class="text-deep-orange-5"
              >
                <q-item-section avatar>
                  <q-icon :name="v.icon" />
                </q-item-section>

                <q-item-section>
                  {{ v.name }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="row items-center q-px-md">
            <div class="text-subtitle1 text-weight-bold">基于:</div>
            <div>
              <q-chip color="black" text-color="white">Vue</q-chip>
              <q-chip color="black" text-color="white">Quasar</q-chip>
              <q-chip color="black" text-color="white">OpenAI</q-chip>
            </div>
          </div>
          <q-separator></q-separator>

          <div class="q-px-md"></div>
          <div class="row items-center q-px-md">
            <q-badge class="text-subtitle2 text-weight-bold">邮箱</q-badge>
            <q-space></q-space>
            <div class="text-subtitle1 text-weight-bold">
              <i>email@zzj.cool</i>
            </div>
          </div>
          <div class="q-px-md" v-if="!auth.isLogin()">
            <q-btn
              :to="{ name: 'login' }"
              flat
              class="full-width bg-secondary text-white"
              >登录</q-btn
            >
          </div>
          <div
            class="text-grey q-px-md"
            style="
              font-family: Montserrat, Roboto, -apple-system, Avenir,
                BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;
              font-weight: 500;
            "
          >
            Copyright &copy; 2023-present fastgo.run
          </div>
        </div>
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { openURL, useMeta, useQuasar } from "quasar";
import { inject, ref } from "vue";
import { route } from "quasar/wrappers";
import { useMetaStore } from "src/stores/meta";
import { useAuthStore } from "src/stores/auth";

export default {
  name: "LayoutDrawer",
  setup() {
    let leftDrawer = inject("leftDrawer");

    let auth = useAuthStore();
    let meta = useMetaStore();
    meta.refresh();
    return {
      data: meta.data,
      leftDrawer,
      auth,
      screenGtMd: useQuasar().screen.gt.md,
      openURL,
    };
  },
  methods: {
    print() {
      window.print();
    },
  },
};
</script>
<style lang="scss">
.mainlayout .q-drawer {
  // background: linear-gradient(145deg, #3370ad 25%, #e4b04f 80%);
  // background: none;
  // background: rgb(235, 235, 235);
  backdrop-filter: blur(5px);
}
.mainlayout_android .q-drawer {
  // background: linear-gradient(145deg, #3370ad 25%, #e4b04f 80%);
  background: rgba(61, 61, 61, 0.7);
}
</style>
