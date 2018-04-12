$(function () {
    $("#modal").iziModal({
        title: '',
        subtitle: '',
        headerColor: '#495F7F',
        background: null,
        theme: '',  // light
        icon: null,
        iconText: null,
        iconColor: '',
        rtl: false,
        width: 600,
        top: null,
        bottom: null,
        borderBottom: true,
        padding: 0,
        radius: 3,
        zindex: 999,
        iframe: false,
        iframeHeight: 400,
        iframeURL: null,
        focusInput: true,
        group: '',
        loop: false,
        arrowKeys: true,
        navigateCaption: true,
        navigateArrows: true, // Boolean, 'closeToModal', 'closeScreenEdge'
        history: false,
        restoreDefaultContent: false,
        autoOpen: 0, // Boolean, Number
        bodyOverflow: false,
        fullscreen: false,
        openFullscreen: false,
        closeOnEscape: true,
        closeButton: true,
        appendTo: 'body', // or false
        appendToOverlay: 'body', // or false
        overlay: true,
        overlayClose: true,
        overlayColor: 'rgba(0, 0, 0, 0.4)',
        timeout: false,
        timeoutProgressbar: false,
        pauseOnHover: false,
        timeoutProgressbarColor: 'rgba(255,255,255,0.5)',
        transitionIn: 'comingIn',
        transitionOut: 'comingOut',
        transitionInOverlay: 'fadeIn',
        transitionOutOverlay: 'fadeOut',
        onFullscreen: function(){},
        onResize: function(){},
        onOpening: function(){},
        onOpened: function(){},
        onClosing: function(){},
        onClosed: function(){},
        afterRender: function(){}
    });



    $("#get-link-btn").on('click', function () {
        event.preventDefault();
        // $('#modal').iziModal('setZindex', 99999);
        // $('#modal').iziModal('open', { zindex: 99999 });
        $('#modal').iziModal('open');

    })


});

