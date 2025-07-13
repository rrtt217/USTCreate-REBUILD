ServerEvents.recipes(event => {
    //馅饼酥皮
    event.replaceInput(
        {output: "farmersdelight:pie_crust"},
        "minecraft:wheat", 
        "create:wheat_flour"
    )
    
})