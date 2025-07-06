ServerEvents.recipes(event => {

    event.remove({ input: "#minecraft:rails" })
    event.remove({ input: "minecraft:andesite", output: "create:andesite_alloy" })
    event.remove({ id: "create_central_kitchen:compacting/cake"})
    event.remove({ input: "minecraft:milk_bucket", output: "minecraft:cake" })
    event.remove({ not:{id: "sophisticatedbackpacks:anvil_upgrade"}, input: "#minecraft:anvil" })
    event.remove({ type: "minecraft:smelting",  output: [
        "minecraft:diamond",
        "minecraft:lapis_lazuli",
        "minecraft:emerald",
        "create:zinc_ingot",
    ] })
    event.remove({ id: "minecraft:bread" })
    event.remove({ type: "create:pressing", mod: "createdeco", not:{ output: "#createdeco:sheets" }})
    
})
