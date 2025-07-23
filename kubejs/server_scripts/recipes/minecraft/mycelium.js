ServerEvents.recipes(event => {
    //菌丝
    event.recipes.create.filling([
        "minecraft:mycelium"
    ], [
        Fluid.of("tconstruct:mushroom_stew", 1000),
        "minecraft:dirt"
    ]).id("ustcreate:filling/mycelium")
})