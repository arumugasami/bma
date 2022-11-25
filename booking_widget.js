var isBookinPageLoaded = false;
var filePath = location.protocol;
var url = location.href;
var popup = function (companyKey, isReschedule, isbookAppointmentResource, e, newPath, locale) {
    if (filePath == "https:") {
        subdomainPath = "https://" + newPath;
    } else {
        subdomainPath = "http://" + newPath;
    }
    client_worker_token = ''
    token_type = ''
    if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
    var windowWidth = jQuery(window).width();
    var templ = {};
    templ.overlay = '<div id="overlay"></div>';
    templ.popup = '<div id="fancy-box" style= "height: auto;left: 50%;position: absolute;top: 0;width: 545px;z-index: 999999;">' +
        '<div id="fancy-box-close-icon"></div>' +
        '<div id="fancy-box-content">' +
        '</div>' +
        '</div>';
    init = function (ck) {
        if (!isBookinPageLoaded) {
            isBookinPageLoaded = true;
            this.renderTempl();
        } else {
            this.loadIframe();
            this.positionPopup();
            this.showPopup();
        }
        jQuery('#fancy-box-iframe').on('load', function () {
            jQuery(".se-pre-con").fadeOut("slow");
        });
    };
    renderTempl = function () {
        jQuery("body").append(templ.overlay).append(templ.popup);
        this.positionPopup();
        this.loadIframe();
        this.bindEvents();
    };
    loadIframe = function () {
        if (isReschedule) {
            if (isbookAppointmentResource == "true") {
                jQuery("#fancy-box-content").html('<iframe id="fancy-box-iframe" frameborder="0" hspace="0" scrolling="auto" src="' + subdomainPath + 'rescheduleAppointment.do?cancellationKey=' + companyKey + '&isStaffBookingPage=true"></iframe>');
            } else {
                jQuery("#fancy-box-content").html('<iframe id="fancy-box-iframe" frameborder="0" hspace="0" scrolling="auto" src="' + subdomainPath + 'rescheduleAppointment.do?cancellationKey=' + companyKey + '"></iframe>');
            }
        } else {
            if (customBookingPageUrl) {
                if (companyKey && customBookingPageUrl.indexOf("custom_embed=true") > 0 && (customBookingPageUrl.indexOf("selected_staff=") > 0 || customBookingPageUrl.indexOf("category_id=") > 0)) {
                    jQuery("#fancy-box-content").html('<iframe id="fancy-box-iframe" frameborder="0" hspace="0" scrolling="auto" src="' + customBookingPageUrl + '&' + locale + '"></iframe>');
                } else if (companyKey && customBookingPageUrl.indexOf("custom_embed=true") > 0) {
                    jQuery("#fancy-box-content").html('<iframe id="fancy-box-iframe" frameborder="0" hspace="0" scrolling="auto" src="' + subdomainPath + '/schedule?type=iframe&' + locale + ' "></iframe>');
                }
            } else if (companyKey && typeof service_slug != 'undefined' && service_slug) {
                jQuery("#fancy-box-content").html('<iframe id="fancy-box-iframe" frameborder="0" hspace="0" scrolling="auto" src="' + subdomainPath + '/schedule?type=iframe&service_id=' + companyKey + '&' + locale + ' "></iframe>');
            } else if (companyKey && typeof category_slug != 'undefined' && category_slug) {
                jQuery("#fancy-box-content").html('<iframe id="fancy-box-iframe" frameborder="0" hspace="0" scrolling="auto" src="' + subdomainPath + '/schedule?type=iframe&category_id=' + companyKey + '&' + locale + ' "></iframe>');
            } else if (companyKey && typeof class_slug != 'undefined' && class_slug) {
                jQuery("#fancy-box-content").html('<iframe id="fancy-box-iframe" frameborder="0" hspace="0" scrolling="auto" src="' + subdomainPath + '/schedule?type=iframe&class_id=' + companyKey + '&' + locale + ' "></iframe>');
            } else if (companyKey && typeof panel_slug != 'undefined' && panel_slug) {
                jQuery("#fancy-box-content").html('<iframe id="fancy-box-iframe" frameborder="0" hspace="0" scrolling="auto" src="' + subdomainPath + '/schedule?type=iframe&panel_id=' + companyKey + '&' + locale + ' "></iframe>');
            } else if (companyKey) {
                jQuery("#fancy-box-content").html('<iframe id="fancy-box-iframe" frameborder="0" hspace="0" scrolling="auto" src="' + subdomainPath + '/schedule/' + companyKey + '?type=iframe' + '&' + locale + '"></iframe>');
            } else {
                jQuery("#fancy-box-content").html('<iframe id="fancy-box-iframe" frameborder="0" hspace="0" scrolling="auto" src="' + subdomainPath + '/schedule?type=iframe' + '&' + locale + '"></iframe>');
            }
        }
        jQuery("#fancy-box-content").append("<div class='se-pre-con'></div>")
    };
    bindEvents = function () {
        var self = this;
        jQuery("#overlay , #fancy-box-close-icon").bind("click", function () {
            self.hidePopup();
        });
    };
    positionPopup = function () {
        var windowHeight = jQuery(window).height();
        var windowScrollHeight = jQuery(document).height();
        var windowScrollTop = jQuery(document).scrollTop();
        var popupWidth = jQuery("#fancy-box").width();
        var popupHeight = windowHeight - 100;
        jQuery("#overlay").height(windowScrollHeight + "px");
        jQuery("#fancy-box").css({
            'margin-left': "-" + (popupWidth / 2) + "px",
            'margin-top': (((windowHeight - popupHeight) / 4) + windowScrollTop) + "px"
        });
        jQuery('.subdomain').css('overflow', 'hidden');
    };
    hidePopup = function () {
        jQuery("#overlay,#fancy-box").hide();
        jQuery('.subdomain').css('overflow', 'auto');
    };
    showPopup = function () {
        jQuery("#overlay,#fancy-box").show();
    }
    this.init(companyKey);
}
loadCss = function () {
    var cssFilePath = '<link href="https://cdn.jsdelivr.net/gh/arumugasami/bma@main/booking.css" rel="stylesheet" type="text/css" />';
    var appendCssFiles = function () {
        jQuery('#app-scheduling').css("visibility", "visible");
        jQuery("head").append(cssFilePath);
        setTimeout(function () {
            loadFancyBox();
        }, 600);
    };
    var loadFancyBox = function () {
        jQuery("[id=app-scheduling]").on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            var locale_lang = typeof (I18n) == "undefined" ? 'en' : I18n.locale
            var bookingPageLink = jQuery(this).data("domain-name");
            if (bookingPageLink.indexOf("locale=") > 0) {
                locale_lang = (bookingPageLink.split("locale=")[1]).replace('/', '');
                bookingPageLink = (bookingPageLink.split("locale=")[0]).replace(/.$/, "");
            }
            var locale = "locale=" + locale_lang;
            var host = document.createElement("a");
            host.href = bookingPageLink;
            customBookingPageUrl = false;
            if (bookingPageLink.indexOf("custom_embed=true") > 0) {
                customBookingPageUrl = bookingPageLink;
            } else if (bookingPageLink.indexOf("category_id=") > 0 || bookingPageLink.indexOf("category/") > 0) {
                category_slug = bookingPageLink.split("category/")[1]
            } else if (bookingPageLink.indexOf("service_id=") > 0 || bookingPageLink.indexOf("service/") > 0) {
                service_slug = bookingPageLink.split("service_id=")[1] || bookingPageLink.split("service/")[1]
            } else if (bookingPageLink.indexOf("schedule/") > 0 && (bookingPageLink.indexOf("?type=") > 0)) {
                user_id = bookingPageLink.split("schedule/")[1].split('?')[0]
            } else if (bookingPageLink.indexOf('class/') > 0) {
                class_slug = bookingPageLink.split("class/")[1]
            } else if (bookingPageLink.indexOf('panel/') > 0) {
                panel_slug = bookingPageLink.split("panel/")[1].split('?')[0]
            }
            var urlSplitArray = bookingPageLink.split("/");
            var companyKey = urlSplitArray[urlSplitArray.length - 1];
            if (companyKey.indexOf("?") != -1) {
                companyKey = companyKey.split("?")[1];
            }
            popup(companyKey, false, isBookinPageLoaded, e, host.hostname, locale);
        });
    };
    if (typeof jQuery !== "undefined") {
        appendCssFiles();
    } else {
        var script = document.createElement("SCRIPT");
        script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
        script.type = 'text/javascript';
        document.getElementsByTagName("head")[0].appendChild(script);
        var checkReady = function (callback) {
            if (window.jQuery) {
                callback(jQuery);
            } else {
                window.setTimeout(function () {
                    checkReady(callback);
                }, 100);
            }
        };
        checkReady(function (jQuery) {
            appendCssFiles();
        });
    }
}
loadCss();
openPopup = function () {
    loadCss();
    setTimeout(function () {
        jQuery('#app-scheduling').click();
    }, 600);
}
