import { Notify, copyToClipboard } from 'quasar';


const copyHandler = async (text) => {

  copyToClipboard(text)
    .then(() => {
      // 成功!
      Notify.create({
        type: "positive",
        message: "文本已复制",
      });
    })
    .catch((err) => {
      // 失败
      Notify.create({
        type: "negative",
        message: "文本复制失败" + err,
      });
    })
}

function generateRandomString (length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function copyObj (obj) {
  return JSON.parse(JSON.stringify(obj))
}
export { copyHandler, generateRandomString, copyObj };

