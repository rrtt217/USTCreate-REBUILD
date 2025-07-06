ServerEvents.recipes(event => {
    event.custom({
        "type": "tconstruct:melting",
        "ingredient": {
            "item": "ustcreate:burnt_iron"
        },
        "result": {
            "amount": 90,
            "fluid": "tconstruct:molten_iron"
        },
        "temperature": 800,
        "time": 30
    })

    event.custom({
        "type": "tconstruct:melting",
        "ingredient": {
            "item": "ustcreate:burnt_copper"
        },
        "result": {
            "amount": 90,
            "fluid": "tconstruct:molten_copper"
        },
        "temperature": 500,
        "time": 30
    })

    event.custom({
        "type": "tconstruct:melting",
        "ingredient": {
            "item": "ustcreate:burnt_gold"
        },
        "result": {
            "amount": 90,
            "fluid": "tconstruct:molten_gold"
        },
        "temperature": 500,
        "time": 30
    })
})