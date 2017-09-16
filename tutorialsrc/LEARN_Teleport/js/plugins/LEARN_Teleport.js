//==============================
// LEARN_Teleport.js
// Copyright (c) 2017 Mandarava
//==============================

/*:
 * @plugindesc 用于制作传送道具和传送技能。(v1.0)
 * @author Mandarava（鳗驼螺）
 * @version 1.0
 *
 * @param Teleport Start AnimationId
 * @text 传送开始动画
 * @desc 传送开始时要显示的动画
 * @type animation
 * @default 117
 *
 * @param Teleport End AnimationId
 * @text 传送完成动画
 * @desc 传送完成时要显示的动画
 * @type animation
 * @default 120
 *
 * @help
 * 本插件用于将物品、技能设置为传送道具或传送技能。物品支持可消耗物品或不可消耗
 * 物品，技能使用可消耗魔法。物品或技能添加传送功能后，其其它效果将被忽略，技能
 * 本身的动画也会被忽略。
 *
 * 使用方法：
 *
 * 一. 将物品、技能设置为传送道具或传送技能
 * 在需要添加传送功能的物品或技能备注中添加代码：<teleport>
 *
 * 二. 通过地图备注登记传送点（非必要）
 * 你可以直接在地图的 地图属性－备注　中添加特定代码来登记该地图中的传送点信息，
 * 但是注意，这些登记的传送点只有当主角进入该地图时才会被自动激活，换句话说，如
 * 果主角没有进入过该地图，那么这些传送点不会显示在传送点列表中。
 * PS：这个操作不是必要的，你也可以使用插件命令来手动登记传送点。
 *
 * 1. 传送点登记格式：<teleport: x y [enabled] [visible] [name][;...]>
 *     x        : 传送点在地图中的X坐标
 *     y        : 传送点在地图中的Y坐标
 *     enabled  : 可选，是否启用传送点，默认启用；可选值：1表示启用，0表示不启用。
 *     visible  : 可选，是否在传送点列表中显示该传送点，默认显示；可选值：1表示启用，0表示不启用。
 *     name     : 可选，传送点名称，如果不提供，默认使用地图的显示名称或地图名称。
 *     [;...]   : 可选，表示其它传送点信息。当一个地图有多个传送点时，多个传送点信息之间用;号隔开。
 *
 * 2. 传送点登记格式示例：
 *      <teleport: 8 10>     //传送点坐标为(8,10)；启用并显示传送点；传送点名称使用地图名称。
 *      <teleport: 8 10 0 1> //传送点坐标为(8,10)；禁用但显示传送点；传送点名称使用地图名称。
 *      <teleport: 8 10 1 1 新起点> //传送点坐标为(8,10)；启用并显示传送点；传送点名称为“新起点”
 *      <teleport: 8 10 1 1 新起点; 12 13 1 1 垃圾堆> //二个传送点：一个坐标在(8,10)，名称为“新起点”，另一个坐标在(12,13)，名称为“垃圾堆”。
 *
 * 三、通过地图备注禁止当前地图使用传送功能（非必要）
 * 如果某些地图不允许使用传送功能（如特定的山洞），你可以在地图的 地图属性－备注
 * 中添加特定代码来注明该地图禁止使用传送道具或传送技能。
 * PS：这个操作不是必要的，你也可以使用插件命令来手动禁止。
 *
 * 登记格式：<!teleport>
 *
 * 四、插件命令
 *
 * 1. 登记传送点
 * 如果已经登记过，则会修改传送点的启用性(enabled）和可见性（visible），所以不论是登记还是修改传送点信息都可以只用该方法来操作。
 * 命令格式：registerTeleportPlace mapid x y [enabled] [visible] [name]
 *      mapid   : 地图的ID
 *      x       : 传送点在地图的X坐标
 *      y       : 传送点在地图的Y坐标
 *      enalbed : 可选，是否启用传送点，默认启用；可选值：1表示启用，0表示不启用。
 *      visible : 可选，是否在传送点列表中显示该传送点，默认显示；可选值：1表示启用，0表示不启用。
 *      name    : 可选，传送点名称，如果不提供，默认使用地图名称。
 *
 * 2. 删除传送点
 * 命令格式：removeTeleportPlace mapid x y
 *      mapid   : 地图的ID
 *      x       : 传送点在地图的X坐标
 *      y       : 传送点在地图的Y坐标
 *
 * 3. 设置传送点的启用、显示状态
 * 如果传送点未登记，则操作会忽略；建议使用mndAddTeleportPlace命令来修改。
 * 命令格式：setTeleportPlaceEnabled mapid x y enabled visible
 *      mapid   : 地图的ID
 *      x       : 传送点在地图的X坐标
 *      y       : 传送点在地图的Y坐标
 *      enalbed : 是否启用传送点，可选值：1表示启用，0表示不启用。
 *      visible : 是否在传送点列表中显示该传送点，可选值：1表示启用，0表示不启用。
 *
 * 4. 设置当前地图允许或禁止使用传送道具或传送技能
 * 命令格式：setMapTeleportEnabled enabled
 *      enabled : 是否启用传送功能
 */

(function(){

    //=====Plugin Command=====

    var params = PluginManager.parameters("LEARN_Teleport");
    var startAnimId = Number(params["Teleport Start AnimationId"]) || 117;
    var endAnimId = Number(params["Teleport End AnimationId"]) || 120;

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        switch (command) {
            case "registerTeleportPlace"://插件命令格式：registerTeleportPlace mapid x y [enabled] [visible] [name]
                var mapid = Number(args[0]);
                var enabled = args[3] == undefined ? true : Boolean(Number(args[3]));
                var visible = args[4] == undefined ? true : Boolean(Number(args[4]));
                var name = args[5] || $dataMapInfos[mapid].name;
                $gameMap.mndRegisterTeleportPlace(mapid, Number(args[1]), Number(args[2]), enabled, visible, name);
                break;
            case "removeTeleportPlace"://插件命令格式：removeTeleportPlace mapid x y
                $gameMap.mndRemoveTelleportPlace(Number(args[0]), Number(args[1]), Number(args[2]));
                break;
            case "setTeleportPlaceEnabled"://插件命令格式：setTeleportPlaceEnabled mapid x y enabled visible
                $gameMap.mndSetTeleportPlaceEnabled(Number(args[0]), Number(args[1]), Number(args[2]), Boolean(Number(args[3])), Boolean(Number(args[4])));
                break;
            case "setMapTeleportEnabled"://插件命令格式：setMapTeleportEnabled enabled
                $gameMap.mndSetMapTeleportEnabled($gameMap.mapId(), Boolean(Number(args[0])));
            default:
                break;
        }
    }

    //=====Game_BattlerBase=====

    //所有备注中含有"<teleport>"的物品、技能在禁止传送的地图或在战斗中都不能使用
    var _Game_BattlerBase_meetsUsableItemConditions=Game_BattlerBase.prototype.meetsUsableItemConditions;
    Game_BattlerBase.prototype.meetsUsableItemConditions = function(item) {
        if((!$gameMap.mndIsMapTeleportEnabled($gameMap.mapId()) || $gameParty.inBattle()) && item.note.contains("<teleport>")) return false;
        else return _Game_BattlerBase_meetsUsableItemConditions.call(this, item);
    };

    //===Game_Player===

    //在传送到了新地点后，添加一个传送完成的动画，用_isTeleporting来区分是否由传送器造成的传送效果，只有是的情况下才会允许展示该动画
    Game_Player.prototype.performTransfer = function () {
        if (this.isTransferring()) {
            this.setDirection(this._newDirection);
            if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
                $gameMap.setup(this._newMapId);
                this._needsMapReload = false;
            }
            this.locate(this._newX, this._newY);

            if (_isTeleporting) {
                $gamePlayer._animationId = endAnimId;
                _isTeleporting = false;
            }

            this.refresh();
            this.clearTransferInfo();
        }
    };

    //===Scene_ItemBase===

    var _Scene_ItemBase_start = Scene_ItemBase.prototype.start;
    Scene_ItemBase.prototype.start = function () {
        _Scene_ItemBase_start.call(this);
        //创建传送点选择窗口
        this.mnd_winTeleport = new Window_Teleport();
        this.mnd_winTeleport.hide();
        this.mnd_winTeleport.setHandler('teleport', this.onTeleport.bind(this));//向传送点选择窗口注册传送点命令点击事件
        this.mnd_winTeleport.setHandler('cancel', this.onTeleportCancelled.bind(this));//取消选择传送点时的操作
        this.addWindow(this.mnd_winTeleport);
    };

    var _Scene_ItemBase_determineItem = Scene_ItemBase.prototype.determineItem;
    //当玩家使用某项物品或技能时，如果它们的备注中含有"<teleport>"表示它是一个传送物品或技能，则显示传送点选择窗口，以供选择传送点，除此之外仍然使用原方法处理
    Scene_ItemBase.prototype.determineItem = function () {
        var item = this.item();
        if (item.note.contains("<teleport>")) {
            this.showSubWindow(this.mnd_winTeleport);
        } else {
            _Scene_ItemBase_determineItem.call(this);
        }
    };

    /**
     * 对玩家队伍进行传送。在传送点列表选择窗口，玩家点击具体的传送点开始传送时的操作
     */
    Scene_ItemBase.prototype.onTeleport = function () {
        //如果施用传送功能的物品是可消耗的，则进行消耗处理；如果是传送魔法，则消耗MP值
        var item=this.item();//玩家选中的物品或技能（也就是被设置成传送道具或传送技能的物品或技能）
        if (DataManager.isItem(item) && item.consumable) {//检查是不是使用的可消耗的传送物品
            SoundManager.playUseItem();     //播放物品使用音效
            $gameParty.loseItem(item, 1);   //物品被消耗
        }else if(DataManager.isSkill(item)){//检查是不是使用的传送魔法
            SoundManager.playUseSkill();    //播放魔法使用音效
            this.user().paySkillCost(item); //消耗MP
        }

        this.hideSubWindow(this.mnd_winTeleport);//隐藏传送点选择窗口
        SceneManager.goto(Scene_Map);//退回到游戏地图场景
        var index = this.mnd_winTeleport.currentExt(); //扩展数据中保存的是传送点在$gameMap.mnd_teleportPlaces中的索引
        var teleportPlace = $gameMap._mndTeleportPlaces[index];//获取玩家选择的传送点（目的地）信息
        $gamePlayer.gatherFollowers(); //集合队伍
        $gamePlayer._animationId = startAnimId; //显示传送动画
        //在等待1500毫秒后开始传送，这段时间主要用于等待传送动画显示完毕
        setTimeout(function (scene) {
            _isTeleporting = true; //用于标志本次传送是由我们自定义的传送道具或技能引起的，在传送完毕时，根据该开关可以作其它操作，比如展示传送完毕的动画
            $gamePlayer.reserveTransfer(teleportPlace.mapid, teleportPlace.x, teleportPlace.y, 0, 0); //传送队伍到指定地图的指定位置
        }, 1500, SceneManager._nextScene);
    };
    var _isTeleporting = false;
    /**
     * 当玩家取消传送时。在传送点列表选择窗口，右键或按ESC取消时的操作
     */
    Scene_ItemBase.prototype.onTeleportCancelled = function () {
        this.hideSubWindow(this.mnd_winTeleport);
    };

    //=====Scene_Map=====

    // //临时测试Window_Teleport工作是否正常
    // var _Scene_Map_create = Scene_Map.prototype.start;
    // Scene_Map.prototype.start = function() {
    //     _Scene_Map_create.call(this);
    //     var win=new Window_Teleport();
    //     this.addWindow(win);
    // };

    //=====Window_Teleport=====

    function Window_Teleport() {
        this.initialize.apply(this, arguments);
    }

    Window_Teleport.prototype = Object.create(Window_Command.prototype);
    Window_Teleport.prototype.constructor = Window_Teleport;
    //窗口宽度
    Window_Teleport.prototype.windowWidth = function () {
        return 300;
    };
    //窗口高度
    Window_Teleport.prototype.windowHeight = function () {
        return Graphics.height;
    };
    //传送点排列时显示的列数
    Window_Teleport.prototype.maxCols = function () {
        return 1;
    };
    //制作菜单项并显示在窗口中
    Window_Teleport.prototype.makeCommandList = function () {
        for (var index in $gameMap._mndTeleportPlaces) {//处理每个传送点
            var teleportPlace = $gameMap._mndTeleportPlaces[index];//获取传送点对象
            if (teleportPlace.visible) {//如果传送点是可见的
                //将一个传送点以菜单命令方式加入窗口中，所有菜单的标识符都设置为`teleport`，即都绑定到同一个事件处理
                //这里将index作为ext数据，这索引表示该传送点在在传送点列表_mndTeleportPlaces中的索引
                this.addCommand(teleportPlace.name, 'teleport', teleportPlace.enabled, index);
            }
        }
    };

    //=====Game_Map=====

    var _Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function() {
        _Game_Map_initialize.call(this);
        this._mndTeleportPlaces=[];     //用于保存传送点信息
        this._mndTeleportUnableMaps={}; //用于保存禁止使用传送功能的地图信息
    };

    var _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);

        if($dataMap.note.contains("<!teleport>")){ //表示该地图不允许使用传送道具或技能
            if(this._mndTeleportUnableMaps[this.mapId()]==undefined)
                this.mndSetMapTeleportEnabled(this.mapId(), false);
        }
        if ($dataMap.note.contains("<teleport:")) {//判断备注中是否包含传送点信息
            var mapid = this.mapId();//获得当前的地图ID
            var sTeleports = $dataMap.meta.teleport;//读取地图的meta数据中的teleport数据
            //多个传送点信息，如：“<eleport: 11 3 0 1 世界之源:起点; 15 8 1 1 世界之源:河心>”，包含了多个传送点的数据，它们之间用半角分号空格分隔
            //每个传送点信息，如：“11 3 0 1 世界之源:起点”，包含了传送点的多个数据，它们之间用空格分隔，将这些数据分割出来
            var sTeleportInfos = sTeleports.split(";").filter(function (t) { return t != "" });//分解出多个传送点；filter用于过滤掉空白字符串
            sTeleportInfos.forEach(function (sTeleportInfo) {//处理每个传送点信息
                var sProps = sTeleportInfo.split(" ").filter(function (t) { return t != ""; });
                var x = Number(sProps[0]);//传送点x坐标
                var y = Number(sProps[1]);//传送点y坐标
                var index=this.mndIndexOfTeleportPlace(mapid, x, y);//检查该传送点是否已经存在
                if (index < 0) {//如果不存在，就将该传送点保存起来
                    var enabled = sProps[2] == undefined ? true : Boolean(Number(sProps[2]));//传送点是否启用
                    var visible = sProps[3] == undefined ? true : Boolean(Number(sProps[3]));//传送点是否可见
                    var name = sProps[4] || $dataMapInfos[mapid].name;//传送点的名称，如果未定义，则使用地图的名称
                    this.mndRegisterTeleportPlace(mapid, x, y, enabled, visible, name);//将传送点信息保存下来
                }
            }, this);
        }
    };
    Game_Map.prototype.mndIndexOfTeleportPlace=function(mapid, x, y) {
        if(this._mndTeleportPlaces==undefined) return -1;
        for (var index in this._mndTeleportPlaces) {
            var place = this._mndTeleportPlaces[index];
            if (place.mapid == mapid && place.x == x && place.y == y) {
                return index;
            }
        }
        return -1;
    }
    Game_Map.prototype.mndRegisterTeleportPlace=function(mapid, x, y, enabled, visible, name) {
        if(this._mndTeleportPlaces==undefined) this._mndTeleportPlaces=[];//如果_mndTeleportPlaces不可用，则重新初始化
        if(this.mndIndexOfTeleportPlace(mapid, x, y)<0) {//只当传送点未登记时才保存
            this._mndTeleportPlaces.push({
                mapid: mapid,
                x: x,
                y: y,
                name: name,
                enabled: enabled,
                visible: visible
            });
        }else{//已经登记的传送点则修改其可用性和可见性
            this.mndSetTeleportPlaceEnabled(mapid, x, y, enabled, visible);
        }
    }

    /**
     * 设置当前游戏地图是否启用传送功能，如果关闭，角色在相应地图中将不能使用传送道具和传送技能
     * @param enabled
     */
    Game_Map.prototype.mndSetMapTeleportEnabled=function(mapid, enabled){
        if(this._mndTeleportUnableMaps==undefined) this._mndTeleportUnableMaps={};
        if(enabled) {
            //没有记录在_mndTeleportUnableMaps中的地图肯定是允许使用传送道具和技能的，但如果一个地图已经记录在
            //_mndTeleportUnableMaps中，则不管它现在的状态是允许还是禁止，都不能简单的一删了之，这个状态必须一
            //直记录在案，因为如果一个地图，一开始备注中写入了 <!teleport> 代码，表示禁止使用传送功能，但通过插件
            //命令将它启用了，如果此时直接从禁止列表中删除，在重新进入该地图时又会被读到 <!teleport> 标记，从而又
            //会被重新设置为禁止传送的状态，为了防止这种情况，所以状态必须保存下来。所以当_mndTeleportUnableMaps
            //中已经有地图信息时，只要修改它的值，而不是去删除它
            if(this._mndTeleportUnableMaps[mapid]!=undefined)
                this._mndTeleportUnableMaps[mapid]=false;
        }else{
            //当要禁止地图使用传送功能时，只要将mapid以key方式添加到_mndTeleportUnableMaps中，并将
            //其值设置为true表示禁止使用（以后，可以用插件命令将它设置为true或false）。
            this._mndTeleportUnableMaps[mapid]=true;
        }
    }
    /**
     * 查询指定地图是否允许使用传送道具或技能
     * @param mapid 地图ID
     * @returns {boolean}
     */
    Game_Map.prototype.mndIsMapTeleportEnabled=function (mapid) {
        //当地图未在_mndTeleportUnableMaps记录或者记录值为false时表示地图允许使用传送道具和技能
        if(this._mndTeleportUnableMaps==undefined) return true;
        else return !!!this._mndTeleportUnableMaps[mapid];//相当于：else return this._mndTeleportUnableMaps[mapid]==undefined || this._mndTeleportUnableMaps[mapid]==false;
    }

    /**
     * 删除记录的传送点
     * @param mapid 传送点所在地图id
     * @param x 传送点X坐标
     * @param y 传送点Y坐标
     */
    Game_Map.prototype.mndRemoveTelleportPlace=function(mapid, x, y) {
        var index = this.mndIndexOfTeleportPlace(mapid, x, y);
        if (index >= 0) {
            this._mndTeleportPlaces.splice(index, 1);
        }
    }
    /**
     * 设置传送点的显示或隐藏，启用或禁用状态
     * @param mapid 传送点所在地图id
     * @param x 传送点X坐标
     * @param y 传送点Y坐标
     * @param enabled 是否允许传送到该传送点
     * @param visible 是否显示在传送地选择列表中
     */
    Game_Map.prototype.mndSetTeleportPlaceEnabled=function(mapid, x, y, enabled, visible) {
        var index = this.mndIndexOfTeleportPlace(mapid, x, y);
        if (index >= 0) {
            this._mndTeleportPlaces[index].enabled = enabled;
            this._mndTeleportPlaces[index].visible = visible;
        }
    }

})();