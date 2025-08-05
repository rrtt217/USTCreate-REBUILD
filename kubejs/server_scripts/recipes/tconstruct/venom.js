ServerEvents.recipes(event => {
    // 毒液的合成
    event.recipes.create.mixing([
        Fluid.of("tconstruct:venom", 1000)
    ], [
        Fluid.of("minecraft:water", 1000),
        Fluid.of({
            fluid: "create:potion",
            amount: 500,
            nbt: {
                Bottle: "REGULAR",
                Potion: "minecraft:poison"
            }
        }),
        Item.of("biomesoplenty:wilted_lily", 3)
    ])
    .id("ustcreate:mixing/venom");
})