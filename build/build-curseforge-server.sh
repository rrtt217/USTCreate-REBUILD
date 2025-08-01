#!/bin/sh
export PATH=$PATH:/usr/local/go/bin
PACK_NAME=$(grep -m 1 'name' pack.toml | cut -d '"' -f2)
VERSION=$(grep -m 1 'version' pack.toml | cut -d '"' -f2)
mkdir -p .build && ./packwiz curseforge export --side server -o ".build/${PACK_NAME}-${VERSION}-curseforge-server.zip"