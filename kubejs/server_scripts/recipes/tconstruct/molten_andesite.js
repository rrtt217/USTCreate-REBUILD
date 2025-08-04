ServerEvents.recipes(event => {
    // Melting recipe for Andesite
    event.custom({
        "type": "tconstruct:melting",
        "ingredient": {
            "item": "minecraft:andesite"
        },
        "result": {
            "amount": 180,
            "fluid": "ustcreate:molten_andesite"
        },
        "temperature": 600,
        "time": 40
    })

    // Casting recipe for Andesite
    event.custom({
        "type": "tconstruct:casting_basin",
        "cooling_time": 40,
        "fluid": {
            "amount": 180,
            "fluid": "ustcreate:molten_andesite"
        },
        "result": "minecraft:andesite"
    })
})
