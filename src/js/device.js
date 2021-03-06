/*===========================
Device/OS Detection
===========================*/
app.getDeviceInfo = function () {
    var device = {};
    var ua = navigator.userAgent;

    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
    }
    if (ipad || iphone || ipod) {
        device.os = 'ios';
    }
    // iOS
    device.iphone = false;
    device.ipad = false;
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
        device.iphone = true;
    }
    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
        device.ipad = true;
    }
    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        device.iphone = true;
    }

    // Webview
    device.webview = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);
        
    // Minimal UI
    if (device.os && device.os === 'ios') {
        var osVersionArr = device.osVersion.split('.');
        device.minimalUi = !device.webview &&
                            (ipod || iphone) &&
                            (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
                            $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
    }

    // Check for status bar and fullscreen app mode
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    device.statusBar = false;
    if (
        device.webview &&
        (
            // iPhone 5
            (windowWidth === 320 && windowHeight === 568) ||
            (windowWidth === 568 && windowHeight === 320) ||
            // iPhone 4
            (windowWidth === 320 && windowHeight === 480) ||
            (windowWidth === 480 && windowHeight === 320) ||
            // iPad
            (windowWidth === 768 && windowHeight === 1024) ||
            (windowWidth === 1024 && windowHeight === 768)
        )
    ) {
        console.log(device.webview);
        device.statusBar = true;
    }
    else {
        device.statusBar = false;
    }

    // Pixel Ratio
    device.pixelRatio = window.devicePixelRatio || 1;

    // Add html classes
    if (device.os) {
        var className = device.os +
                        ' ' +
                        device.os + '-' + device.osVersion.replace(/\./g, '-') +
                        ' ' +
                        device.os + '-' + device.osVersion.split('.')[0];
        $('html').addClass(className);
    }
    if (device.statusBar) {
        $('html').addClass('with-statusbar-overlay');
    }
    else {
        $('html').removeClass('with-statusbar-overlay');
    }

    // Export to app
    app.device = device;
};