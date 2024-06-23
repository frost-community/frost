#!/usr/bin/env bash

# Bash Strict Mode (http://redsymbol.net/articles/unofficial-bash-strict-mode/)
set -euo pipefail
IFS=$'\n\t'

# Constants
USER_NAME=vscode
GROUP_NAME=vscode
PROJECT_DIR=/workspaces/Frost
BUILT_NODE_MODULES_DIR=/tmp/project_dependencies/node_modules
NODE_MODULES_DESTINATION_PATH="${PROJECT_DIR}/frontend/node_modules"

# Dockerイメージでビルド済みの node_modules/ をワークスペースへ移動
# TODO: symlink時代の対応 近いうちに消す
if [ -L "$NODE_MODULES_DESTINATION_PATH" ]; then
  sudo unlink "$NODE_MODULES_DESTINATION_PATH"
fi
if [[ ! -d "$BUILT_NODE_MODULES_DIR" ]]; then
  # node_modules/がない場合はnop
  echo No "node_modules/"
else
  # 過去に作成されたnode_modulesがあったら削除しておく
  if [ -d "$NODE_MODULES_DESTINATION_PATH" ]; then
    sudo rm --recursive  "$NODE_MODULES_DESTINATION_PATH"
  fi
  sudo mv "$BUILT_NODE_MODULES_DIR" "$NODE_MODULES_DESTINATION_PATH"
  sudo chown "${USER_NAME}:${GROUP_NAME}" --recursive "$NODE_MODULES_DESTINATION_PATH"
fi
