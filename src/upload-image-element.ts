import { 画像をimgurlにアップロードする } from "./utils.js";

const emptyGif = "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
export class UploadImageElement extends HTMLElement {
  private アップロードステータス: "アップロード前" | "アップロード中" | "アップロード完了" | "エラー" = "アップロード前";
  private ファイルのblob: Blob;
  private elements: {
    self: HTMLElement,
    画像: HTMLImageElement
    progress: HTMLProgressElement,
    link: HTMLAnchorElement,
    percent: HTMLElement,
    resolution: HTMLElement,
    extension: HTMLElement
  }
  private 画像データ: {
    画像ファイル: Blob,
    mime: string
  } | null = null;
  private 画像のURL: string | null = null;
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "closed" });
    shadowRoot.innerHTML = `
    <style>
    * {
      word-break: break-all;
      box-sizing: border-box;
    }
      :host{
       display:block; 
       width:270px;
       height:200px;
       border:solid 2px black;
       margin:2px;
      }
    </style>
    <div style="display: flex;flex-direction: column;height:100%;">
      <div style="flex:1 1 0;background-color:silver;overflow: hidden;padding:2px;">
        <img src="${emptyGif}" style="width: 100%;height: 100%;object-fit: contain;">
      </div>
      <div style="flex:0 0 20px;overflow: hidden;display:flex;justify-content: center;font-size:small;position: relative;">
        <progress id="progress" style="position: absolute;top: 0;width: 100%;height: 100%;"></progress>
        <div style="z-index:1;display:flex;width: 100%;justify-content: space-evenly;">
          <a id="link" href="">2Eqlfza.jpg</a>
          <span id="percent">12%</span>
          <span id="resolution">1000x1000</span>
          <span id="extension">gif</span>
        </div>
      </div>
    </div> 
    <div style="display:none;color:red;" id="error-area">
    </div>
  `;
    this.elements = {
      self: this,
      画像: shadowRoot.querySelector<HTMLImageElement>("img")!,
      progress: shadowRoot.querySelector<HTMLProgressElement>("#progress")!,
      link: shadowRoot.querySelector<HTMLAnchorElement>("#link")!,
      percent: shadowRoot.querySelector<HTMLElement>("#percent")!,
      resolution: shadowRoot.querySelector<HTMLElement>("#resolution")!,
      extension: shadowRoot.querySelector<HTMLElement>("#extension")!,
    }
    this.elements.progress.style.display = "none";
    this.elements.link.style.display = "none";
    this.elements.percent.style.display = "none";
    this.elements.resolution.style.display = "none";
    this.elements.extension.style.display = "none";
  }
  async 画像のファイルをセット(画像のblob: Blob, mime: string, アップロードに使うapiToken: string): Promise<string> {
    if (this.アップロードステータス != "アップロード前") {
      throw new Error(`アップロード済みです`);
    }
    const imageBase64 = await new Promise<string>(resolve => {
      const fr = new FileReader();
      fr.onload = () => {
        // onload内ではe.target.resultにbase64が入っているのであとは煮るなり焼くなり
        const base64 = fr.result as "";
        resolve(base64);
      };
      fr.readAsDataURL(画像のblob);
    });
    await new Promise(resolve => {
      this.elements.画像.onload = () => {
        resolve();
      };
      this.elements.画像.src = imageBase64;
    });
    const 解像度 = `${this.elements.画像.naturalWidth}x${this.elements.画像.naturalHeight}`;
    this.elements.resolution.innerText = 解像度;
    this.elements.resolution.style.display = "";
    this.elements.percent.innerText = "wait";
    this.elements.percent.style.display = "";
    this.elements.extension.innerText = mime;
    this.elements.extension.style.display = "";
    this.画像データ = {
      画像ファイル: 画像のblob,
      mime: mime
    };
    this.アップロードステータス = "アップロード中";
    if (アップロードに使うapiToken == "") {
      this.アップロードステータス = "エラー";
      this.elements.self.title = "apiトークンが未指定です";
      this.elements.self.style.borderColor = "red";
      return Promise.reject();
    }
    try {
      const アップロードした画像のurl = await 画像をimgurlにアップロードする(画像のblob, アップロードに使うapiToken);
      this.elements.link.innerText = アップロードした画像のurl.match(/.+\/(.+)/)![1];
      this.elements.link.href = アップロードした画像のurl;
      this.elements.link.style.display = "";
      this.elements.percent.style.display = "none";
      this.アップロードステータス = "アップロード完了";
      this.elements.self.style.borderColor = "blue";
      this.画像のURL = アップロードした画像のurl;
      return アップロードした画像のurl;
    } catch (e) {
      this.アップロードステータス = "エラー";
      this.elements.self.title = e;
      this.elements.self.style.borderColor = "red";
      return Promise.reject();
    }
  }
  アップロードした画像のURLかnullを取得(): string | null {
    return this.画像のURL;
  }
}
customElements.define("upload-image", UploadImageElement);