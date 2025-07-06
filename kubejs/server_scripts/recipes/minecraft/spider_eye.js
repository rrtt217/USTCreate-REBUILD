ServerEvents.recipes(event => {
    event.recipes.create.filling([
        "minecraft:spider_eye"
    ], [
        Fluid.of("tconstruct:venom", 1000), 
        "ends_delight:ender_pearl_grain"
    ]).id("ustcreate:filling/spider_eye")
})