<template>
  <div
    class="row flex align-center full-height full-width flex-center justify-center items-center"
  >
    <div
      v-html="markdown"
      class="col markdown-body bg-transparent"
      ref="mdRef"
    ></div>
  </div>
</template>

<script>
import "github-markdown-css";
import "highlight.js/styles/androidstudio.css";
import MarkdownIt from "markdown-it";
import { debounce } from "quasar";
import { defineComponent, ref, watchEffect, onMounted } from "vue";

export default defineComponent({
  name: "MarkdownViewer",
  props: {
    content: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    let markdown = ref("");
    let md = new MarkdownIt();
    let mdRef = ref(null);
    let letdeb = debounce(() => {
      if (md == null) {
        return;
      }
      markdown.value = md.render(props.content);
    }, 30);
    onMounted(async () => {
      const hljs = (await import("highlight.js")).HighlightJS;
      md = new MarkdownIt({
        html: false,
        linkify: true,
        typographer: true,
        langPrefix: "hljs-",
        highlight: function (str, lang) {
          if (!lang|| !hljs.getLanguage(lang)) {
            lang = "javascript"
          }
          try {
              const lines = str.split(/\n/).length - 1;
              const numbers = [...new Array(lines)]
                .map((_, index) => `${index + 1}\n`)
                .join("");

              return (
                `<pre class="row hljs full-width"><div class="q-pr-sm non-selectable text-grey-7">${numbers}</div><code class="col hide-scrollbar overflow-auto">` +
                hljs.highlight(str, { language: lang, ignoreIllegals: true })
                  .value +
                "</code></pre>"
              );
            } catch (__) {}

          return (
            '<pre class="hljs hide-scrollbar"><code>' +
            md.utils.escapeHtml(str) +
            '</code></pre>'
          );
        },
      });
      const cp = await import('./copyCode.js')
      md.use(cp.copyCode)
      letdeb()
    });


    watchEffect(() => {
      props.content;
      letdeb();
    });
    return { markdown, mdRef };
  },
});
</script>

<style lang="scss">
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.markdown-body {
  font-size: 14px !important;
  color: #000000 !important;
  // padding: 0 8px;
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
  p {
    padding: 8px 0;
  }

  pre {
    padding: 10px;
    background-color: #1d1f21 !important;
    overflow: auto !important;
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
