/**
 * @description 修改幽匿尖啸体(Sculk Shrieker)的行为
 * 1. 自然生成的幽匿尖啸体被破坏时不掉落任何物品。
 * 2. 玩家放置的幽匿尖啸体将能够召唤监守者。
 */
ServerEvents.blockLootTables(event => {
    event.addBlock('minecraft:sculk_shrieker', loot => {
        loot.addPool(pool => {})
    })
})

BlockEvents.placed('minecraft:sculk_shrieker', event => {
  // 当玩家放置幽匿尖啸体时
  // 默认情况下，玩家放置的方块 'can_summon' 属性为 false
  // 将其替换为一个可以召唤监守者的版本
  event.block.set('minecraft:sculk_shrieker', { can_summon: 'true' });
})