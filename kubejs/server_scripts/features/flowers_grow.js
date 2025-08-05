/**
 * 用骨粉右击任意种类的花时，在5x5范围内随机生成3-5朵对应种类的花。
 * 也就是基岩版的花增殖方式。
 */
BlockEvents.rightClicked(event => {
    let {block, item, player, server, level} = event;
    if (item.id != "minecraft:bone_meal" || !block.hasTag("minecraft:flowers")) return;
    
    // 获取原始坐标
    const {x, y, z, id: flowerID} = block;

    // 决定生成数量
    const count = 3 + Math.floor(Math.random() * 3);
    let successCount = 0;

    // 获取可用的生成位置并随机抽取
    let positions = findAvailableFlowerPositions(level, x, y, z);

    for (let i = 0; i < count; i++) {
        let index = Math.floor(Math.random() * positions.length);
        let [tx, ty, tz] = positions[index];
        const flowerBlockState = Block.getBlock(flowerID).defaultBlockState();

        if (level.setBlockAndUpdate(new BlockPos(tx, ty, tz), flowerBlockState)) {
            // 粒子效果
            server.runCommandSilent(
                `particle minecraft:happy_villager ${tx + 0.5} ${ty + 0.5} ${tz + 0.5} 0.5 0.5 0.5 0.1 15`
            );
            successCount++;
        }
    }

    // player.tell("successCount: " + successCount);
    // 如果成功生成了至少一朵花
    if (successCount > 0) {
        // 如果玩家不是创造模式，则消耗一个骨粉
        if (!player.isCreative()) {
            item.shrink(1);
        }
        // 播放手臂挥动的动画
        player.swing();
    }
})

/**
 * 在以(x, y, z)为中心的5x5范围内，查找所有可生成花的位置
 */
function findAvailableFlowerPositions(level, x, y, z) {
    let positions = [];
    for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
            let tx = x + dx, tz = z + dz, ty = y;
            let blockBelow = level.getBlock(tx, ty - 1, tz);
            let targetBlock = level.getBlock(tx, ty, tz);
            if (blockBelow.id === "minecraft:grass_block" && targetBlock.id === "minecraft:air") {
                positions.push([tx, ty, tz]);
            }
        }
    }
    return positions;
}
