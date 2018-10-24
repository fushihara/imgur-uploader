# imgur ブラウザアップローダー

- chromeブラウザから、クリップボードの画像・もしくはドロップした画像ファイルをimgurにアップロードします。
- 素早くアップロード。

# リサイズの挙動
- gifはリサイズせず、常にそのままアップロード。
- pngはjpgにフォーマット変換されます。「pngのjpeg変換を禁止する」のチェックが入っている時は、pngをpngのままアップロードします。

# コンパイル方法
-git cloneした後、VisualStudioCodeで開き「docsにコンパイル」を実行。

# apiキーの取得方法
- apiキーの登録方法はこの記事を確認。 https://qiita.com/AKB428/items/a5f68a3288cc596975ae
  - https://imgur.com/ imgurのサイトにユーザ登録。SNS認証でいい。
  - https://api.imgur.com/oauth2/addclient にアクセスしてアプリケーション登録
  - Application name:、Email:、が必須らしいので記入。(メールは何の認証も無いっぽい)
  - https://imgur.com/account/settings/apps で作成したアプリのClient IDをコピー。これがapiキー
- アップロードした画像から、誰が投稿したか？の逆引きはできないはずですが、実は調べられたらごめんなさい。
- アップロード枚数や容量の制限はimgurに依存します。

