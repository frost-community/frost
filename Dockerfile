# ------------------------------------------------- #
# setup for common

# Node.js 20 image on Debian 12 (bookworm)
FROM node:20-bookworm AS setup-common

RUN apt-get update

# Install sudo
RUN apt-get install -y sudo
RUN echo "node ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/node

# Install ping
RUN apt-get install -y iputils-ping net-tools

# Install PostgreSQL
RUN apt-get install -y postgresql postgresql-contrib

# Install pnpm
RUN corepack enable pnpm

# ------------------------------------------------- #
# setup for for backend

FROM setup-common AS setup-backend

# ------------------------------------------------- #
# setup for frontend

FROM setup-backend AS setup-frontend

# ------------------------------------------------- #
# target: db

FROM postgres:15 AS db
ARG USERNAME=postgres

# Switch user
# この操作により権限が一般ユーザーになります。
USER $USERNAME
WORKDIR /home/$USERNAME/

# ------------------------------------------------- #
# target: backend

FROM setup-backend AS backend
ARG USERNAME=node

# Switch user
# この操作により権限が一般ユーザーになります。
USER $USERNAME
WORKDIR /home/$USERNAME/

# ------------------------------------------------- #
# target: full

FROM setup-frontend AS full
ARG USERNAME=node

# Switch user
# この操作により権限が一般ユーザーになります。
USER $USERNAME
WORKDIR /home/$USERNAME/
