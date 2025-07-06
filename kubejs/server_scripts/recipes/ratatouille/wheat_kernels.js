ServerEvents.recipes(event => {
    event.custom({
        "type": "ratatouille:threshing",
        "ingredients": [
            {
                "item": "biomesoplenty:barley"
            }
        ],
        "processingTime": 200,
        "results": [
            {
                "item": "ratatouille:wheat_kernels",
                "count": 1,
            },
            {
                "item": "ratatouille:wheat_kernels",
                "count": 1,
                "chance": 0.5
            }
        ]
    }).id("ustcreate:threshing/barley")
})