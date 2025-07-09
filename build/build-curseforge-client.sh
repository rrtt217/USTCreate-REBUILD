#!/bin/sh
PACK_NAME=$(grep -m 1 'name' pack.toml | cut -d '"' -f2)
VERSION=$(grep -m 1 'version' pack.toml | cut -d '"' -f2)
./packwiz curseforge export --side client -o ".build/${PACK_NAME}-${VERSION}.zip"