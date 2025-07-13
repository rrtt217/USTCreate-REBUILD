ServerEvents.recipes(event => {
    // 紫水晶粉碎
    event.recipes.create.crushing([
        Item.of('ustcreate:amethyst_dust', 2), 
        Item.of('ustcreate:amethyst_dust', 1).withChance(0.3)
    ], [
        'minecraft:amethyst_shard'
    ]).id("ustcreate:crushing/amethyst_dust")

    // 紫水晶粉熔化
    event.custom({
        "type": "tconstruct:melting",
        "ingredient": {
            "item": "ustcreate:crushing/amethyst_dust"
        },
        "result": {
            "amount": 30,
            "fluid": "tconstruct:molten_amethyst"
        },
        "temperature": 950,
        "time": 40
    }).id("ustcreate:melting/molten_amethyst_from_amethyst_dust")

    // 
})