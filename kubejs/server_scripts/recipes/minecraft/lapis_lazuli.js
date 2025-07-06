ServerEvents.recipes(event => {
    //青金石
    event.recipes.create.filling([
        "minecraft:lapis_lazuli"
    ], [
        Fluid.of("create_enchantment_industry:experience", 10),
        "minecraft:clay_ball"
    ]).id("ustcreate:lapis_lazuli_filling")
})