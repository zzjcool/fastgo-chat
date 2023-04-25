import { defineStore } from 'pinia';
import { ref } from 'vue';


let mainRef = ref(null)

export const useMetaStore = defineStore('meta', () => {


  function getMainRef () {
    return mainRef
  }

  function setMainRef (ref) {
    mainRef = ref
  }
  return { mainRef, getMainRef, setMainRef }
})
