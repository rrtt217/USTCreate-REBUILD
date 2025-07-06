ServerEvents.recipes(event => {
    //在普通熔炉里只会得到未完全熔化的铁
    event.replaceOutput(
        { type: "minecraft:smelting", output: "minecraft:iron_ingot" }, 
        "minecraft:iron_ingot", 
        "ustcreate:burnt_iron"
    )

    //在普通熔炉里只会得到未完全熔化的铜
    event.replaceOutput(
        { type: "minecraft:smelting", output: "minecraft:copper_ingot" }, 
        "minecraft:copper_ingot", 
        "ustcreate:burnt_copper"
    )

    //在普通熔炉里只会得到未完全熔化的金
    event.replaceOutput(
        { type: "minecraft:smelting", output: "minecraft:gold_ingot" }, 
        "minecraft:gold_ingot", 
        "ustcreate:burnt_gold"
    )

    //高炉
    event.replaceInput(
        {output: "minecraft:blast_furnace"},
        "minecraft:furnace",
        "tconstruct:seared_melter"
    )

})