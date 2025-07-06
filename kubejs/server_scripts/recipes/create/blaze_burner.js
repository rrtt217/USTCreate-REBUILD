ServerEvents.recipes(event => {
    //烈焰人燃烧室
    event.remove({output: "create:empty_blaze_burner"})
    event.shaped("create:empty_blaze_burner", [
        "AEA",
        "ECE",
        "AEA"
    ], {
        A: "tconstruct:steel_ingot",
        E: "create:iron_sheet",
        C: "minecraft:netherrack"
    })
    
})