StartupEvents.registry('item', event => {
    event.create("ustcreate:burnt_iron", "basic").tooltip("熔炉的温度太低了，铁矿石没有完全熔化。");  //未完全熔化的铁
    event.create("ustcreate:burnt_copper", "basic").tooltip("虽然铜的熔点较低，但熔炉的温度显然是更低的。");  //未完全熔化的铜
    event.create("ustcreate:burnt_gold", "basic").tooltip("熔炉的温度太低了，金矿石没有完全熔化");  //未完全熔化的金
    event.create("ustcreate:sulfur", "basic");  //硫磺
    event.create("ustcreate:amethyst_dust", "basic");  //紫水晶粉
})