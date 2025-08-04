ServerEvents.recipes(event => {
    const create = event.recipes.create;

    //液态玫瑰石英
    create.mixing(Fluid.of("ustcreate:liquid_rose_quartz", 500), [
        Item.of('minecraft:redstone', 8),
        Item.of("minecraft:quartz", 1)
    ])
    .heated()
    .id("ustcreate:liquid_rose_quartz_from_redstone_and_quartz")
    
    create.mixing(Fluid.of("ustcreate:liquid_rose_quartz", 500), [
        "create:rose_quartz"
    ])
    .heated()
    .id("ustcreate:liquid_rose_quartz_from_rose_quartz")

    create.mixing(Fluid.of("ustcreate:liquid_rose_quartz", 500), [
        "create:polished_rose_quartz"
    ])
    .heated()
    .id("ustcreate:liquid_rose_quartz_from_polished_rose_quartz")
})