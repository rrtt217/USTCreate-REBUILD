let MysteriousItemConversionCategory = Java.loadClass('com.simibubi.create.compat.jei.category.MysteriousItemConversionCategory')
let ConversionRecipe = Java.loadClass('com.simibubi.create.compat.jei.ConversionRecipe')

// miaoning 的头
MysteriousItemConversionCategory.RECIPES.add(ConversionRecipe.create(
    Item.of("ustcreate:amethyst_dust"),
    Item.of('minecraft:player_head', '{SkullOwner:{Id:[I;0,12296,-1717938574,-567960658],Name:"miaoning",Properties:{CustomSkinLoaderInfo:[{Value:"http://textures.minecraft.net/texture/518f25803ae2435e0efdd7f59797ffd4225049c6686c43df70202501425596b7"},{Value:"default"},{Value:"null"},{Value:"null"}],textures:[{Value:"ewogICJ0aW1lc3RhbXAiIDogMTc1MTk1MjA2OTk3OCwKICAicHJvZmlsZUlkIiA6ICJkMjgxMWI0ZjMxZDI0NDhiOWY2Y2NlZGNkNzE1NjMwYyIsCiAgInByb2ZpbGVOYW1lIiA6ICJtaWFvbmluZyIsCiAgInRleHR1cmVzIiA6IHsKICAgICJTS0lOIiA6IHsKICAgICAgInVybCIgOiAiaHR0cDovL3RleHR1cmVzLm1pbmVjcmFmdC5uZXQvdGV4dHVyZS81MThmMjU4MDNhZTI0MzVlMGVmZGQ3ZjU5Nzk3ZmZkNDIyNTA0OWM2Njg2YzQzZGY3MDIwMjUwMTQyNTU5NmI3IgogICAgfQogIH0KfQ=="}]}}}')
))

