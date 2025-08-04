ServerEvents.recipes(event => {
    event.shapeless('createdeco:iron_coin', [
        Item.of('createdeco:copper_coinstack', 4)
    ])
    event.shapeless('createdeco:gold_coin', [
        Item.of('createdeco:iron_coinstack', 4)
    ])
    event.shapeless('createdeco:netherite_coin', [
        Item.of('createdeco:gold_coinstack', 4)
    ])
})