ServerEvents.recipes(event => {
    //孢子花
    event.recipes.create.deploying([
        "minecraft:spore_blossom"
    ], [
        "minecraft:moss_block",
        "#minecraft:flowers"
    ]).id("ustcreate:deploying/spore_blossom")
})