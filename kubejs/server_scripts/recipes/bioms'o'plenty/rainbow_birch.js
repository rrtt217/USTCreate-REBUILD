ServerEvents.recipes(event => {
    const dyes = [
        "white_dye",
        "orange_dye",
        "magenta_dye",
        "light_blue_dye",
        "yellow_dye",
        "lime_dye",
        "pink_dye",
        "gray_dye",
        "light_gray_dye",
        "cyan_dye",
        "purple_dye",
        "blue_dye",
        "brown_dye",
        "green_dye",
        "red_dye",
        "black_dye"
    ]

    let recipeResults = [];

    for (const dye of dyes) {
        recipeResults.push({
            "item": `minecraft:${dye}`,
            "chance": 0.25
        });
    }

    event.custom({
        "type": "ratatouille:squeezing",
        "ingredients": [
            {
                "item": "biomesoplenty:rainbow_birch_leaves"
            }
        ],
        "results": recipeResults
    });
})