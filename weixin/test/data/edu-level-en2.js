$(function () {

  var audio_scroll_end = 0;
  var play = false;

  var m = new MusicPlayer({
    lyric: "data/e2-15.lrc", //歌词文件地址，UTF-8编码，在file协议下会取不到
    container: "#scroller", //歌词渲染容器
    audio: '#audio', //绑定到的音频元素
    lyricChange: function (e) { //歌词状态改变时
      if (new Date().getTime() - audio_scroll_end > 1000 * 2) {
        var url = $("#scroller .active").data("url");
        if(url ){ $
          $("#header > img").fadeOut(200, function(){
            $("#header > img").attr("src", url).fadeIn(200);
          });
        }
        myScroll.scrollToElement(document.querySelector('#scroller .active'), 1200, null, -120, IScroll.utils.ease.circular)
      }
    },
    callback: function (audio) {
      loaded();
      audio.on('ended', function(e){
        audioStop();
      });
    }
  });

  $(document).on("click", ".textdiv span, .title span", function () {
    var text = $(this).text();
    if (text.indexOf(" ")) {
      text = text.split(" ")[0];
    }
    text = text.replace(/[,.!]/g, "");
    wordAudio.pause();
    wordAudio.src = 'http://dict.youdao.com/dictvoice?type=0&audio='+text;
    wordAudio.play();
  });

  var audio = document.getElementById("audio");
  var wordAudio = document.getElementById("wordAudio");
  audio.src='data/15 A picnic in the rain.mp3';


  $(document).on("touchstart", ".textdiv span, .title span", function () {
    $(this).addClass("activeSpan");
  });
  $(document).on("touchend", ".textdiv span, .title span", function () {
    $(this).removeClass("activeSpan");
  });


  var myScroll;
  function loaded() {
    myScroll = new IScroll('#wrapper', { mouseWheel: true, click: true });
    myScroll.on("scrollEnd", function () {
      audio_scroll_end = new Date().getTime();
    });
  }

  document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
    capture: false,
    passive: false
  } : false);


  $(document).on("click", ".mp3-play", function () {
    //debugger;
    if (play) {
      audioStop(this);
    } else {
      audioStart(this);
    }
  });

  function audioStart(ele){
    audio.play();
    play = !play;
    $(ele).find("i").removeClass("fa-play").addClass("fa-pause");
  }
  function audioStop(){
    audio.pause();
    play = !play;
    $(ele).find("i").removeClass("fa-pause").addClass("fa-play");
  }
});