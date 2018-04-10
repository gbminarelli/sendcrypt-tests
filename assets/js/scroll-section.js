$(function() {




    /* ------------------------------------------------------------|
    | SCROLL ANIMATIONS
    *-------------------------------------------------------------*/

    function changeActiveClass(element) {
        let windowWidth = $(document).width();


        if(windowWidth >= 1080) { //change navbar classes on mobile only
            $(".navbar-menu li").removeClass("navbar-item-active"); //remove all present classes

            element.toggleClass('navbar-item-active');//add class to this item only
        }
    }


    /* FEATURES =========================================== */
    $(".menu-features").on('click',function(){

        $('html, body').animate({
            scrollTop: $("#section-features").offset().top - 50
        }, 1000);

        changeActiveClass($(this));

    });

    /* OPEN SOURCE SECTION =========================================== */
    $(".menu-open-source").on('click',function(){

        $('html, body').animate({
            scrollTop: $("#section-open-source").offset().top - 50
        }, 1000);
        changeActiveClass($(this));
    });

    /* OPEN SOURCE SECTION =========================================== */
    $(".menu-how-it-works").on('click',function(){

        $('html, body').animate({
            scrollTop: $("#section-how-it-works").offset().top - 100
        }, 1000);
        changeActiveClass($(this));
    });


    /* ABOUT US SECTION =========================================== */
    $(".menu-about-us").on('click',function(){

        $('html, body').animate({
            scrollTop: $("#section-about-us").offset().top - 50
        }, 1000);
        changeActiveClass($(this));
    });







});