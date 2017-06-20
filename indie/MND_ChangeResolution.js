//============================================
// MND_ChangeResolution.js
//============================================
/*:
 * @plugindesc Change screen resolution.(v1.0)
 * @author Mandarava
 *
 * @param Screen Width
 * @type Number
 * @desc Screen width
 * @default 816
 *
 * @param Screen Height
 * @type Number
 * @desc Screen height
 * @default 624
 *
 * @help
 * Set the Screen Width and Screen Height as you wish.
 */

/*:zh
 * @plugindesc 修改游戏屏幕分辨率。(v1.0)
 * @author Mandarava（鳗驼螺）
 * 
 * @param Screen Width
 * @type Number
 * @desc 屏幕宽度
 * @default 816
 * 
 * @param Screen Height
 * @type Number
 * @desc 屏幕高度
 * @default 624
 * 
 * @help
 * 配置 Screen Width 和 Screen Height 即可。
 */

(function($){
    var params=PluginManager.parameters("MND_ChangeResolution");
    var screenWidth=Number(params["Screen Width"]);
    var screenHeight=Number(params["Screen Height"]);

    SceneManager._screenWidth  = screenWidth;
    SceneManager._screenHeight = screenHeight;
    SceneManager._boxWidth     = screenWidth;
    SceneManager._boxHeight    = screenHeight;

    var newWidth = screenWidth - window.innerWidth;
    var newHeight = screenHeight - window.innerHeight;  
    window.moveBy(- newWidth / 2, - newHeight / 2);
    window.resizeBy(newWidth, newHeight);
})();