#!/bin/sh
export PATH=$PATH:/usr/local/go/bin
PACK_NAME=$(grep -m 1 'name' pack.toml | cut -d '"' -f2)
VERSION=$(grep -m 1 'version' pack.toml | cut -d '"' -f2)
wget https://cdn.modrinth.com/data/NNAgCjsB/versions/UOhdZxPT/entityculling-forge-1.8.1-mc1.20.1.jar -P .cache/import
mkdir -p .build && ./packwiz --cache .cache modrinth export -o ".build/${PACK_NAME}-${VERSION}-modrinth.mrpack"
rm -r .cache/??