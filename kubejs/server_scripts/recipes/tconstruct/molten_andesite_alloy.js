ServerEvents.recipes(event => {
    // Melting recipes for Andesite Alloy
    event.custom({
        "type": "tconstruct:melting",
        "ingredient": {
            "item": "create:andesite_alloy"
        },
        "result": {
            "amount": 90,
            "fluid": "ustcreate:molten_andesite_alloy"
        },
        "temperature": 800,
        "time": 40
    })

    // Melting recipe for Andesite Alloy Block
    event.custom({
        "type": "tconstruct:melting",
        "ingredient": {
            "item": "create:andesite_alloy_block"
        },
        "result": {
            "amount": 810,
            "fluid": "ustcreate:molten_andesite_alloy"
        },
        "temperature": 800,
        "time": 120
    })

    // Casting recipes for Andesite Alloy
    event.custom({
        "type": "tconstruct:casting_table",
        "cast": {
            "tag": "tconstruct:casts/single_use/ingot"
        },
        "cast_consumed": true,
        "cooling_time": 30,
        "fluid": {
            "amount": 90,
            "fluid": "ustcreate:molten_andesite_alloy"
        },
        "result": "create:andesite_alloy"
    })

    // Casting basin recipe for Andesite Alloy Block
    event.custom({
      "type": "tconstruct:casting_table",
      "cast": {
        "tag": "tconstruct:casts/multi_use/ingot"
      },
      "cooling_time": 30,
      "fluid": {
        "amount": 90,
        "fluid": "ustcreate:molten_andesite_alloy"
      },
      "result": "create:andesite_alloy"
    })

    // Casting basin recipe for Andesite Alloy Block
    event.custom({
        "type": "tconstruct:casting_basin",
        "cooling_time": 100,
        "fluid": {
            "amount": 810,
            "fluid": "ustcreate:molten_andesite_alloy"
        },
        "result": "create:andesite_alloy_block"
    })

    // Alloying recipe for Andesite Alloy
    event.custom({
        "type": "tconstruct:alloy",
        "inputs": [
            {
                "amount": 180,
                "fluid": "ustcreate:molten_andesite"
            },
            {
                "amount": 90,
                "tag": "forge:molten_iron"
            }
        ],
        "result": {
            "amount": 180,
            "fluid": "ustcreate:molten_andesite_alloy"
        },
        "temperature": 550
    })
})
