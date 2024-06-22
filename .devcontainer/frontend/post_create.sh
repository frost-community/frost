#!/usr/bin/env bash
# Bash Strict Mode (http://redsymbol.net/articles/unofficial-bash-strict-mode/)
set -euo pipefail
IFS=$'\n\t'

# Constants
USER_NAME=vscode
GROUP_NAME=vscode
WORKSPACE_DIR=/workspaces/Frost
BUILT_NODE_MODULES_DIR=/tmp/project_dependencies/node_modules
NODE_MODULES_DESTINATION_PATH="${WORKSPACE_DIR}/frontend/node_modules"

# Dockerイメージでビルド済みの node_modules/ をワークスペースへコピー
# ローカルで作成されたnode_modulesがあったら削除しておく
if [ -e "$NODE_MODULES_DESTINATION_PATH" ]; then
  sudo unlink "$NODE_MODULES_DESTINATION_PATH"
fi
sudo ln --symbolic "$BUILT_NODE_MODULES_DIR" "$NODE_MODULES_DESTINATION_PATH"
sudo chown "${USER_NAME}:${GROUP_NAME}" --recursive "$NODE_MODULES_DESTINATION_PATH"

