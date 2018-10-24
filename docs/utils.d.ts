export declare function 画像を指定サイズにリサイズ(image: HTMLImageElement, 長辺の長さ上限: number | null, 変換後の型: "jpg" | "png"): Promise<{
    blob: Blob;
    width: number;
    height: number;
}>;
export declare function blobから画像を取得する(ファイル: Blob): Promise<HTMLImageElement>;
export declare function 画像をimgurlにアップロードする(画像ファイル: Blob, apiToken: string): Promise<string>;
