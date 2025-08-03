ServerEvents.recipes(event => {
    //蜘蛛眼
    event.recipes.create.filling([
        "minecraft:spider_eye"
    ], [
        Fluid.of("tconstruct:venom", 500), 
        "ends_delight:ender_pearl_grain"
    ]).id("ustcreate:filling/spider_eye_from_ender_pearl")

    event.recipes.create.filling([
        "minecraft:spider_eye"
    ], [
        Fluid.of("tconstruct:venom", 1000), 
        '#forge:dough'
    ]).id("ustcreate:filling/spider_eye_from_dough")
})