ServerEvents.recipes(event => {
    event.remove({ input: "minecraft:andesite", output: "create:andesite_alloy" })

    event.remove({ type: "tconstruct:melting", input: [
        "#minecraft:anvil",
        "#minecraft:rails",
    ] })

    event.remove({ type: "minecraft:smelting",  output: [
        "minecraft:diamond",
        "minecraft:lapis_lazuli",
        "minecraft:emerald",
        "create:zinc_ingot",
    ] })

    event.remove({ id: "minecraft:bread" })
    event.remove({ id: "create_central_kitchen:compacting/cake" })
    event.remove({ input: "minecraft:milk_bucket", output: "minecraft:cake" })

    event.remove({ id: "waystones:warp_dust" })
    event.remove({ id: "waystones:warp_plate" })
    event.remove({ id: 'sophisticatedbackpacks:stack_upgrade_tier_3'})
    event.remove({ id: 'sophisticatedbackpacks:stack_upgrade_tier_4'})
})
