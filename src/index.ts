import { UploadImageElement } from "./upload-image-element.js";
import { blobから画像を取得する, 画像を指定サイズにリサイズ } from "./utils.js";
const localStorageKey = {
  apiToken: "api-token-gtibku21",
  解像度: "resolution-3cwyh4nt",
  pngのjpg変換強制: "png-to-jpg-6aibey2g",
  urlの自動コピー: "url-auto-copk88c22ody-xncg7wct"
}
const ドロップdiv: HTMLDivElement = document.querySelector<HTMLDivElement>("#drop")!;
const テキストエリア: HTMLTextAreaElement = document.querySelector<HTMLTextAreaElement>("#textarea")!;
const コピーボタン: HTMLButtonElement = document.querySelector<HTMLButtonElement>("#copy")!;
const クリアボタン: HTMLButtonElement = document.querySelector<HTMLButtonElement>("#clear")!;
const 画像リサイズ指定一覧 = [
  { radio: document.querySelector<HTMLInputElement>(`input[name="resize"][value="unlimited"]`)!, size: null },
  { radio: document.querySelector<HTMLInputElement>(`input[name="resize"][value="1920"]`)!, size: 1920 },
  { radio: document.querySelector<HTMLInputElement>(`input[name="resize"][value="1600"]`)!, size: 1600 },
  { radio: document.querySelector<HTMLInputElement>(`input[name="resize"][value="1280"]`)!, size: 1280 },
  { radio: document.querySelector<HTMLInputElement>(`input[name="resize"][value="1024"]`)!, size: 1024 },
  { radio: document.querySelector<HTMLInputElement>(`input[name="resize"][value="854"]`)!, size: 854 },
];
const pngの変換を強制: HTMLInputElement = document.querySelector<HTMLInputElement>("#pngtojpg")!;
const URLの自動コピー: HTMLInputElement = document.querySelector<HTMLInputElement>("#autocopy")!;
const 画像一覧div: HTMLDivElement = document.querySelector<HTMLDivElement>("#image-list")!;
const apiToken: HTMLInputElement = document.querySelector<HTMLInputElement>("#api-token")!;
// localStorageの設定を復元
/*if (localStorage.getItem(localStorageKey.apiToken) != null) {
  apiToken.value = localStorage.getItem(localStorageKey.apiToken)!;
}
apiToken.addEventListener("change", () => { localStorage.setItem(localStorageKey.apiToken, apiToken.value); });
apiToken.addEventListener("keyup", () => { localStorage.setItem(localStorageKey.apiToken, apiToken.value); });*/
if (localStorage.getItem(localStorageKey.解像度) != null) {
  const a = localStorage.getItem(localStorageKey.解像度);
  画像リサイズ指定一覧.forEach(b => {
    if (b.size == a) {
      b.radio.checked = true;
    }
  })
}
画像リサイズ指定一覧.forEach(b => {
  b.radio.addEventListener("click", () => { localStorage.setItem(localStorageKey.解像度, b.radio.value); });
});
if (localStorage.getItem(localStorageKey.pngのjpg変換強制) !== null) {
  pngの変換を強制.checked = localStorage.getItem(localStorageKey.pngのjpg変換強制) == "yes";
}
pngの変換を強制.addEventListener("click", () => { localStorage.setItem(localStorageKey.pngのjpg変換強制, pngの変換を強制.checked ? "yes" : "no"); })
if (localStorage.getItem(localStorageKey.urlの自動コピー) !== null) {
  URLの自動コピー.checked = localStorage.getItem(localStorageKey.urlの自動コピー) == "yes";
}
URLの自動コピー.addEventListener("click", () => { localStorage.setItem(localStorageKey.urlの自動コピー, URLの自動コピー.checked ? "yes" : "no"); })


//@ts-ignore
navigator.permissions.query({ name: 'clipboard-write' });
クリアボタン.addEventListener("click", () => { クリアボタン押下() });
コピーボタン.addEventListener("click", () => {
  //@ts-ignore
  navigator.clipboard.writeText(テキストエリア.value);
});
document.addEventListener('dragover', (ev) => {
  ev.preventDefault();
  ev.dataTransfer!.dropEffect = 'copy';
  ドロップdiv.style.display = "flex";
});
document.addEventListener('drop', (ev) => {
  ev.preventDefault();
  ドロップdiv.style.display = "none";
  const dataTransfar = ev.dataTransfer;
  if (dataTransfar == null) { return; }
  for (let item of dataTransfar.items) {
    if (item.kind != "file" || !item.type.startsWith("image/")) {
      continue;
    }
    const file = item.getAsFile();
    const mime = item.type;
    if (file == null) {
      continue;
    }
    画像をリストに追加する(file, mime);
  }
});

window.addEventListener("paste", async (e: ClipboardEvent) => {
  const clipboardData = e.clipboardData;
  if (!clipboardData) { return; }
  if (clipboardData.types.length == 0) { return; }
  for (let item of clipboardData.items) {
    if (item.kind != "file" || !item.type.startsWith("image/")) {
      continue;
    }
    const file = item.getAsFile();
    const mime = item.type;
    if (file == null) {
      continue;
    }
    画像をリストに追加する(file, mime);
  }
});
async function 画像をリストに追加する(変換元のファイル: Blob, オリジナルのmime: string) {
  const newElement = new UploadImageElement();
  const { ファイル, mime } = await 画像のフォーマットを変換(変換元のファイル, オリジナルのmime);
  const apiトークン = /* apiToken.value*/ "18a9918461819bb";
  //@ts-ignore
  if (apiトークン == "") {
    alert("imgurのapiトークンが無いとアップロードできません。\n登録は無料で行えますので、フッターにapiToken登録方法のページを確認後、テキストボックスにキーを入れてください。");
  }
  const promise = newElement.画像のファイルをセット(ファイル, mime, apiトークン);
  let 最後に画像を追加する: boolean = true;
  //@ts-ignore
  if (最後に画像を追加する == false && 画像一覧div.firstChild) {
    画像一覧div.insertBefore(newElement, 画像一覧div.firstChild);
  } else {
    画像一覧div.appendChild(newElement);
  }
  await promise;
  画像のURL一覧を更新();
}
function 画像のURL一覧を更新() {
  const result: string[] = [];
  for (let a of 画像一覧div.children) {
    if (a instanceof UploadImageElement) {
      const b = a.アップロードした画像のURLかnullを取得();
      if (b != null) {
        result.push(b);
      }
    }
  }
  テキストエリア.value = result.join("\n");
  if (URLの自動コピー.checked) {
    //@ts-ignore
    navigator.clipboard.writeText(result.join("\n"));
  }
}
async function 画像のフォーマットを変換(ファイル: Blob, mime: string): Promise<{ ファイル: Blob, mime: string }> {
  const isGif = mime.endsWith("/gif");
  const isPng = mime.endsWith("/png");
  const pngのjpg変換強制 = pngの変換を強制.checked;
  const 画像オブジェクト = await blobから画像を取得する(ファイル);
  const 画像の解像度 = { width: 画像オブジェクト.width, height: 画像オブジェクト.height };
  const リサイズ解像度 = 画像リサイズ指定一覧.find(a => a.radio.checked)!.size;
  if (isGif) {
    //そのまま;
    return {
      ファイル: ファイル,
      mime: mime
    };
  } else if (リサイズ解像度 == null || Math.max(画像の解像度.width, 画像の解像度.height) <= リサイズ解像度) {
    if (isPng && pngのjpg変換強制 == false) {
      return {
        ファイル: ファイル,
        mime: mime
      };
    } else if (isPng) {
      const { blob } = await 画像を指定サイズにリサイズ(画像オブジェクト, null, "jpg")
      return {
        ファイル: blob,
        mime: "image/jpeg"
      };
    } else {
      return {
        ファイル: ファイル,
        mime: mime
      };
    }
  } else /*リサイズの必要あり*/ {
    if (isPng && pngのjpg変換強制 == false) {
      const { blob } = await 画像を指定サイズにリサイズ(画像オブジェクト, リサイズ解像度, "png");
      return {
        ファイル: blob,
        mime: "image/png"
      };
    } else {
      const { blob } = await 画像を指定サイズにリサイズ(画像オブジェクト, リサイズ解像度, "jpg");
      return {
        ファイル: blob,
        mime: "image/jpeg"
      };
    }
  }
}
function クリアボタン押下() {
  while (画像一覧div.firstChild) {
    画像一覧div.removeChild(画像一覧div.firstChild);
  }
  テキストエリア.value = "";
}