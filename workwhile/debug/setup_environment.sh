#!/usr/bin/env bash
REQUIRED_UV_VERSION="0.5.4"

# Check if `uv` is installed and on the PATH
if ! command -v uv &> /dev/null
then
    echo "uv could not be found, installing latest version..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi
INSTALLED_UV_VERSION=$(uv --version | awk '{print $2}')


if [ "$(printf '%s\n' "$REQUIRED_UV_VERSION" "$INSTALLED_UV_VERSION" | sort -V | head -n1)" != "$REQUIRED_UV_VERSION" ]; then
    echo "uv version must be at least $REQUIRED_UV_VERSION, updating to latest version..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    exec "$SHELL"
fi

echo "uv is installed and meets the version requirement"
