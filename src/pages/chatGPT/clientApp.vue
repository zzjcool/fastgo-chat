<template>
  <q-page class="column items-center q-pt-md q-gutter-lg">
    <q-card flat class="main-width">
      <q-card-section
        class="text-weight-bold text-subtitle1 bg-primary text-white"
        >客户端</q-card-section
      >
    </q-card>
    <q-card flat class="main-width">
      <q-list>
        <q-item clickable @click="copyHandler('https://api.fastgo.run')">
          <q-item-section avatar>
            <q-icon color="green-5" name="api" />
          </q-item-section>

          <q-item-section>
            <q-item-label>https://api.fastgo.run</q-item-label>
            <q-item-label caption>API接入点</q-item-label>
          </q-item-section>
        </q-item>
        <q-item :clickable="meta.key != ''" @click="copyHandler(meta.key)">
          <q-item-section avatar>
            <q-icon color="blue-5" name="key" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="overflow-auto" style="white-space:nowrap">{{
              meta.key || "当前没开启客户端功能，请先生成Key"
            }}</q-item-label>
            <q-item-label caption
              >客户端使用的Key，请不要泄漏{{
                meta.key ? "，点击复制" : ""
              }}</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item clickable href="https://zzj.cool/p/chatgpt-%E5%AE%A2%E6%88%B7%E7%AB%AF/" target="to">
          <q-item-section avatar>
            <q-icon color="accent" name="link" />
          </q-item-section>

          <q-item-section>
            <q-item-label>了解如何使用</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <div class="main-width">
      <q-btn
        :loading="meta.isLoading"
        v-if="meta.key"
        unelevated
        color="red-5"
        label="删除Key"
        type="submit"
        @click="deleteKey"
        style="width: 100%"
      />
      <q-btn
        v-else
        :loading="meta.isLoading"
        unelevated
        color="green-5"
        label="生成Key"
        @click="createKey"
        style="width: 100%"
      />
    </div>
  </q-page>
</template>

<script>
import { createApiKey, deleteApiKey, getApiKey } from "src/api/apiKey";
import { defineComponent, onMounted, ref } from "vue";
import { copyHandler } from "src/utils/tools";

export default defineComponent({
  name: "ClientApp",
  setup() {
    const meta = ref({
      key: "",
      isLoading: true,
    });
    async function getKey() {
      meta.value.isLoading = true;
      try {
        const resp = await getApiKey();
        meta.value.key = resp.data.key;
      } catch (error) {
        meta.value.key = "";
      }
      meta.value.isLoading = false;
    }

    onMounted(async () => {
      getKey();
    });

    async function createKey() {
      meta.value.isLoading = true;
      try {
        await createApiKey();
        await getKey();
      } catch (error) {}

      meta.value.isLoading = false;
    }

    async function deleteKey() {
      meta.value.isLoading = true;
      try {
        await deleteApiKey();
        await getKey();
      } catch (error) {}

      meta.value.isLoading = false;
    }

    return {
      meta,
      createKey,
      deleteKey,
      copyHandler,
    };
  },
  components: {},
});
</script>

<style lang="sass"></style>
