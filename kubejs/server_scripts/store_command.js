ServerEvents.commandRegistry(e => {
    const { arguments: arg, commands: cmd } = e;
    e.register(
        cmd.literal("serverstore")
            .requires(source => source.hasPermission(2))
            .then(
                cmd.argument("action", arg.STRING.create(e))
                    .suggests((_, builder) => {
                        builder.suggest("refresh");
                        builder.suggest("restock");
                        return builder.buildFuture();
                    })
                    .executes(c => {
                        const action = arg.STRING.getResult(c, "action");

                        const player = c.source.player;
                        if (!player) {
                            c.source.sendFailure(Component.literal("此命令只能由玩家执行"));
                            return 0;
                        }

                        const hitResult = player.pick(5.0, 0.0, false);
                        if (hitResult.type !== "BLOCK") {
                            c.source.sendFailure(Component.literal("请看向一个方块"));
                            return 0;
                        }

                        const targetPos = hitResult.blockPos;
                        const blockEntity = player.level.getBlockEntity(targetPos);

                        if (!blockEntity || blockEntity.class.name !== "space.miaoning.create_freight.content.serverstore.ServerStoreBlockEntity") {
                            c.source.sendFailure(Component.literal("目标不是服务器商店方块"));
                            return 0;
                        }

                        try {
                            switch (action.toLowerCase()) {
                                case "refresh":
                                    blockEntity.refreshRecipes();
                                    c.source.sendSuccess(Component.literal("已刷新服务器商店的交易配方"), true);
                                    return 1;

                                case "restock":
                                    blockEntity.updateVirtualInventory();
                                    c.source.sendSuccess(Component.literal("已重新补货服务器商店"), true);
                                    return 1;

                                default:
                                    c.source.sendFailure(Component.literal("无效的操作，请使用 refresh 或 restock"));
                                    return 0;
                            }
                        } catch (error) {
                            c.source.sendFailure(Component.literal("执行操作时发生错误: " + error.message));
                            return 0;
                        }
                    })
            )
    );
});
