$(document).ready(function () {
  var $backtotop = $('#backtotop');
  var top = $(window).height() - $backtotop.height() - 200;

  function moveBacktotop() {
    $backtotop.css({ top: top, right: 0});
  }

  $backtotop.click(function () {
    $('html,body').animate({ scrollTop: 0 });
    return false;
  });
  $(window).scroll(function () {
    var windowHeight = $(window).scrollTop();
    if (windowHeight > 200) {
      $backtotop.fadeIn();
    } else {
      $backtotop.fadeOut();
    }
  });

  moveBacktotop();
  $(window).resize(moveBacktotop);

  $('.topic_content a,.reply_content a').attr('target', '_blank');

  // pretty code
  prettyPrint();

  // data-loading-text="提交中"
  $('.submit_btn').click(function () {
    $(this).button('loading');
  });
  
});
