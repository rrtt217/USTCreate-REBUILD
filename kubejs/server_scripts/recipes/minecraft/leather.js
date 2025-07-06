ServerEvents.recipes(event => {
    //腐肉压制成皮革
    event.recipes.create.compacting([
        "minecraft:leather", 
        Fluid.of("biomesoplenty:blood", 250)
    ], [
        Item.of("minecraft:rotten_flesh", 4)
    ]).id("ustcreate:compacting/leather_from_rotten_flesh")

    
})