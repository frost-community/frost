#!/usr/bin/env bash

# Bash Strict Mode (http://redsymbol.net/articles/unofficial-bash-strict-mode/)
set -euo pipefail
IFS=$'\n\t'

# Constants
USER_NAME=vscode
GROUP_NAME=vscode
PROJECT_DIR=/workspaces/Frost
NODE_MODULES_DESTINATION_PATH="${PROJECT_DIR}/frontend/node_modules"

# 生成されたnode_modulesの所有者を変更
if [[ ! -d "$NODE_MODULES_DESTINATION_PATH" ]]; then
  # node_modules/がない場合はnop
  echo No "node_modules/"
else
  sudo chown "${USER_NAME}:${GROUP_NAME}" --recursive "$NODE_MODULES_DESTINATION_PATH"
fi
