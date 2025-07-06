ServerEvents.recipes(event => {
    //龙息瓶分液
    event.recipes.create.emptying([
        Fluid.of('ustcreate:liquid_dragen_breath', 250),
        'minecraft:glass_bottle'
    ], [
        'minecraft:dragon_breath'
    ]).id('ustcreate:liquid_dragen_breath_emptying')

    //龙息瓶注液
    event.recipes.create.filling([
        'minecraft:dragon_breath'
    ], [
        Fluid.of('ustcreate:liquid_dragen_breath', 250),
        'minecraft:glass_bottle'
    ]).id('ustcreate:liquid_dragen_breath_filling')
})