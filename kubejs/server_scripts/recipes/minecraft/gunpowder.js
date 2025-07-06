ServerEvents.recipes(event => {
    //合成火药
    event.shapeless(Item.of("minecraft:gunpowder", 3), [
        "ustcreate:sulfur",
        "minecraft:charcoal",
        "nethersdelight:propelpearl"
    ])
})