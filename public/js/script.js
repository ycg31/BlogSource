(function ($) {
  console.log('© Theme-Vexo | https://github.com/yanm1ng/hexo-theme-vexo')
  var app = $('.app-body')
  var header = $('.header')
  var tocw = $('.post-toc-wrap')
  var banner = document.getElementById('article-banner') || false
  var about = document.getElementById('about-banner') || false
  var top = $('.scroll-top')
  var isOpen = false

  $(document).ready(function () {
    NProgress.start()
    $('#nprogress .bar').css({
      'background': '#42b983'
    })
    $('#nprogress .spinner').hide()

    var fade = {
      transform: 'translateY(0)',
      opacity: 1
    }
    if (banner) {
      app.css('transition-delay', '0.15s')
      $('#article-banner').children().css(fade)
    }
    if (about) {
      $('.author').children().css(fade)
    }
    app.css(fade)
  })

  window.onload = function () {
    setTimeout(function () {
      NProgress.done()
    }, 200)
  }

  $('.menu').on('click', function () {
    if (!header.hasClass('fixed-header') || isOpen) {
      header.toggleClass('fixed-header')
      isOpen = !isOpen
    }
    $('.menu-mask').toggleClass('open')
  })

  $('#tag-cloud a').on('click', function () {
    var list = $('.tag-list')
    var name = $(this).data('name')
    var maoH = list.find('#' + name).offset().top

    $('html,body').animate({ scrollTop: maoH - header.height() }, 500)
  })

  $('.reward-btn').on('click', function () {
    $('.money-code').fadeToggle()
  })

  $('.arrow-down').on('click', function () {
    $('html,body').animate({ scrollTop: banner.offsetHeight - header.height() }, 500)
  })

  top.on('click', function () {
    $('html,body').animate({ scrollTop: 0 }, 600)
  })

  document.addEventListener('scroll', function () {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    var headerH = header.height()
    if (banner) {
      if (scrollTop > headerH) {
        header.addClass('fixed-header')
        tocw.addClass('fixed')
      } else if (scrollTop === 0) {
        header.removeClass('fixed-header')
        tocw.removeClass('fixed')
      }
    }
    if (scrollTop > 100) {
      top.addClass('opacity')
    } else {
      top.removeClass('opacity')
    }
    
    var toc = $('#post-toc')
    var titles = $('#post-content').find('h1, h2, h3, h4, h5, h6')
    toc.find('a[href="#' + titles[0].id + '"]').parent().addClass('active')
    for (i = 0, len = titles.length; i < len; i++) {
                        if (scrollTop >  $(titles[i]).offset().top - headerH - 5) {
                            toc.find('li.active').removeClass('active');

                            var active = toc.find('a[href="#' + titles[i].id + '"]').parent();
                            active.addClass('active');
                        }
                    }

                    if (scrollTop < $(titles[0]).offset().top) {
                        toc.find('li.active').removeClass('active');
                        toc.find('a[href="#' + titles[0].id + '"]').parent().addClass('active');
                    }
  })
})(jQuery)
