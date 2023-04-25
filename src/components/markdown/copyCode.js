
import { Notify } from 'quasar';

try {
  // Node js will throw an error
  this === window;

  const Clipboard = require('clipboard');
  const clipboard = new Clipboard('.markdown-it-code-copy');

  clipboard.on('success', function (e) {
    // 成功!
    Notify.create({
      type: "positive",
      message: "文本已复制",
    });
  });

  clipboard.on('error', function (e) {
    // 失败
    Notify.create({
      type: "negative",
      message: "文本复制失败" + err,
    });
  });
}
catch (_err) {
}

const defaultOptions = {
  iconStyle: 'font-size: 26px; opacity: 0.4;',
  iconClass: 'mdi mdi-content-copy',
  buttonStyle: 'position: absolute; top: 7.5px; right: 6px; cursor: pointer; outline: none;',
  buttonClass: ''
};
function mergeObjects (obj1, obj2) {
  return Object.assign({}, obj1, obj2);
}
function renderCode (origRule, options) {
  options = mergeObjects(defaultOptions, options);
  return (...args) => {
    const [tokens, idx] = args;
    const content = tokens[idx].content
      .replaceAll('"', '&quot;')
      .replaceAll("<", "&lt;");
    const origRendered = origRule(...args);

    if (content.length === 0)
      return origRendered;

    return `
<div style="position: relative">
	${origRendered}
	<div class="markdown-it-code-copy ${options.buttonClass}" data-clipboard-text="${content}" style="${options.buttonStyle}" title="Copy">
    <i class="q-icon text-white text-h6 notranslate material-icons" aria-hidden="true">content_copy</i>
	</div>
</div>
`;
  };
}

export function copyCode (md, options) {
  md.renderer.rules.code_block = renderCode(md.renderer.rules.code_block, options);
  md.renderer.rules.fence = renderCode(md.renderer.rules.fence, options);
};
