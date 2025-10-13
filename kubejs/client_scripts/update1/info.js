//10月更新，添加所必需的指南信息
const ids = ['dragnvehicles:car',
    'dragnvehicles:classic',
    'dragnvehicles:motorcycle',
    'dragnvehicles:sport_car',
    'dragnvehicles:suv',
    'dragnvehicles:truck'
]
ids.forEach(id => {
  JEIEvents.information(event => {
    event.addItem(id, ['右键车辆以坐上，按I键（与显示物品栏hud冲突，可重绑定）打开车辆物品栏界面。在物品栏的第一、二行第一列分别放入装有岩浆的油罐（Canister），含有电的电池（Battery），然后长按R以启动车辆。', '高速撞击方块时车辆会损坏并熄火，你可以在第三行第一列放入铁锭或者钢锭来修复车辆。', '不同车辆的行驶速度不同，摩托车的速度是最快的。此外，在平滑石头上行驶时速度会增加25%，在黑色或白色混凝土上会增加50%。'])
  })
})
JEIEvents.information(event => {
  event.addItem('refueled:canister', ['右键岩浆（被瞄准的岩浆方块背后必须是非液体方块）或其他容器以装入，最多装两桶。'])
})
