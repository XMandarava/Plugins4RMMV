/*:
 * @plugindesc 标题画面前景、背景、菜单等美化。
 * @author Mandarava（鳗驼螺）
 *
 * @help
 *
 */

//=================图片菜单=================

var _Scene_Title_create = Scene_Title.prototype.create;
Scene_Title.prototype.create = function () {
    _Scene_Title_create.call(this);
    this._commandWindow.visible = false;
    this._commandWindow.x=Graphics.width;
    var btnimgs=["CmdStartGame", "CmdContinueGame", "CmdOptions", "CmdHomepage"];
    var clicks=[
        function(){this.commandNewGame(); SoundManager.playOk();},
        function(){this.commandContinue(); SoundManager.playOk();},
        function(){this.commandOptions(); SoundManager.playOk();},
        function(){this.commandHomepage(); SoundManager.playOk();}
    ];
    this._cmdButtons=[];
    for(var i in btnimgs){
        var sprite=new Sprite_Button();
        sprite.width=184;
        sprite.height=53;
        sprite.bitmap=ImageManager.loadBitmap("img/mndtitle/", btnimgs[i]);
        sprite.x=Graphics.width/2-92;
        sprite.y=360+60*i;
        sprite.setClickHandler(clicks[i].bind(this));
        this._cmdButtons.push(sprite);
        this.addChild(sprite);
    }
    this._cmdSelect=new Sprite(ImageManager.loadBitmap("img/mndtitle/", "CmdSelect"));
    this._cmdSelect.anchor=new Point(1,0);
    this.addChild(this._cmdSelect);
};

//=================添加自定义菜单：官方网站=================

var _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
Window_TitleCommand.prototype.makeCommandList = function () {
    _Window_TitleCommand_makeCommandList.call(this);

    this.addCommand("官方网站", 'homepage');
};

var _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
    _Scene_Title_createCommandWindow.call(this);

    this._commandWindow.setHandler('homepage', this.commandHomepage.bind(this));
};

Scene_Title.prototype.commandHomepage = function() {
    this._commandWindow.activate();
    //打开url
    var cmd;
    if (process.platform === 'darwin') cmd = 'open';
    if (process.platform === 'win32') cmd = 'explorer.exe';
    if (process.platform === 'linux') cmd = 'xdg-open';
    var spawn = require('child_process').spawn;
    spawn(cmd, ["http://www.popotu.com/"]);
};

//=================标题前景、背景修改=================

var _Scene_Title_createForeground = Scene_Title.prototype.createForeground;
Scene_Title.prototype.createForeground = function() {
    _Scene_Title_createForeground.call(this);
    if ($dataSystem.optDrawTitle) {
        var gameLogo = ImageManager.loadBitmap("img/mndtitle/", "MandaravaTestLogo");
        this._gameTitleSprite = new Sprite(gameLogo);
        this._gameTitleSprite.anchor = new Point(0.5, 0);
        this._gameTitleSprite.x = Graphics.width / 2;
        this._gameTitleSprite.y = 50;
        this.addChild(this._gameTitleSprite);
    }
};
Scene_Title.prototype.drawGameTitle = function() {
    var x = 20;
    var y = Graphics.height / 3;
    var maxWidth = Graphics.width - x * 2;
    var text = $dataSystem.gameTitle;
    this._gameTitleSprite.bitmap.outlineColor = 'black';
    this._gameTitleSprite.bitmap.outlineWidth = 8;
    this._gameTitleSprite.bitmap.fontSize = 72;
    this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
};

Scene_Title.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SceneManager.clearStack();
    this.playTitleMusic();
    this.startFadeIn(this.fadeSpeed(), false);
};

var _Scene_Title_update = Scene_Title.prototype.update;
Scene_Title.prototype.update = function() {
    _Scene_Title_update.call(this);

    //动态背景：更新动画
    this._elapsedSinceLastUpdate = this._elapsedSinceLastUpdate || 0;
    if (this._elapsedSinceLastUpdate >= this._animDelay) {
        this._currFrame++;
        this._currFrame = this._currFrame % this._animFrames.length;
        var animFrameIndex = this._animFrames[this._currFrame];
        this._backSprite.bitmap = this._animFrameImgs[animFrameIndex];
        this._elapsedSinceLastUpdate = 0;
    }
    this._elapsedSinceLastUpdate += 1 / Graphics._fpsMeter.fps;

    //图片菜单相关：在当前选中的图片菜单前面加个指示器
    var btnSelect = this._cmdButtons[this._commandWindow.index()];
    this._cmdSelect.x = btnSelect.x;
    this._cmdSelect.y = btnSelect.y;
};