// Refueled模组的电池合成
ServerEvents.recipes(event => {
  // You can replace `event` with any name you like, as
  // long as you change it inside the callback too!

  // This part, inside the curly braces, is the callback.
  // You can modify as many recipes as you like in here,
  // without needing to use ServerEvents.recipes() again.

    console.log('Injecting October update recipes')
    //battery
    event.remove({ output: 'refueled:battery' })
    event.shaped(
        Item.of('refueled:battery', '{Energy:8000}'), // arg 1: output
        [
            'A B',
            'RDR', // arg 2: the shape (array of strings)
            'DDD'
        ],
        {
            A: '#forge:ingots/zinc',
            B: '#forge:ingots/copper',  //arg 3: the mapping object
            R: 'minecraft:redstone_torch',
            D: Ingredient.of([
                    'minecraft:cobbled_deepslate',
                    'minecraft:deepslate'
                ]),
        }
    )
    event.shaped(
        Item.of('refueled:battery', '{Energy:8000}'), // arg 1: output
        [
            'ACB'
        ],
        {
            A: '#forge:ingots/zinc',
            B: '#forge:ingots/copper',  //arg 3: the mapping object
            C: 'refueled:battery'
        }
    )
})