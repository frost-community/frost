# 開発環境構築
Frost開発の環境構築について

## 手順
VS Code (on Linux or WSL)での開発を想定しています。

1. **リポジトリのクローン**\
   本プロジェクトのリポジトリをLinuxもしくはWSL内の任意のディレクトリにcloneする。
1. ***Docker Engine*のインストール**\
   [Docker公式ドキュメントのインストール手順](https://docs.docker.com/engine/install/)を参考にDocker Engineをインストールする。

   ℹ️WSLの環境ではWindowsホストではなくLinuxへのDocker Engineインストールで動作を確認済みです。

   ※ Snap から Docker Engine をインストールした場合、Dev Container が動かなくなるので注意すること
1. **リポジトリを開く**\
   VS Codeでリポジトリのディレクトリを開く。
1. **拡張機能のインストール**\
   拡張機能を開き、検索窓に`@recommended`を入力。 (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> → `Extensions: Show Recommended Extensions`)\
   「ワークスペースの推奨事項」アコーディオン内に表示された拡張機能を全てインストールする。
1. **Dev Containerを開く**\
   左下の `><` をクリックし、「コンテナーで再度開く」を選択する。 (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> → `Dev Containers: Reopen in Container`)\
   上部中央に開いたモーダルから目的のリポジトリを選択する。
