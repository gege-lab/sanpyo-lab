# 3表ラボ

P/L、B/S、C/Fを自分で学ぶための静的ブラウザツールです。

## 開き方

`index.html` をブラウザで開きます。

## iPhoneで開く

### Macの近くで使う

1. MacとiPhoneを同じWi-Fiにつなぎます。
2. Macで `start-iphone.command` を開きます。
3. Terminalに表示された `http://192.168.x.x:4173/` のようなURLをiPhoneのSafariで開きます。
4. Safariの共有ボタンから「ホーム画面に追加」を選ぶと、アプリのように起動できます。

`127.0.0.1` はMac専用です。iPhoneでは、MacのWi-Fi内IPアドレスを使います。

### 外出先で使う

このツールは静的サイトなので、GitHub Pages、Netlify、Vercel、Cloudflare Pagesなどに公開すると、外出先のiPhoneからも使えます。

HTTPS公開版では `sw.js` が基本ファイルを保存するため、一度読み込んだあとならオフラインでも開ける状態を目指せます。

## 内容

- 数字を動かす3表シミュレーター
- iPhoneで使うための案内、ホーム画面追加設定、オフラインPWA準備
- 簿記3級の基礎テーマと仕訳例題
- P/L、B/S、C/Fの基礎マップ
- 取引が3表にどう出るかを見るカード
- ケース演習
- 読み取りクイズ
- 用語検索
