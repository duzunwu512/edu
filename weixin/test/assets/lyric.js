/*
  解析歌词并渲染到界面
*/

(function($){

  window.MusicPlayer = function(obj){
    this.lrcPath = obj.lyric;
    this.lrcContainer = $(obj.container);
    this.player = $(obj.audio);
    this.paused = false;
    if(typeof obj.lyricChange == 'function'){
      this.lyricChange = obj.lyricChange;
    };
    if(typeof obj.callback == 'function'){
      this.callback = obj.callback;
    };
    if(typeof obj.followRead=='function'){
      this.followRead = obj.followRead;
    }


    var that = this;
    $.ajax({
      url: this.lrcPath,
      success: function(lrc){
        var lyric = that.parseLyric(lrc);
        if(that.lrcSuccess) that.lrcSuccess(lyric);
      },
      error:function(e){
        if(that.lrcError) that.lrcError(e);
      }
    });

  }

  MusicPlayer.prototype.parseLyric = function(lrc){
    var lyrics = lrc.split("\n");
    var lrcObj = {};
    for(var i = 0; i < lyrics.length; i++){
      var lyric = decodeURIComponent(lyrics[i]);
      var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
      var timeRegExpArr = lyric.match(timeReg);
      if(!timeRegExpArr) continue;
      var clause = lyric.replace(timeReg,'');

      for(var k = 0, h = timeRegExpArr.length; k < h; k++) {
        var t = timeRegExpArr[k];
        var min = Number(String(t.match(/\[\d*/i)).slice(1)),
        sec = Number(String(t.match(/\:\d*/i)).slice(1));
        var time = min * 60 + sec;
        lrcObj[time] = $.trim(clause);
      }
    }
    return lrcObj;
  }

  MusicPlayer.prototype.lrcSuccess = function(lyric){
    this.lyric = lyric;
    this.lrcContainer.html('');
    var ele;
    var txt;
    for(var x in lyric){
      ele = $('<li/>').attr('data-time', x);
      if(lyric[x].indexOf("->")>-1){
        var lcs = lyric[x].split("->");
        txt = lcs[0];
        $(ele).data('url', lcs[1]);
      }else{
        txt = lyric[x];
      }
      
      var regex = /\s+/g;
      txt = txt.replace(regex, "</span> <span>");

      $(ele).html('<span>'+txt+'</span>').appendTo(this.lrcContainer);
      if(x==0){
        ele.addClass("active");
      }
    }
    
    var that = this, nt = 0, lt=0; 
    if(that.callback)  that.callback(this.player);  

    this.player.on('timeupdate', function(e){
      if(that.paused) return;
      var t = Math.floor(that.player[0].currentTime);
      if(nt == t) return;
      lt = nt;
      nt = t;
      if(typeof that.lyric[t] != 'undefined'){
        //var $nl = that.lrcContainer.find('li').removeClass('active').filter('[data-time="'+ t + '"]').addClass('active');
        var $nl = that.lrcContainer.find('li').filter('[data-time="'+ t + '"]');
        if(that.followRead) that.followRead(lt, nt);

        if(that.lyricChange) that.lyricChange({
          time: t,
          target: $nl
        });
      }
    });
  }

  MusicPlayer.prototype.lrcError = function(){
    console.error("歌词加载失败！");
  }

  MusicPlayer.prototype.pause = function(){
    this.paused = true;
  }

  MusicPlayer.prototype.restart = function(){
    this.paused = false;
  }

})(Zepto);