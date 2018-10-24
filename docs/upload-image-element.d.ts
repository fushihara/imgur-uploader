export declare class UploadImageElement extends HTMLElement {
    private アップロードステータス;
    private ファイルのblob;
    private elements;
    private 画像データ;
    private 画像のURL;
    constructor();
    画像のファイルをセット(画像のblob: Blob, mime: string, アップロードに使うapiToken: string): Promise<string>;
    アップロードした画像のURLかnullを取得(): string | null;
}
