// 熔融紫水晶和水反应生成方解石
FluidEvents.interact(event => {
    event.create(
        'tconstruct:molten_amethyst',
        (level, currentPos, relativePos, currentState) => {
            if (level.getBlock(relativePos).id == 'minecraft:water') return true
            return false
        },
        (level, currentPos, relativePos, currentState) => {

            let sourceBlockState = Block.getBlock('minecraft:amethyst_block').defaultBlockState()
            let flowingBlockState = Block.getBlock('minecraft:calcite').defaultBlockState()
            let newState = currentState.source ? sourceBlockState : flowingBlockState

            level.setBlockAndUpdate(currentPos, newState)
            level.levelEvent(1501, currentPos, 0)
        }
    )

})