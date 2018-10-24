const jpgのクオリティ = 95;
export async function 画像を指定サイズにリサイズ(image, 長辺の長さ上限, 変換後の型) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext('2d');
    let outWidth = image.width, outHeight = image.height;
    if (長辺の長さ上限 != null) {
        if (image.width > image.height) {
            outWidth = 長辺の長さ上限;
            outHeight = image.height * 長辺の長さ上限 / image.width;
        }
        else {
            outHeight = 長辺の長さ上限;
            outWidth = image.width * 長辺の長さ上限 / image.height;
        }
    }
    canvas.width = outWidth;
    canvas.height = outHeight;
    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, outWidth, outHeight);
    const リサイズ済みのblob = await new Promise((resolve, reject) => {
        if (変換後の型 == "jpg") {
            canvas.toBlob((cb) => {
                if (cb == null) {
                    reject(new Error(`画像をcanvasから作成できませんでした`));
                }
                else {
                    resolve(cb);
                }
            }, "image/jpeg", jpgのクオリティ);
        }
        else if (変換後の型 == "png") {
            canvas.toBlob((cb) => {
                if (cb == null) {
                    reject(new Error(`画像をcanvasから作成できませんでした`));
                }
                else {
                    resolve(cb);
                }
            }, "image/png");
        }
    });
    return {
        blob: リサイズ済みのblob,
        width: outWidth,
        height: outHeight
    };
}
export async function blobから画像を取得する(ファイル) {
    const imageBase64 = await new Promise(resolve => {
        const fr = new FileReader();
        fr.onload = () => {
            // onload内ではe.target.resultにbase64が入っているのであとは煮るなり焼くなり
            const base64 = fr.result;
            resolve(base64);
        };
        fr.readAsDataURL(ファイル);
    });
    // base64で取れたのを画像に入れる
    const image = await (new Promise(ok => {
        const image = new Image();
        image.onload = () => {
            ok(image);
        };
        image.src = imageBase64;
    }));
    return image;
}
export async function 画像をimgurlにアップロードする(画像ファイル, apiToken) {
    //まだアップロードプログレス取れないのつかえね～
    const form = new FormData();
    form.append('image', 画像ファイル);
    const imageUploadResult = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        body: form,
        headers: { "Authorization": `Client-ID ${apiToken}` }
    }).then(res => res.json());
    console.log(imageUploadResult);
    if (imageUploadResult.success) {
        return imageUploadResult.data.link;
    }
    else {
        return Promise.reject(new Error("アップロードに失敗しました。\n" + JSON.stringify(imageUploadResult, null, "  ")));
    }
}
//# sourceMappingURL=utils.js.map