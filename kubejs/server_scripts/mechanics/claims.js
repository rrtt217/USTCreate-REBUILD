ServerEvents.command(e => {
    let arguments = e.input.split(" ").slice(1);
    if (e.commandName == "openpac-claims") {
        if (arguments[0] == "claim") {
            //e.server.xaero_OPAC_ServerData.serverClaimsManager.
        }
        e.server.tell("claims " + e.input)
        e.cancel()
    }
})