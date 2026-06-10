# 外出先のiPhoneで使うための公開方法

このツールは静的ファイルだけで動くため、HTTPSで公開すれば外出先のiPhoneからも使えます。

## いちばん簡単な考え方

`financial-statements-learning-tool` フォルダの中身を、そのまま静的サイトとして公開します。

公開対象:

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `icon.svg`
- `sw.js`

## 公開後の使い方

1. iPhoneのSafariで公開URLを開きます。
2. 一度ページを最後まで読み込みます。
3. 共有ボタンから「ホーム画面に追加」を選びます。
4. 外出先ではホーム画面の「3表ラボ」から開きます。

## 注意

- `http://127.0.0.1:4173/` はMac専用です。
- `http://192.168.x.x:4173/` は同じWi-Fi内だけで使えます。
- 外出先で安定して使うには `https://...` の公開URLが必要です。
- オフライン保存はHTTPS公開版で有効になります。
