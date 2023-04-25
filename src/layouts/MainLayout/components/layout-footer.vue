<template>
  <q-footer class="foot-bg text-black print-hide">
    <q-toolbar class="column items-center justify-center">
      <div>
        [Github]<a
          href="https://github.com/zzjcool"
          target="_blank"
        ><i>zzjcool</i></a>
        &nbsp;
        [Zhihu]<a
          href="https://www.zhihu.com/people/toi-toi-toi"
          target="_blank"
        ><i>toi-toi-toi</i></a>
        &nbsp;
        [Email]<i>email@zzj.cool</i>
      </div>
    </q-toolbar>
  </q-footer>
</template>

<script>
export default {
  name: "LayoutFooter",
};
</script>

<style lang="scss">
.foot-bg {
  border-style: solid;
  border-width: 1px 0 0 0;
  border-color: rgb(198, 195, 195);
  color: black;
  // background: linear-gradient(145deg, #3370ad 25%, #e4b04f 80%);
  background: white;
  // background: none;
  // background-image: linear-gradient(#94949450, #000);
  // backdrop-filter: blur(5px);
  a:visited {
    color: unset;
  }
  a{
    color: unset;
  }
}
</style>
