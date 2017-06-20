//============================================
// MND_MenuBackground.js
//============================================

/*:
 * @plugindesc 设置各个菜单界面的背景图片，支持动态滚动。(v1.0)
 * @author Mandarava（鳗驼螺）
 *
 * ===============Menu Background===============
 * @param Menu Background
 * @desc 主菜单背景
 * @type file
 * @dir img/parallaxes
 *
 * @param Horizontal Scroll Speed of Menu Background
 * @parent Menu Background
 * @text Horizontal Scroll Speed
 * @desc 主菜单背景水平滚动速度，范围-20~20；负数：向左滚动，正数：向右滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * @param Vertical Scroll Speed of Menu Background
 * @parent Menu Background
 * @text Vertical Scroll Speed
 * @desc 主菜单背景垂直滚动速度，范围-20~20；负数：向上滚动，正数：向下滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * ===============Item Background===============
 * @param Item Background
 * @desc 物品菜单背景
 * @type file
 * @dir img/parallaxes
 *
 * @param Horizontal Scroll Speed of Item Background
 * @parent Item Background
 * @text Horizontal Scroll Speed
 * @desc 物品菜单背景水平滚动速度，范围-20~20；负数：向左滚动，正数：向右滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * @param Vertical Scroll Speed of Item Background
 * @parent Item Background
 * @text Vertical Scroll Speed
 * @desc 物品菜单背景垂直滚动速度，范围-20~20；负数：向上滚动，正数：向下滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * ===============Skill Background===============
 * @param Skill Background
 * @desc 技能菜单背景
 * @type file
 * @dir img/parallaxes
 *
 * @param Horizontal Scroll Speed of Skill Background
 * @parent Skill Background
 * @text Horizontal Scroll Speed
 * @desc 物品菜单背景水平滚动速度，范围-20~20；负数：向左滚动，正数：向右滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * @param Vertical Scroll Speed of Skill Background
 * @parent Skill Background
 * @text Vertical Scroll Speed
 * @desc 物品菜单背景垂直滚动速度，范围-20~20；负数：向上滚动，正数：向下滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * ===============Equip Background===============
 * @param Equip Background
 * @desc 装备菜单背景
 * @type file
 * @dir img/parallaxes
 *
 * @param Horizontal Scroll Speed of Equip Background
 * @parent Equip Background
 * @text Horizontal Scroll Speed
 * @desc 装备菜单背景水平滚动速度，范围-20~20；负数：向左滚动，正数：向右滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * @param Vertical Scroll Speed of Equip Background
 * @parent Equip Background
 * @text Vertical Scroll Speed
 * @desc 装备菜单背景垂直滚动速度，范围-20~20；负数：向上滚动，正数：向下滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * ===============Status Background===============
 * @param Status Background
 * @desc 状态菜单背景
 * @type file
 * @dir img/parallaxes
 *
 * @param Horizontal Scroll Speed of Status Background
 * @parent Status Background
 * @text Horizontal Scroll Speed
 * @desc 状态菜单背景水平滚动速度，范围-20~20；负数：向左滚动，正数：向右滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * @param Vertical Scroll Speed of Status Background
 * @parent Status Background
 * @text Vertical Scroll Speed
 * @desc 状态菜单背景垂直滚动速度，范围-20~20；负数：向上滚动，正数：向下滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * ===============Options Background===============
 * @param Options Background
 * @desc 选项菜单背景
 * @type file
 * @dir img/parallaxes
 *
 * @param Horizontal Scroll Speed of Options Background
 * @parent Options Background
 * @text Horizontal Scroll Speed
 * @desc 选项菜单背景水平滚动速度，范围-20~20；负数：向左滚动，正数：向右滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * @param Vertical Scroll Speed of Options Background
 * @parent Options Background
 * @text Vertical Scroll Speed
 * @desc 选项菜单背景垂直滚动速度，范围-20~20；负数：向上滚动，正数：向下滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * ===============Save & Load Background===============
 * @param Save & Load Background
 * @desc 保存/加载菜单背景
 * @type file
 * @dir img/parallaxes
 *
 * @param Horizontal Scroll Speed of Save & Load Background
 * @parent Save & Load Background
 * @text Horizontal Scroll Speed
 * @desc 保存/加载菜单背景水平滚动速度，范围-20~20；负数：向左滚动，正数：向右滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * @param Vertical Scroll Speed of Save & Load Background
 * @parent Save & Load Background
 * @text Vertical Scroll Speed
 * @desc 保存/加载菜单背景垂直滚动速度，范围-20~20；负数：向上滚动，正数：向下滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * ===============Shop Background===============
 * @param Shop Background
 * @desc 商店菜单背景
 * @type file
 * @dir img/parallaxes
 *
 * @param Horizontal Scroll Speed of Shop Background
 * @parent Shop Background
 * @text Horizontal Scroll Speed
 * @desc 商店菜单背景水平滚动速度，范围-20~20；负数：向左滚动，正数：向右滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * @param Vertical Scroll Speed of Shop Background
 * @parent Shop Background
 * @text Vertical Scroll Speed
 * @desc 商店菜单背景垂直滚动速度，范围-20~20；负数：向上滚动，正数：向下滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * ===============GameEnd Background===============
 * @param GameEnd Background
 * @desc 结束游戏菜单背景
 * @type file
 * @dir img/parallaxes
 *
 * @param Horizontal Scroll Speed of GameEnd Background
 * @parent GameEnd Background
 * @text Horizontal Scroll Speed
 * @desc 结束游戏菜单背景水平滚动速度，范围-20~20；负数：向左滚动，正数：向右滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * @param Vertical Scroll Speed of GameEnd Background
 * @parent GameEnd Background
 * @text Vertical Scroll Speed
 * @desc 结束游戏菜单背景垂直滚动速度，范围-20~20；负数：向上滚动，正数：向下滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * ===============Name Background===============
 * @param Name Background
 * @desc 改名菜单背景
 * @type file
 * @dir img/parallaxes
 *
 * @param Horizontal Scroll Speed of Name Background
 * @parent Name Background
 * @text Horizontal Scroll Speed
 * @desc 改名菜单背景水平滚动速度，范围-20~20；负数：向左滚动，正数：向右滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * @param Vertical Scroll Speed of Name Background
 * @parent Name Background
 * @text Vertical Scroll Speed
 * @desc 改名菜单背景垂直滚动速度，范围-20~20；负数：向上滚动，正数：向下滚动，0：禁止滚动。
 * @type number
 * @min -20
 * @max 20
 * @default 0
 *
 * ===============Debug Background===============
 * 忽略...
 */

(function ($) {

    var Mandarava = Mandarava || {};
    Mandarava.MenuBackground = Mandarava.MenuBackground || {};
    Mandarava.MenuBackground.Parameters = PluginManager.parameters("MND_MenuBackground");

    Mandarava.MenuBackground.Menu = Mandarava.MenuBackground.Menu || {};
    Mandarava.MenuBackground.Menu.Image = Mandarava.MenuBackground.Parameters["Menu Background"];
    Mandarava.MenuBackground.Menu.HorzSpeed = Number(Mandarava.MenuBackground.Parameters["Horizontal Scroll Speed of Menu Background"]) || 0;
    Mandarava.MenuBackground.Menu.VertSpeed = Number(Mandarava.MenuBackground.Parameters["Vertical Scroll Speed of Menu Background"]) || 0;

    Mandarava.MenuBackground.Item = Mandarava.MenuBackground.Item || {};
    Mandarava.MenuBackground.Item.Image = Mandarava.MenuBackground.Parameters["Item Background"];
    Mandarava.MenuBackground.Item.HorzSpeed = Number(Mandarava.MenuBackground.Parameters["Horizontal Scroll Speed of Item Background"]) || 0;
    Mandarava.MenuBackground.Item.VertSpeed = Number(Mandarava.MenuBackground.Parameters["Vertical Scroll Speed of Item Background"]) || 0;

    Mandarava.MenuBackground.Skill = Mandarava.MenuBackground.Skill || {};
    Mandarava.MenuBackground.Skill.Image = Mandarava.MenuBackground.Parameters["Skill Background"];
    Mandarava.MenuBackground.Skill.HorzSpeed = Number(Mandarava.MenuBackground.Parameters["Horizontal Scroll Speed of Skill Background"]) || 0;
    Mandarava.MenuBackground.Skill.VertSpeed = Number(Mandarava.MenuBackground.Parameters["Vertical Scroll Speed of Skill Background"]) || 0;

    Mandarava.MenuBackground.Equip = Mandarava.MenuBackground.Equip || {};
    Mandarava.MenuBackground.Equip.Image = Mandarava.MenuBackground.Parameters["Equip Background"];
    Mandarava.MenuBackground.Equip.HorzSpeed = Number(Mandarava.MenuBackground.Parameters["Horizontal Scroll Speed of Equip Background"]) || 0;
    Mandarava.MenuBackground.Equip.VertSpeed = Number(Mandarava.MenuBackground.Parameters["Vertical Scroll Speed of Equip Background"]) || 0;

    Mandarava.MenuBackground.Status = Mandarava.MenuBackground.Status || {};
    Mandarava.MenuBackground.Status.Image = Mandarava.MenuBackground.Parameters["Status Background"];
    Mandarava.MenuBackground.Status.HorzSpeed = Number(Mandarava.MenuBackground.Parameters["Horizontal Scroll Speed of Status Background"]) || 0;
    Mandarava.MenuBackground.Status.VertSpeed = Number(Mandarava.MenuBackground.Parameters["Vertical Scroll Speed of Status Background"]) || 0;

    Mandarava.MenuBackground.Options = Mandarava.MenuBackground.Options || {};
    Mandarava.MenuBackground.Options.Image = Mandarava.MenuBackground.Parameters["Options Background"];
    Mandarava.MenuBackground.Options.HorzSpeed = Number(Mandarava.MenuBackground.Parameters["Horizontal Scroll Speed of Options Background"]) || 0;
    Mandarava.MenuBackground.Options.VertSpeed = Number(Mandarava.MenuBackground.Parameters["Vertical Scroll Speed of Options Background"]) || 0;

    Mandarava.MenuBackground.SaveLoad = Mandarava.MenuBackground.SaveLoad || {};
    Mandarava.MenuBackground.SaveLoad.Image = Mandarava.MenuBackground.Parameters["Save & Load Background"];
    Mandarava.MenuBackground.SaveLoad.HorzSpeed = Number(Mandarava.MenuBackground.Parameters["Horizontal Scroll Speed of Save & Load Background"]) || 0;
    Mandarava.MenuBackground.SaveLoad.VertSpeed = Number(Mandarava.MenuBackground.Parameters["Vertical Scroll Speed of Save & Load Background"]) || 0;

    Mandarava.MenuBackground.Shop = Mandarava.MenuBackground.Shop || {};
    Mandarava.MenuBackground.Shop.Image = Mandarava.MenuBackground.Parameters["Shop Background"];
    Mandarava.MenuBackground.Shop.HorzSpeed = Number(Mandarava.MenuBackground.Parameters["Horizontal Scroll Speed of Shop Background"]) || 0;
    Mandarava.MenuBackground.Shop.VertSpeed = Number(Mandarava.MenuBackground.Parameters["Vertical Scroll Speed of Shop Background"]) || 0;

    Mandarava.MenuBackground.GameEnd = Mandarava.MenuBackground.GameEnd || {};
    Mandarava.MenuBackground.GameEnd.Image = Mandarava.MenuBackground.Parameters["GameEnd Background"];
    Mandarava.MenuBackground.GameEnd.HorzSpeed = Number(Mandarava.MenuBackground.Parameters["Horizontal Scroll Speed of GameEnd Background"]) || 0;
    Mandarava.MenuBackground.GameEnd.VertSpeed = Number(Mandarava.MenuBackground.Parameters["Vertical Scroll Speed of GameEnd Background"]) || 0;

    Mandarava.MenuBackground.Name = Mandarava.MenuBackground.Name || {};
    Mandarava.MenuBackground.Name.Image = Mandarava.MenuBackground.Parameters["Name Background"];
    Mandarava.MenuBackground.Name.HorzSpeed = Number(Mandarava.MenuBackground.Parameters["Horizontal Scroll Speed of Name Background"]) || 0;
    Mandarava.MenuBackground.Name.VertSpeed = Number(Mandarava.MenuBackground.Parameters["Vertical Scroll Speed of Name Background"]) || 0;

    var _Scene_MenuBase_createBackground = Scene_MenuBase.prototype.createBackground;
    Scene_MenuBase.prototype.createBackground = function() {
        var imageName="";
        if(this instanceof Scene_Menu){
            if(Mandarava.MenuBackground.Menu.Image){
                imageName=Mandarava.MenuBackground.Menu.Image;
                this._scrollSpeed=new Point(
                    Mandarava.MenuBackground.Menu.HorzSpeed,
                    Mandarava.MenuBackground.Menu.VertSpeed
                );
            }
        }else if(this instanceof Scene_Item){
            if(Mandarava.MenuBackground.Item.Image){
                imageName=Mandarava.MenuBackground.Item.Image;
                this._scrollSpeed=new Point(
                    Mandarava.MenuBackground.Item.HorzSpeed,
                    Mandarava.MenuBackground.Item.VertSpeed
                );
            }
        }else if(this instanceof Scene_Skill){
            if(Mandarava.MenuBackground.Skill.Image){
                imageName=Mandarava.MenuBackground.Skill.Image;
                this._scrollSpeed=new Point(
                    Mandarava.MenuBackground.Skill.HorzSpeed,
                    Mandarava.MenuBackground.Skill.VertSpeed
                );
            }
        }else if(this instanceof Scene_Equip){
            if(Mandarava.MenuBackground.Equip.Image){
                imageName=Mandarava.MenuBackground.Equip.Image;
                this._scrollSpeed=new Point(
                    Mandarava.MenuBackground.Equip.HorzSpeed,
                    Mandarava.MenuBackground.Equip.VertSpeed
                );
            }
        }else if(this instanceof Scene_Status) {
            if (Mandarava.MenuBackground.Status.Image) {
                imageName = Mandarava.MenuBackground.Status.Image;
                this._scrollSpeed = new Point(
                    Mandarava.MenuBackground.Status.HorzSpeed,
                    Mandarava.MenuBackground.Status.VertSpeed
                );
            }
        }else if(this instanceof Scene_Options){
            if(Mandarava.MenuBackground.Options.Image){
                imageName=Mandarava.MenuBackground.Options.Image;
                this._scrollSpeed=new Point(
                    Mandarava.MenuBackground.Options.HorzSpeed,
                    Mandarava.MenuBackground.Options.VertSpeed
                );
            }
        }else if(this instanceof Scene_Save || this instanceof Scene_Load){
            if(Mandarava.MenuBackground.SaveLoad.Image){
                imageName=Mandarava.MenuBackground.SaveLoad.Image;
                this._scrollSpeed=new Point(
                    Mandarava.MenuBackground.SaveLoad.HorzSpeed,
                    Mandarava.MenuBackground.SaveLoad.VertSpeed
                );
            }
        }else if(this instanceof Scene_Shop){
            if(Mandarava.MenuBackground.Shop.Image){
                imageName=Mandarava.MenuBackground.Shop.Image;
                this._scrollSpeed=new Point(
                    Mandarava.MenuBackground.Shop.HorzSpeed,
                    Mandarava.MenuBackground.Shop.VertSpeed
                );
            }
        }else if(this instanceof Scene_GameEnd){
            if(Mandarava.MenuBackground.GameEnd.Image){
                imageName=Mandarava.MenuBackground.GameEnd.Image;
                this._scrollSpeed=new Point(
                    Mandarava.MenuBackground.GameEnd.HorzSpeed,
                    Mandarava.MenuBackground.GameEnd.VertSpeed
                );
            }
        }else if(this instanceof Scene_Name){
            if(Mandarava.MenuBackground.Name.Image){
                imageName=Mandarava.MenuBackground.Name.Image;
                this._scrollSpeed=new Point(
                    Mandarava.MenuBackground.Name.HorzSpeed,
                    Mandarava.MenuBackground.Name.VertSpeed
                );
            }
        }

        if(imageName){
            this._backgroundSprite=new TilingSprite();
            this._backgroundSprite.bitmap = ImageManager.loadParallax(imageName);
            this._backgroundSprite.move(0, 0, Graphics.width, Graphics.height);
            this.addChild(this._backgroundSprite);
        }else{
            _Scene_MenuBase_createBackground.call(this);
        }
    };

    var _Scene_MenuBase_update = Scene_MenuBase.prototype.update;
    Scene_MenuBase.prototype.update = function () {
        _Scene_MenuBase_update.call(this);

        if(this._scrollSpeed) {
            this._backgroundSprite.origin.x -= this._scrollSpeed.x;
            this._backgroundSprite.origin.y -= this._scrollSpeed.y;
        }
    }

})();