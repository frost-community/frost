# Node.js 20 image on Debian 12 (bookworm)
FROM node:20-bookworm AS frontend
ARG USERNAME=node

# Install pnpm
RUN corepack enable pnpm

# Switch user
# この操作により権限が一般ユーザーになります。
USER $USERNAME
WORKDIR /home/$USERNAME/
