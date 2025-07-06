ServerEvents.recipes(event => {
    //粉碎硫磺石获得硫磺
    event.recipes.create.crushing([
        Item.of("ustcreate:sulfur", 2),
        Item.of("minecraft:gunpowder", 1).withChance(0.2),
        Item.of("create:cinder_flour", 1).withChance(0.5)
    ], [
        "biomesoplenty:brimstone"
    ]).id("ustcreate:crushing/brimstone")

    //硫磺经过脱粒机变成烈焰粉
    event.custom({
        "type": "ratatouille:threshing",
        "ingredients": [
            {
                "item": "ustcreate:sulfur"
            }
        ],
        "processingTime": 200,
        "results": [
            {
                "item": "minecraft:blaze_powder",
                "count": 1
            },
            {
                "item": "minecraft:glowstone_dust",
                "count": 1,
                "chance": 0.25
            }
        ]
    }).id("ustcreate:threshing/sulfur")

})