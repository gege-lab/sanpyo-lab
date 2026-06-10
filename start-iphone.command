#!/bin/zsh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-4173}"

cd "$SCRIPT_DIR"

echo ""
echo "3表ラボ iPhone用サーバーを起動します"
echo ""
echo "1. MacとiPhoneを同じWi-Fiにつないでください"
echo "2. iPhoneのSafariで、下のURLを開いてください"
echo "3. 終了するときは、このTerminalで Control + C を押してください"
echo ""
echo "Macで開く:"
echo "  http://127.0.0.1:${PORT}/"
echo ""
echo "iPhoneで開く候補:"

FOUND_IP=0
for IFACE in en0 en1 en2 bridge100; do
  IP="$(ipconfig getifaddr "$IFACE" 2>/dev/null || true)"
  if [[ -n "$IP" ]]; then
    FOUND_IP=1
    echo "  http://${IP}:${PORT}/"
  fi
done

if [[ "$FOUND_IP" -eq 0 ]]; then
  echo "  Wi-FiのIPアドレスを取得できませんでした。"
  echo "  システム設定 > Wi-Fi > 詳細 でMacのIPアドレスを確認してください。"
fi

echo ""
python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$SCRIPT_DIR"
