const COIN_VALUE_ORDER = ["copper", "iron", "gold", "netherite"]
const COIN_VALUE_RATIO = 32

const DAILY_COIN_COUNT = 20

ServerEvents.recipes(e => {
    e.remove({ type: "create:pressing", mod: "createdeco" })
})

PlayerEvents.loggedIn(e => {
    let pData = e.player.persistentData;
    const now = new Date();
    const lastLoggedIn = new Date(pData.lastLoggedIn);
    if (now.getDate() !== lastLoggedIn.getDate()) {
        let bk_coins = parseInt(pData.coins) || 0;
        pData.coins = (bk_coins + DAILY_COIN_COUNT).toString();
        e.player.tell(Text.translate("info.ustcreate.daily_coin", [DAILY_COIN_COUNT]));
        pData.lastLoggedIn = now.toISOString();
    }
})

PlayerEvents.tick(e => {
    let count = e.player.persistentData.coins || 0;
    let coin_value = COIN_VALUE_ORDER
        .map((v, i) => `${
            i === COIN_VALUE_ORDER.length - 1 
            ? Math.floor(count / Math.pow(COIN_VALUE_RATIO, i))
            : Math.floor(count / Math.pow(COIN_VALUE_RATIO, i)) % COIN_VALUE_RATIO
        }${v[0].toUpperCase()}`)
        .reverse()
    e.player.paint({
        coin_num: {
            type: "text",
            text: [`coins: §8${coin_value[0]} §e${coin_value[1]} §f${coin_value[2]} §6${coin_value[3]}`],
            x: 10,
            y: Client.window.guiScaledHeight - 25,
            shadow: true
        },
        
    })
})

ServerEvents.commandRegistry(e => {
    let { arguments: arg, commands: cmd } = e;
    function deposit(pData, inventory, item) {
        if (item.mod !== "createdeco") {
            return 0;
        }
        let itemLs = item.id.split(":")[1].split("_");
        let order = COIN_VALUE_ORDER.indexOf(itemLs[0]);
        if (order === -1) {
            return 0;
        }
        let ratio = itemLs[1] === "coinstack" ? 4 : (itemLs[1] === "coin" ? 1 : 0);
        let coins = item.getCount() * Math.pow(COIN_VALUE_RATIO, order) * ratio;
        if (coins) {
            inventory.removeItem(item);
            let bk_coins = parseInt(pData.coins) || 0;
            pData.coins = (bk_coins + coins).toString();
        }
        return coins;
    }
    e.register(
        cmd.literal("deposit")
        .executes(c => {
            let player = c.source.player;
            let inventory = player.getInventory();
            let coins = deposit(player.persistentData, inventory, inventory.getSelected());
            if (!coins) {
                player.tell(Text.translate("commands.ustcreate.coin.error.not_coin"));
            }
            return 1;
        })
        .then(cmd.literal("all")
            .executes(c => {
                let player = c.source.player;
                let inventory = player.getInventory();
                let coins = 0;
                for (const item of inventory.getAllItems()) {
                    coins += deposit(player.persistentData, inventory, item);
                }
                player.tell(Text.translate("commands.ustcreate.coin.success.deposit", [coins.toString()]));
                return 1;
            })
        )
    )
    let withdraw = cmd.literal("withdraw")
    COIN_VALUE_ORDER.forEach((type, idx) => {
        withdraw.then(cmd.literal(type)
            .then(cmd.argument("amount", arg.INTEGER.create(e))
                .executes(c => {
                    let player = c.source.player;
                    let amount = arg.INTEGER.getResult(c, "amount");
                    if (isNaN(amount) || amount < 0) {
                        player.tell(Text.translate("commands.ustcreate.coin.error.invalid_number"));
                        return 1;
                    }
                    let total_coins = amount * Math.pow(COIN_VALUE_RATIO, idx);
                    let bk_coins = parseInt(player.persistentData.coins) || 0;
                    if (total_coins > bk_coins) {
                        player.tell(Text.translate("commands.ustcreate.coin.error.not_enough_coins"));
                        return 1;
                    }
                    player.persistentData.coins = (bk_coins - total_coins).toString();
                    player.give(Item.of(`createdeco:${type}_coin`, amount));
                    return 1;
                })
            )
        )
    })
    e.register(withdraw)
})
