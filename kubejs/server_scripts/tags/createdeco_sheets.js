ServerEvents.tags("item", event => {
    //createdeco的金属板
    event.add("createdeco:sheets", [
        'createdeco:andesite_sheet', 
        'createdeco:zinc_sheet', 
        'createdeco:netherite_sheet', 
        'createdeco:industrial_iron_sheet', 
    ])
})