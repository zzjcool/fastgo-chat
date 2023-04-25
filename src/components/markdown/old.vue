<template>
  <div
    class="row flex align-center full-height full-width flex-center justify-center items-center"
  >
    <pre
      v-html="markdown"
      class="col markdown-body bg-transparent"
      ref="mdRef"
    ></pre>
  </div>
</template>

<script>
import { marked } from "marked";
import "highlight.js/styles/androidstudio.css";
import "github-markdown-css";
import hljs from "highlight.js";
import { defineComponent, onMounted, ref, watchEffect } from "vue";
import { debounce, QBtn } from "quasar";

function html2Escape(sHtml) {
  var temp = document.createElement("div");
  (temp.textContent != null) ? (temp.textContent = sHtml) : (temp.innerText = sHtml);
  var output = temp.innerHTML;
  temp = null;
  return output;
}
export default defineComponent({
  name: "MarkdownViewer",
  props: {
    content: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    hljs.configure({
      tabReplace: "  ",
      classPrefix: "hljs-",
    });
    // console.log(this.content)
    marked.setOptions({
      renderer: new marked.Renderer(),
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: true,
      sanitize: false,
      langPrefix: "hljs-",
      smartLists: true,
      smartypants: false,
      xhtml: false,
      async: true,
      highlight: function (code) {
        return hljs.highlightAuto(code).value;
      },
    });
    let markdown = ref();

    markdown.value = marked(props.content).replace(
      /<pre>/g,
      "<pre class='hljs hide-scrollbar'>"
    );

    let mdRef = ref(null);
    let letdeb = debounce(() => {
      markdown.value = marked(html2Escape(props.content)).replace(
        /<pre>/g,
        "<pre class='hljs hide-scrollbar'>"
      );
    }, 30);
    watchEffect(() => {
      props.content;
      letdeb();
    });

    return { markdown, mdRef };
  },
});
</script>

<style lang="scss">
.markdown-body {
  font-size: 14px !important;
  color: #000000 !important;
  // white-space: pre-wrap;
  // word-wrap: break-word;

  h1,
  h2,
  h3,
  h4,
  p {
    margin: 0px;
    padding-bottom: 8px;
  }

  pre {
    padding: 10px;
    background-color: #1d1f21 !important;
    overflow: auto;
    margin: auto;

    code {
      background: unset;
      font-weight: normal;
      color: rgba(255, 255, 255, 0.818);
    }
  }

  code {
    background: rgba(137, 134, 134, 0.661);
    color: white;
    font-weight: bold;
  }

  blockquote {
    background: rgba(128, 126, 126, 0.396);
  }

  .hljs-code-number {
    padding: 17px 10px 0;
    // color: #d1d8e6;
    font-size: 12px;
    list-style: none;
    border-right: 1px solid #d1d8e6;
  }
}
</style>
