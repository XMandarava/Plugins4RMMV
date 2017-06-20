//============================================
// MND_SkipLoadError.js
//============================================

/*:
 * @plugindesc Alert the missing file, and skip the file missing error.  (v1.0.2)
 * @author Mandarava
 *
 * @help
 * Just setup and enable it. Recommend for debug purpose only, not for release.
 * For RPG Maker MV 1.4.1 only. For 1.5 or higher, use MND_SkipFileMissingError.js instead.
 */

/*:zh
 * @plugindesc 以弹窗显示与插件、图片、声音文件缺失有关的错误停息，并尝试忽略错误继续游戏。(v1.0.2)
 * @author Mandarava（鳗驼螺）
 * 
 * @help
 * 本插件不需要配置；建议只在开发测试时使用，不建议在发布游戏时使用。
 * 本插件只针对 RPG Maker MV 1.4.1，如果针对1.5或更高版本请使用 MND_SkipFileMissingError.js。
 *
 */

PluginManager.checkErrors = function() {
    var url = this._errorUrls.shift();
    if (url) {
        alert('Failed to load: ' + url);
    }
};

ImageManager.loadSvActor = function(filename, hue) {
    var path=require("path");
    var folder = path.join(path.dirname(process.mainModule.filename), 'img/sv_actors/');
    var file = folder + filename + '.png';
    if(require("fs").existsSync(file)){
        return this.loadBitmap('img/sv_actors/', filename, hue, false);
    }else{ 
        alert("Failed to load: "+file);
        return this.loadEmptyBitmap();
    }
};

ImageManager.isReady = function() {
    for (var key in this.cache._inner) {
        var bitmap = this.cache._inner[key].item;
        if (bitmap.isError()) {
            alert('Failed to load: ' + bitmap.url);
            bitmap=ImageManager.loadEmptyBitmap();
            this.cache.setItem(key, bitmap);
        }
        if (!bitmap.isReady()) {
            return false;
        }
    }
    return true;
};

AudioManager.checkWebAudioError = function(webAudio) {
    if (webAudio && webAudio.isError()) {
        alert('Failed to load: ' + webAudio.url);
        webAudio.initialize("");
    }
};