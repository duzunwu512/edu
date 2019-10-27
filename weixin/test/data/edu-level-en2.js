$(function () {

  var audio_scroll_end = 0;//上次滚动结束时间
  var play = false;
  var follow = false;

  var lyric_file = db['data_'+getUrlParam('lv2_1')].lyric;
  var audio_file = db['data_'+getUrlParam('lv2_1')].audio;

  //播放器字幕
  var m = new MusicPlayer({
    lyric: lyric_file, //歌词文件地址，UTF-8编码，在file协议下会取不到
    container: "#scroller", //歌词渲染容器
    audio: '#audio', //绑定到的音频元素
    lyricChange: function (e) { //歌词状态改变时
      if(!follow){
        slideImg();
      }
      if (new Date().getTime() - audio_scroll_end > 1000 * 2) {//滑动2后才滚动当前li
        var activeEle = document.querySelector('#scroller .active');
        if(!activeEle){
          activeEle = document.querySelector('#scroller li:eq(0)');
        }
        myScroll.scrollToElement(document.querySelector('#scroller .active'), 1200, null, -120, IScroll.utils.ease.circular);
      }
    },
    callback: function (audio) {
      loaded();
      audio.on('ended', function(e){
        audioStop();
      });
    },
    followRead: function(lt, nt){
      if(follow){//如果跟读
        audio.pause();
        setTimeout(function(){
          if(audio.paused){
            audio.play();
            $("#scroller > li").removeClass("active").filter('[data-time="'+ nt + '"]').addClass("active");
            slideImg();            
          }
        }, (nt-lt+1)*1000);
      }else{
        $("#scroller > li").removeClass("active").filter('[data-time="'+ nt + '"]').addClass("active");
      }
    }
  });

  function slideImg(){
    var url = $("#scroller .active").data("url");
      if(url ){ //如果是图片，没有文字
        $("#header > img").fadeOut(200, function(){
          $("#header > img").attr("src", url).fadeIn(200);
        });
      }
  }

  var audio = document.getElementById("audio");
  var wordAudio = document.getElementById("wordAudio");
  audio.src=audio_file;
  audio.addEventListener("canplay", function() {
      if(audio.paused){
        $(".mp3-play i").removeClass("icon-refresh icon-spin").addClass("fa fa-play");
      }
    }
  );
  audio.addEventListener("ended", function() {
      $("#scroller > li").removeClass("active");
      audioStop($('.mp3-play'));
    }
  );
  //开关播放
  $(".mp3-play").on("click", function () {
    //debugger;
    if (!audio.paused) {
      audioStop(this);
    } else {
      audioStart(this);
    }
  });

  function audioStart(ele){
    if(audio.paused){
      audio.play();
    }
    $(ele).find("i").removeClass("fa-play").addClass("fa-pause");
  }
  function audioStop(ele){
    if(!audio.paused){
      audio.pause();
    }
    $(ele).find("i").removeClass("fa-pause").addClass("fa-play");
  }

  //单行播放
  $(document).on("click", "li", function(event){ 
    if(audio.paused) {
      audioStart($(".mp3-play"));
    }else{
      audio.currentTime = $(this).data("time");
    }
  });  

  //是否跟读
  $("#followBtn").on("click", function(){
    var text = "";
    if(follow){
      $(this).find("i").removeClass("icon-comments").addClass("icon-comments-alt");
      text = "关闭跟读模式";
    }else{
      $(this).find("i").removeClass("icon-comments-alt").addClass("icon-comments");
      text = "开启跟读模式";
    }

    follow = !follow;
  });

////单词声音
  $("ul").on("click", ".textdiv span, .title span", function (event) {
    var text = $(this).text();
    if (text.indexOf(" ")) {
      text = text.split(" ")[0];
    }

    //debugger;
    var paused = audio.paused;
    if(!paused){
      audio.pause();
    }

    text = text.replace(/[,.!]/g, "");
    wordAudio.pause();
    wordAudio.src = 'http://dict.youdao.com/dictvoice?type=0&audio='+text;
    wordAudio.play();

    audio.currentTime = $(this).parent("li").data("time");
    setTimeout(function(){
      audioStart($(".mp3-play"));
    }, 1000);

    event.stopPropagation();
  });
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


//关闭进度条
  $('.loading-overlay').slideUp(200, function(){
    $('.loading-overlay').css("display","none");
    $('.img_load > img').attr("src", "p1.png");
  });

  $(document).on("touchstart", ".textdiv li", function () {
    $(this).addClass("activeli");
  });
  $(document).on("touchend", ".textdiv li", function () {
    $(this).removeClass("activeli");
  });


  //图片滑动大小改变
  $("#header").on("swipeUp", function(){
    swipeUp();
  }).on("swipeLeft", function(){
    if (window.orientation === 90 || window.orientation === -90 ){ //横屏
      $(".imgdiv").removeClass("img_load").animate({ 'width': '10%' }, 300, 'linear', function() {$(".fontbtn").hide();});
      $("#wrapper").animate({ 'margin-left': '10%' }, 300, 'linear', function() {});
      
      refreshScrooll();
    }
  }).on("swipeDown", function(){
    swipeDown();
  }).on("swipeRight", function(){
    if (window.orientation === 90 || window.orientation === -90 ){ //横屏
      $(".imgdiv").animate({ 'width': '40%' }, 300, 'linear', function() {});
      $("#wrapper").animate({ 'margin-left': '40%' }, 300, 'linear', function() {});
      $(".fontbtn").show();

      refreshScrooll();
    }
  });

  $('button.arrow').on("click", function () {
    swipeUp();
    if(!$(this).data("up") && !$(this).data("up")){
      swipeUp();
      $(this).data("up", true);
    }else{
      swipeDown();
      $(this).data("up", false);
    }
    
  });

  function swipeUp(){
    if (window.orientation === 180 || window.orientation === 0) { //竖屏
      $(".imgdiv").animate({ height: 50 }, 300, 'linear', function() {$(".fontbtn").hide();   });
      $("#wrapper").animate({ top: 50 }, 300, 'linear', function() {    });
      $("button.arrow").removeClass("up-arrow").addClass("down-arrow")
      .find("i").removeClass("fa-chevron-up").addClass("fa-chevron-down");

      refreshScrooll();
    }
  }

  function swipeDown(){
    if (window.orientation === 180 || window.orientation === 0) { //竖屏
      $(".imgdiv").animate({ height: 200 }, 300, 'linear', function() { $(".fontbtn").show(); });
      $("#wrapper").animate({ top: 200 }, 300, 'linear', function() {   });
      $(".fontbtn").show();
      $("button.arrow").removeClass("down-arrow").addClass("up-arrow")
      .find("i").removeClass("fa-chevron-down").addClass("fa-chevron-up");

      refreshScrooll();
    }
  }

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
    
    refreshScrooll();
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

    refreshScrooll();
  });

  function refreshScrooll(){
    setTimeout(function () {
      myScroll.refresh();
    }, 1500);
  }


});