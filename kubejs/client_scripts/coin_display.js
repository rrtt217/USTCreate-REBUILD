let PlayerCoinManager = Java.loadClass("com.ustcmc.ustcreate.core.PlayerCoinManager");

PlayerEvents.tick(e => {
    let coin_count = { type: "text", remove: true };
    let coin_detail = { type: "text", remove: true };
    if (e.player.isShiftKeyDown()) {
        let count = PlayerCoinManager.getCoins(e.player);
        coin_count = {
            type: "text",
            text: [`coins: ${count}`],
            x: 10,
            y: Client.window.guiScaledHeight - 30,
            shadow: true
        };
        let coin_value = global.COIN_VALUE_ORDER
            .map((v, i) => `${
                i === global.COIN_VALUE_ORDER.length - 1 
                ? Math.floor(count / Math.pow(global.COIN_VALUE_RATIO, i))
                : Math.floor(count / Math.pow(global.COIN_VALUE_RATIO, i)) % global.COIN_VALUE_RATIO
            }${v[0].toUpperCase()}`)
            .reverse();
        coin_detail = {
            type: "text",
            text: [`§8${coin_value[0]} §e${coin_value[1]} §f${coin_value[2]} §6${coin_value[3]}`],
            x: 10,
            y: Client.window.guiScaledHeight - 20,
            shadow: true
        };
    }
    e.player.paint({
        coin_count: coin_count,
        coin_detail: coin_detail
    });
})
