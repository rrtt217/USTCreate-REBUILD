const COIN_VALUE_ORDER = ["copper", "iron", "gold", "netherite"]
const COIN_VALUE_RATIO = 16

let PlayerCoinManager = Java.loadClass("com.ustcmc.ustcreate.core.PlayerCoinManager");

ServerEvents.recipes(e => {
    COIN_VALUE_ORDER.forEach(type => {
        e.remove({ id: `createdeco:pressing/coins/${type}_coin` })
    })
})

ServerEvents.commandRegistry(e => {
    let { arguments: arg, commands: cmd } = e;
    function deposit(player, inventory, item) {
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
            PlayerCoinManager.addCoins(player, coins);
        }
        return coins;
    }
    e.register(
        cmd.literal("deposit")
        .executes(c => {
            let player = c.source.player;
            let inventory = player.getInventory();
            let coins = deposit(player, inventory, inventory.getSelected());
            if (!coins) {
                player.tell(Text.translate("commands.ustcreate.deposit.error.not_coin"));
            }
            return 1;
        })
        .then(cmd.literal("all")
            .executes(c => {
                let player = c.source.player;
                let inventory = player.getInventory();
                let coins = 0;
                for (const item of inventory.getAllItems()) {
                    coins += deposit(player, inventory, item);
                }
                player.tell(Text.translate("commands.ustcreate.deposit.success", [coins.toString()]));
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
                        player.tell(Text.translate("commands.ustcreate.withdraw.error.invalid_number"));
                        return 1;
                    }
                    let total_coins = amount * Math.pow(COIN_VALUE_RATIO, idx);
                    if (!PlayerCoinManager.tryDeductCoins(player, total_coins)) {
                        player.tell(Text.translate("commands.ustcreate.withdraw.error.not_enough_coins"));
                        return -1;
                    } else {
                        player.give(Item.of(`createdeco:${type}_coin`, amount));
                    }
                    return 1;
                })
            )
        )
    })
    e.register(withdraw)
})
