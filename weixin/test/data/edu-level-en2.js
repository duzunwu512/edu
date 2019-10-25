$(function () {

  var audio_scroll_end = 0;//上次滚动结束时间
  var play = false;
  var follow = false;
  var listart=0;//当前句开始时间
  var lilast=0;//上句开始时间

  //播放器字幕
  var m = new MusicPlayer({
    lyric: "data/e2-15.lrc", //歌词文件地址，UTF-8编码，在file协议下会取不到
    container: "#scroller", //歌词渲染容器
    audio: '#audio', //绑定到的音频元素
    lyricChange: function (e) { //歌词状态改变时
      listart = e.time;

      if(follow){//如果跟读
        lilast = $(e.target).prev(".validen").data("time");
        if(lilast){
          audio.pause();
          setTimeout(currentText, (listart-lilast+1)*1000);
        }
      }else{
        currentText();
      }
    },
    callback: function (audio) {
      loaded();
      audio.on('ended', function(e){
        audioStop();
      });
    }
  });

  function currentText(){
    var url = $("#scroller .active").data("url");
    if(url ){ //如果是图片，没有文字
      $("#header > img").fadeOut(200, function(){
        $("#header > img").attr("src", url).fadeIn(200);
      });
    }
    if (new Date().getTime() - audio_scroll_end > 1000 * 2) {//滑动2后才滚动当前li
      myScroll.scrollToElement(document.querySelector('#scroller .active'), 1200, null, -120, IScroll.utils.ease.circular);
    }
    if(audio.paused){
      audio.play();
    }
  }
  
////单词声音
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
  audio.addEventListener("canplay", function() {
    $(".mp3-play i").removeClass("icon-refresh icon-spin").addClass("fa fa-play");
    }
  );


   // 按下单词变色
  $(document).on("touchstart", ".textdiv span, .title span", function () {
    $(this).addClass("activeSpan");
  });
  $(document).on("touchend", ".textdiv span, .title span", function () {
    $(this).removeClass("activeSpan");
  });

  //滚动字幕
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

  //开关播放
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
  function audioStop(ele){
    audio.pause();
    play = !play;
    $(ele).find("i").removeClass("fa-pause").addClass("fa-play");
  }
//关闭进度条
  $('.loading-overlay').slideUp(200, function(){
    $('.loading-overlay').css("display","none");
    $('.img_load > img').attr("src", "p1.png");
  });

  //单行播放
  $(document).on("click", "li", function(event){ 
    if(audio.paused) {
      audioStart($(".mp3-play"));
    }else{
      audio.currentTime = $(this).data("time");
    }
  });

  //图片滑动大小改变
  $("#header").on("swipeUp", function(){
    if (window.orientation === 180 || window.orientation === 0) { //竖屏
      $(".imgdiv").animate({ height: 50 }, 300, 'linear', function() {   });
      $("#wrapper").animate({ top: 50 }, 300, 'linear', function() {    });
    }
  }).on("swipeLeft", function(){
    if (window.orientation === 90 || window.orientation === -90 ){ //横屏
      $(".imgdiv").removeClass("img_load").animate({ 'width': '10%' }, 300, 'linear', function() {});
      $("#wrapper").animate({ 'margin-left': '10%' }, 300, 'linear', function() {});
    }
  }).on("swipeDown", function(){
    if (window.orientation === 180 || window.orientation === 0) { //竖屏
      $(".imgdiv").animate({ height: 200 }, 300, 'linear', function() {  });
      $("#wrapper").animate({ top: 200 }, 300, 'linear', function() {   });
    }
  }).on("swipeRight", function(){
    if (window.orientation === 90 || window.orientation === -90 ){ //横屏
      $(".imgdiv").animate({ 'width': '40%' }, 300, 'linear', function() {});
      $("#wrapper").animate({ 'margin-left': '40%' }, 300, 'linear', function() {});
    }
  });

  window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
    $(".imgdiv, #wrapper").removeAttr("style");
  }, false);

  //字体大小变改
  $(".bigFont").on("click", function(){
    var thisEle = $("#scroller > li").css("font-size"); 
    var textFontSize = parseFloat(thisEle , 10);
    var unit = thisEle.slice(-2);
    textFontSize += 2;
    $("#scroller > li").css("font-size", textFontSize + unit);

    var thisEle = $("#scroller > li").css("line-height");
    var textFontSize = parseFloat(thisEle , 10);
    var unit = thisEle.slice(-2);
    textFontSize += 3;
    $("#scroller > li").css("line-height", textFontSize + unit);

  });
  
  $(".smallFont").on("click", function(){
    var thisEle = $("#scroller > li").css("font-size"); 
    var textFontSize = parseFloat(thisEle , 10);
    var unit = thisEle.slice(-2);
    textFontSize -= 2;
    $("#scroller > li").css("font-size", textFontSize + unit);

    var thisEle = $("#scroller > li").css("line-height");
    var textFontSize = parseFloat(thisEle , 10);
    var unit = thisEle.slice(-2);
    textFontSize -= 5;
    $("#scroller > li").css("line-height", textFontSize + unit);
  });

  //是否跟读
  $("#followBtn").on("click", function(){
    if(follow){
      $(this).find("i").removeClass("icon-comments").addClass("icon-comments-alt");
    }else{
      $(this).find("i").removeClass("icon-comments-alt").addClass("icon-comments");
    }
    follow = !follow;
  });
});