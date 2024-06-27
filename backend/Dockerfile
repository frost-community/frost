FROM ubuntu:24.04

# Install Packages
RUN \
 --mount=type=cache,target=/var/lib/apt/lists \
 --mount=type=cache,target=/var/cache/apt/archives \
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
  apt-get install -y nodejs postgresql postgresql-contrib

# Install pnpm
RUN corepack enable pnpm
