ServerEvents.recipes(event => {
    //烈焰棒
    event.recipes.create.compacting([
        "minecraft:blaze_rod"
    ], [
        Item.of("minecraft:blaze_powder", 5),
    ]).id("ustcreate:compacting/blaze_rod")

})