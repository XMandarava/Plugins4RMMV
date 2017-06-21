//============================================
// MND_ChangeScreenSize.js
//============================================

/*:
 * @plugindesc 随时随地更改游戏屏幕尺寸（不会造成可视范围扩大或缩小）。
 * 
 * @author: Mandarava（鳗驼螺）
 *
 * @param Full Screen on startup
 * @type boolean
 * @on 开启全屏
 * @off 关闭全屏
 * @desc 在游戏启动时是否自动进入全屏
 * 
 * @param Screen width
 * @type number
 * @desc 游戏启动时游戏屏幕的宽度
 * 默认值：816
 * @default 816
 * 
 * @param Screen height
 * @type number
 * @desc 游戏启动时游戏屏幕的高度
 * 默认值：624
 * @default 624
 * 
 * @help
 * 本插件用于改变窗口大小，但不会缩放游戏的可视化区域。如果需要能同时改变可视区
 * 域的可以使用 MND_ChangeResolution.js。这个插件的唯一用处（我能想到的）就
 * 是在写教程时需要抓图，但默认的游戏窗口尺寸太大，想要缩小点，如果手动缩放，无
 * 法保证每次缩放大小都一样，如果用这个插件就能保证每次截图的窗口都一样大小。
 * 插件命令:
 *  ChangeScreenSize 1024 768   #修改游戏屏幕尺寸为1024x768
 *  RestoreScreenSize           #恢复为默认游戏屏幕尺寸（816x624）
 *  Fullscreen true             #开启全屏
 *  Fullscreen false            #退出全屏
 */

var params = PluginManager.parameters("MND_ChangeScreenSize");
var isFullScreen = String(params["Full Screen on startup"] || false);
var screenWidth = Number(params["Screen width"]) || 816;
var screenHeight = Number(params["Screen height"]) || 624;

if(isFullScreen != "false" && isFullScreen) Graphics._switchFullScreen();
else setScreenSize(screenWidth, screenHeight);

var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args){
    _Game_Interpreter_pluginCommand.call(this, command, args);

    switch(command){
        case "ChangeScreenSize"://修改分辨率，插件命令格式：ChangeScreenSize [width] [height]
            var _screenWidth = Number(args[0]) || 816;
            var _screenHeight = Number(args[1]) || 624;
            setScreenSize(_screenWidth, _screenHeight);
            break;
        case "RestoreScreenSize"://恢复为默认分辨率，插件命令格式：RestoreScreenSize
            setScreenSize(816, 624);
            break;
        case "Fullscreen"://进入或退出全屏，插件命令格式：Fullscreen true/false
            if(args[0] != "false" && args[0]) Graphics._requestFullScreen();
            else Graphics._cancelFullScreen();
            break;
        default: break;
    }
}

function setScreenSize(screenWidth, screenHeight){
    var deltaWidth = screenWidth - window.innerWidth;
    var deltaHeight = screenHeight - window.innerHeight;  
    window.moveBy(- deltaWidth / 2, - deltaHeight / 2);
    window.resizeBy(deltaWidth, deltaHeight);
}
