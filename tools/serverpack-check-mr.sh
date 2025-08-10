mkdir -p .build/serverpack-check-mr
build/build-modrinth.sh
mrpack-install ./.build/*-*-modrinth.mrpack --server-dir .build/serverpack-check-mr
cd .build/serverpack-check-mr
rm -r kubejs/client_scripts
rm -r kubejs/startup_scripts/key_registry.js
./run.sh

if [ ! -f eula.txt ] || grep -q '^eula=false' eula.txt; then
    # Agree to the EULA.
    sed -i 's/eula=false/eula=true/' eula.txt
    # Rerun the server to ensure it starts correctly.
    ./run.sh
fi

