ServerEvents.recipes(event => {
    // 钢合金
    event.custom({
        "type": "tconstruct:alloy",
        "inputs": [
            {
                "amount": 1000,
                "tag": "forge:molten_iron"
            },
            {
                "amount": 200,
                "tag": "ustcreate:liqui_coal"
            }
        ],
        "result": {
            "amount": 1000,
            "fluid": "tconstruct:molten_steel"
        },
        "temperature": 950
    }).id("ustcreate:alloy/steel")

    // 移除钢锭浇筑配方
    event.remove({output:"tconstruct:steel_ingot"});
    event.remove({output:"tconstruct:steel_block", type:"tconstruct:casting_basin"});
    event.remove({output:"tconstruct:steel_nugget", type:"tconstruct:casting_table"});

    // 浇筑得到钢坯
    event.custom({
        "type": "tconstruct:casting_table",
        "cast": {
            "tag": "tconstruct:casts/multi_use/ingot"
        },
        "cooling_time": 30,
        "fluid": {
            "amount": 90,
            "fluid": "tconstruct:molten_steel"
        },
        "result": "ustcreate:fiery_billet"
    }).id("ustcreate:casting/fiery_billet")

    const create = event.recipes.create;
    const incomplete = "ustcreate:fiery_billet";

    // 钢坯辊压得到钢锭
    create.sequenced_assembly(
        "tconstruct:steel_ingot",
        "ustcreate:fiery_billet", 
        [
            create.pressing(incomplete, incomplete),
        ]
    )
    .transitionalItem(incomplete)
    .loops(3)
    .id("ustcreate:sequenced_assembly_steel_ingot")
})