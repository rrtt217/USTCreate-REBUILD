KeyBindEvents.firstKeyPress("deposit", () => {
    Client.runCommand("deposit all");
})

let ShoppingListItem = Java.loadClass("com.simibubi.create.content.logistics.tableCloth.ShoppingListItem");
const COINS = ["copper", "iron", "gold", "netherite"];

KeyBindEvents.firstKeyPress("withdraw", e => {
    let player = e.getPlayer();
    let item = player.getInventory().getSelected();

    if (item.id !== "create:shopping_list") {
        Client.tell(Text.translate("commands.ustcreate.withdraw.error.not_shopping_list"));
        return;
    }

    let list = ShoppingListItem.getList(item);
    let paymentEntries = list.bakeEntries(e.getLevel(), null).getSecond();

    let neededCoins = COINS.reduce((acc, coin) => {
        acc[coin] = paymentEntries.getCountOf(Item.of(`createdeco:${coin}_coin`));
        return acc;
    }, {});

    let inventory = player.getInventory();
    for (let i = 0; i < inventory.items.size(); i++) {
        let inventoryItem = inventory.getItem(i);
        if (inventoryItem.isEmpty()) continue;

        let itemId = inventoryItem.id;
        if (!itemId.startsWith("createdeco:")) continue;

        let itemParts = itemId.split(":")[1].split("_");
        let coinType = itemParts[0];
        let coinForm = itemParts[1];

        if (!COINS.includes(coinType)) continue;
        if (coinForm !== "coin") continue;

        neededCoins[coinType] -= inventoryItem.getCount();
    }

    let hasWithdrawn = false;
    for (let coinType of COINS) {
        if (neededCoins[coinType] > 0) {
            let res = Client.runCommand(`withdraw ${coinType} ${neededCoins[coinType]}`);
            if (res === -1) return;
            hasWithdrawn = true;
        }
    }

    if (hasWithdrawn) {
        Client.tell(Text.translate("commands.ustcreate.withdraw.success"));
    } else {
        Client.tell(Text.translate("commands.ustcreate.withdraw.info.no_need_withdraw"));
    }
})
