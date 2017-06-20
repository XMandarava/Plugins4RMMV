//============================================
// MND_Rename.js
//============================================
/*:
 * @plugindesc Rename actor.(v1.0)
 * @author Mandarava
 *
 * @param Show on menu screen
 * @type Number
 * @desc Whether to display [Rename] command on the menu screen. 0: false, 1: true.
 * Default 1.
 * @default 1
 *
 * @param Name of Rename Command
 * @desc The name of the Rename Command.
 * Default Rename
 * @default Rename
 *
 * @param Item Id to Bind
 * @type Number
 * @desc The item id you want to give the renaming ability to. 0 for disable.
 * Default 0
 * @default 0
 *
 * @param Max Length of Name
 * @type Number
 * @desc The max length of the name.
 * Default 10
 * @default 10
 *
 * @help
 * Features:
 * 1. Show a [Rename] command on the menu screen.
 * 2. Bind an item, give it the ability to rename actor.
 */

/*:zh
 * @plugindesc 角色改名工具。(v1.0)
 * @author Mandarava（鳗驼螺）
 *
 * @param Show on menu screen
 * @type Number
 * @desc 是否在菜单界面添加[改名]菜单。0: 不添加, 1: 添加。
 * 默认：1.
 * @default 1
 *
 * @param Name of Rename Command
 * @desc [改名]菜单的名称。
 * 默认：改名
 * @default 改名
 *
 * @param Item Id to Bind
 * @type item
 * @desc 要成为改名道具的物品Id，0表示不启用该功能。
 * 默认：0
 * @default 0
 *
 * @param Max Length of Name
 * @type Number
 * @desc 名字的长度。
 * 默认：10
 * @default 10
 *
 * @help
 * 本工具的作用：
 * 1. 在菜单界面显示[改名]菜单。
 * 2. 绑定一个物品ID，使该物品具有给角色改名的功能。
 */

(function ($) {

    var params=PluginManager.parameters("MND_Rename");
    var isShowOnMenuScreen=Boolean(params["Show on menu screen"] || 1);
    var nameOfRenameCmd=params["Name of Rename Command"] || "Rename";
    var itemIdToBind=Number(params["Item Id to Bind"] || 0);
    var maxNameLength=Number(params["Max Length of Name"] || 10);

    //Bind an item, give it the ability to rename actor.

    if(itemIdToBind > 0) {
        var _Scene_ItemBase_useItem = Scene_ItemBase.prototype.useItem;
        Scene_ItemBase.prototype.useItem = function () {
            _Scene_ItemBase_useItem.call(this);

            if (this.item().id == itemIdToBind && !$gameParty.inBattle()) {
                var actorId = $gameParty.members()[this._actorWindow._index]._actorId;
                SceneManager.push(Scene_Name);
                SceneManager.prepareNextScene(actorId, maxNameLength);
            }
        }

        var _Scene_ItemBase_canUse = Scene_ItemBase.prototype.canUse;
        Scene_ItemBase.prototype.canUse = function () {
            if (this.item().id == itemIdToBind) return this.user().canUse(this.item());
            else return _Scene_ItemBase_canUse.call(this);
        };
    }

    //Show a [Rename] command on the menu screen.

    if(isShowOnMenuScreen) {
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            this.addCommand(nameOfRenameCmd, "rename", true);
        };

        var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            _Scene_Menu_createCommandWindow.call(this);

            if (isShowOnMenuScreen) this._commandWindow.setHandler('rename', this.commandRename.bind(this));
        };

        Scene_Menu.prototype.commandRename = function () {
            this._statusWindow.setFormationMode(false);
            this._statusWindow.selectLast();
            this._statusWindow.activate();
            this._statusWindow.setHandler('ok', this.rename_ok.bind(this));
            this._statusWindow.setHandler('cancel', this.rename_cancel.bind(this));
        };
        Scene_Menu.prototype.rename_ok = function () {
            SceneManager.push(Scene_Name);
            SceneManager.prepareNextScene($gameParty.menuActor().actorId(), maxNameLength);
        };
        Scene_Menu.prototype.rename_cancel = function () {
            this._statusWindow.deselect();
            this._commandWindow.activate();
        };

        Window_MenuStatus.prototype.processOk = function () {
            $gameParty.setMenuActor($gameParty.members()[this.index()]);
            Window_Selectable.prototype.processOk.call(this);
        };
    };

})();