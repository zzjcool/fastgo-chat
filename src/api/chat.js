import { api } from 'boot/axios'
const BASE_PATH = '/chat'
import { Notify } from 'quasar';
import { useSettingsStore } from 'src/stores/settings';

const dec = new TextDecoder();

export async function sendMessage (messages) {
  return api({
    url: BASE_PATH,
    method: 'post',
    data: {
      messages
    }
  })
}
export async function sendMessageStream (messages) {
  const settings = useSettingsStore();

  let url = process.env.API_ADDRESS + '/chat/completions'
  let headers = {
    "Content-Type": "application/json"
  }

  if (settings.api.apiType == settings.API_TYPE.AZURE) {
    // Azure api
    url = settings.api.api + '/openai/deployments/' + settings.api.azureEngine + '/chat/completions?api-version=' + settings.api.azureVersion;
    headers['api-key'] = settings.api.key
  } else {
    url = settings.api.api + '/v1/chat/completions';
    headers.Authorization = 'Bearer ' + settings.api.key
  }

  const response = await fetch(url, {
    headers,
    method: "POST",
    body: JSON.stringify({ messages, stream: true, model: settings.api.model, }),
  });

  if (settings.api.customApi && response.status == 401) {
    Notify.create({
      type: 'negative',
      message: "自定义接入点需要Key！"
    })
    return Promise.reject(null)
  } else if (!settings.api.customApi && response.status == 401) {
    Notify.create({
      type: 'negative',
      message: "登录过期，请重新登录！"
    })

    return Promise.reject(null)
  }

  if (response.status != 200) {

    const reader = response.body.getReader();
    const resp = await readStream(reader);

    try {
      const respObj = JSON.parse(resp)
      if (!respObj.code) {
        Notify.create({
          type: 'negative',
          message: "出错了!" + respObj.error.message,
        })
        return Promise.reject(null)
      }
      Notify.create({
        type: 'negative',
        message: "出错了!" + respObj.message,
      })
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: "出错了!" + error,
      })
    }


    return Promise.reject(null)
  }
  const reader = response.body
    .getReader();
  return reader
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function sendMessageWrap (messages, onReceive, onEvent) {
  let reader = await sendMessageStream(messages);

  let buff = ""
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      onEvent("DONE", value)
      break
    };

    const text = buff + dec.decode(value);
    buff = ""

    let endChar = text.charAt(text.length - 1)
    if (endChar != '\n') {
      buff = text
      continue
    }
    console.log(text)
    let vals = text.split('\n')
    for (let i = 0; i < vals.length; i++) {
      let val = vals[i]
      if (!val) {
        continue
      }
      let prefix = "data: ";

      if (val.substring(0, prefix.length) === prefix) {
        val = val.substring(prefix.length);
      }

      if (val == "[DONE]") {
        continue
      }
      let response;
      try {
        response = JSON.parse(val)
      } catch (error) {
        throw error + val
      }
      if (response.choices[0]['finish_reason'] == 'content_filter') {
        throw '消息被过滤。'
      }
      if (!response.choices[0].delta.content) { continue }
      let str = response.choices[0].delta.content
      for (let j = 0; j < str.length; j++) {
        let idx = j;
        onReceive(str[idx])
        if (j % 2 == 1) {
          await sleep(50)
        }

      }
    }
  }
}


async function readStream (reader) {
  const { done, value } = await reader.read();
  if (done) {
    // 如果流已经读取完毕，返回空字符串
    return '';
  }
  let text = dec.decode(value);

  return text + await readStream(reader);
}
