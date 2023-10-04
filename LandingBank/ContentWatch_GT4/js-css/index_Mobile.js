document.addEventListener("DOMContentLoaded", function () {
    window.lazySizesConfig = window.lazySizesConfig || {};
    lazySizesConfig.expand = 1500;
    lazySizesConfig.expFactor = 1.5;
    const HTML = document.documentElement,
        MAIN = document.body.querySelector("main");
    let windowWidth = window.innerWidth,
        windowHeight = window.innerHeight,
        isPortrait = window.matchMedia("(max-aspect-ratio: 11/10), (min-aspect-ratio: 16/9)").matches,
        isPortrait1 = window.matchMedia("(max-aspect-ratio: 11/10)").matches,
        isPortrait2 = window.matchMedia("(min-aspect-ratio: 16/9)").matches,
        isZD = window.matchMedia("(aspect-ratio: 711/712)").matches || window.matchMedia("(aspect-ratio: 677/699)").matches;

    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }

    const Browser = (function () {
        const UA = navigator.userAgent.toLowerCase();
        return {
            isIE:
                UA.match(/msie/) || UA.match(/trident/) || UA.indexOf("edge") !== -1,
            isUC: UA.indexOf("ucbrowser") !== -1,
            isWeChat: UA.indexOf("micromessenger") !== -1,
        };
    })();

    const Support = (function () {
        let sticky = false,
            objectFit = false;

        if (
            !!((window.CSS && window.CSS.supports) || window.supportsCSS || false) ||
            !Browser.isIE
        ) {
            if (CSS.supports("position", "sticky")) {
                sticky = true;
            } else {
                MAIN.classList.add("no-sticky");
            }
            if ("objectFit" in document.documentElement.style !== false) {
                objectFit = true;
            } else {
                MAIN.classList.add("no-object-fit");
            }
        } else {
            MAIN.classList.add("no-sticky");
            MAIN.classList.add("no-object-fit");
        }
        return {
            sticky: sticky,
            objectFit: objectFit,
            inlineVideo: !(Browser.isUC || Browser.isWeChat),
        };
    })();

    const U = {
        smoothScroll: function (target, offset) {
            offset = 0;
            let start, id;
            const startPos = window.scrollY || window.pageYOffset || HTML.scrollTop,
                duration = 1000,
                outCube = function (n) {
                    return --n * n * n + 1;
                },
                getTop = function (target) {
                    let top = 0;
                    while (target.offsetParent) {
                        top += target.offsetTop;
                        target = target.offsetParent;
                    }
                    return top;
                },
                onScroll = function (timestamp) {
                    if (!start) start = timestamp;
                    const elapsed = timestamp - start,
                        endPos = target ? getTop(target) - offset : 0,
                        progress = Math.min(elapsed / duration, 1),
                        position = target
                            ? startPos + (endPos - startPos) * outCube(progress)
                            : startPos - startPos * outCube(progress);
                    // Ghi đè lên hàm scrollTo bằng một hàm trống


                    window.scrollTo(0, position);

                    if (elapsed < duration) {
                        id = requestAnimationFrame(onScroll);
                    } else {
                        cancelAnimationFrame(id);
                    }
                };
            id = requestAnimationFrame(onScroll);
        },
        setupAnchor: function (anchors, offset, fn, render) {
            anchors = anchors || "[data-href]";
            offset = 0;
            fn = fn || null;
            render = render || null;
            if (render) {
                let anchorClass = anchors.split(".")[1];
                document.addEventListener("click", function (event) {
                    console.info(render, anchors, 1);
                    let t = event.target;
                    if (t.classList.contains(anchorClass)) {
                        let anchor = t.getAttribute("href") || t.getAttribute("data-href"),
                            target = document.querySelectorAll(anchor)[0];
                        event.preventDefault();
                        event.stopPropagation();
                        U.smoothScroll(target, offset);
                        if (fn) fn(target);
                    }
                });
            } else {
                const renderedReasons = document.querySelectorAll(anchors);
                for (let i = 0; i < renderedReasons.length; i++) {
                    let element =
                        renderedReasons[i].getAttribute("href") ||
                        renderedReasons[i].getAttribute("data-href"),
                        target = document.querySelectorAll(element)[0];
                    renderedReasons[i].addEventListener("click", function (e) {
                        console.info(render, anchors, 2);
                        e.preventDefault();
                        e.stopPropagation();
                        U.smoothScroll(target, offset);
                        if (fn) fn(target);
                    });
                }
            }
        },
    };

    const Helper = (function () {
        // function getStickyNavHeight() {
        //   const stickyNav =
        //     document.querySelector("#second-navigation-v4") ||
        //     document.querySelector(".huawei-v3 .second-navigation") ||
        //     null;
        //   if (stickyNav) {
        //     stickyNavHeight = stickyNav.offsetHeight;
        //     MAIN.style.setProperty("--sticky-nav-height", stickyNavHeight + "px");
        //   }
        // }

        function setupPopupVideo() {
            $(".fancybox-button").on("click", function (e) {
                e.preventDefault();
                $(this).initH5player({
                    path: "",
                    target: "fancybox",
                    autostart: true,
                    beforeShow: "",
                    afterClose: "",
                });
            });
        }

        function videoAndPop() {
            $(".phoinix-container video").each(function () {
                if (Browser.isUC || Browser.isWeChat || Browser.isIE) {
                    $(this).remove();
                    $(".phoinix-container .wx-img").show();
                    return;
                } else if (isPortrait) {
                    $(this).attr("poster", $(this).data("poster-m"));
                    $(this)
                        .find("source")
                        .attr("src", $(this).find("source").data("src-m"));
                } else {
                    $(this).attr("poster", $(this).data("poster-p"));
                    $(this)
                        .find("source")
                        .attr("src", $(this).find("source").data("src-p"));
                }
                $(this).trigger("load");
            });

             $(".play-video").on("click", function (e) {
                 
                 e.preventDefault();
                 $(this).initH5player({
                     path: "",
                     target: "fancybox",
                     autostart: true,
                     beforeShow: "",
                     afterClose: "",
                 });
             });

        }

        function setupObjectFit() {
            if (!Support.objectFit) {
                const objects = document.querySelectorAll(".object-fit");
                objects.forEach(function (object) {
                    let objectRatio = object.clientWidth / object.clientHeight,
                        media = object.querySelector(".fit-cover"),
                        mediaRatio = media.clientWidth / media.clientHeight;
                    if (objectRatio > mediaRatio) {
                        object.classList.remove("fit-width");
                        object.classList.add("fit-height");
                    } else {
                        object.classList.remove("fit-height");
                        object.classList.add("fit-width");
                    }
                });
            }
        }

        function setupKeyFeatures() {
            const cards = MAIN.querySelectorAll(".feature-item");
            cards.forEach(function (card) {
                card.addEventListener("mouseenter", function () {
                    this.classList.add("is-hover");
                });
                card.addEventListener("touchstart", function () {
                    this.classList.add("is-hover");
                });
                card.addEventListener("mouseleave", function () {
                    this.classList.remove("is-hover");
                });
            });
            U.setupAnchor(".feature-item");
        }

        function setupFootnoteAnchor() {
            U.setupAnchor(".footnote", 120, function (target) {
                const footnotes = MAIN.querySelectorAll(".section-footnote li");
                footnotes.forEach(function (footnote) {
                    footnote.classList.remove("current");
                });
                target.classList.add("current");
            });
        }

        if (history.scrollRestoration) {
            history.scrollRestoration = "manual";
        }

        gsap.defaults({
            duration: 1,
        });

        window.addEventListener("load", function () {
            setupObjectFit();
        });

        function setUpGa() {
            $(".link-click-ga").on('click', function () {
                let $pageName = $(this).attr('data-pagename'),
                    $linkPosition = $(this).attr('data-linkPosition'),
                    $bannerName = $(this).attr('data-bannername'),
                    $linkName = $(this).attr('data-linkName');
                dataLayer.push({
                    'event': 'productBannerBtnClicks',
                    'buttonName': $linkName,
                    'pageName': $pageName,
                    'bannerName': $bannerName,
                    'bannerPosition': $linkPosition,
                });
            });

            $(".feature-item").on('click', function () {
                var data = $(this).data();
                if (window.dataLayer) {
                    window.dataLayer.push({
                        event: "productBannerBtnClicks",
                        buttonName: data.buttonname,
                        pageName: data.pagename,
                        bannerName: data.bannername,
                        bannerPosition: data.position,
                    });
                }
            });
        }

        return {
            setUpGa: setUpGa(),
            // getStickyNavHeight: getStickyNavHeight(),
            setupPopupVideo: setupPopupVideo(),
            setupObjectFit: setupObjectFit(),
            videoAndPop: videoAndPop(),
            setupKeyFeatures: setupKeyFeatures(),
            setupFootnoteAnchor: setupFootnoteAnchor(),
        };
    })();
    function stLoad() {
        if (Support.sticky) {
            if (isPortrait) {
                isPortrait
                let truseens2 = gsap
                    .timeline({
                        scrollTrigger: {
                            trigger: ".phoinix-section-s2",
                            start: "top ",
                            end: "bottom 100%",
                            scrub: 0,
                            ease: "liner",
                        },
                    })
                    .to(".s2-cover", 1, {
                        autoAlpha: 0,
                    })
                    .to(
                        ".s2-mid-title",
                        1,
                        {
                            y: "-60vh",
                            autoAlpha: 0,
                        },
                        "-=1"
                    )
                    .to(
                        ".s2-click-btn",
                        0.6,
                        {
                            y: "0vw",
                        },
                        "-=1"
                    );

                console.info(isZD)
                let truseens6 = gsap
                    .timeline({
                        scrollTrigger: {
                            trigger: isZD ? ".s6-change-bg" : ".phoinix-section-s6",
                            start: isZD ? "top 50%" : "top top",
                            end: "bottom 100%",
                            scrub: 0,
                            ease: "liner",
                        },
                    })
                    .to(".s6-change-section-title-2", 1, {
                        y: 0,
                        autoAlpha: 1,
                    })
                    .to(
                        ".s6-change-section-title-1",
                        0.35,
                        {
                            autoAlpha: 0,
                            y: "-3vw",
                        },
                        "-=1"
                    )
                    .to(
                        ".s6-change-bg-1",
                        0.35,
                        {
                            autoAlpha: 0,
                            y: "-3vw",
                        },
                        "-=1"
                    )
                    .to(
                        ".s6-change-bg-2",
                        1,
                        {
                            y: 0,
                            autoAlpha: 1,
                        },
                        "-=1"
                    );
                if (isPortrait2) {
                    $(".s4-watch-item").mouseenter(function () {
                        $(this).parent().addClass("active");
                    });
                    $(".s4-watch-item").mouseleave(function () {
                        $(this).parent().removeClass("active");
                    });
                } else {
                    let offsa = 40 / 19.2 * windowWidth / 100;
                    var s4Swiper1 = new Swiper(".s4Swiper1", {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                        slidesPerView: 'auto',
                        slidesOffsetAfter: offsa,
                        scrollbar: {
                            el: ".s4-swiper-scrollbar-1",
                        },
                    });

                    var s4Swiper2 = new Swiper(".s4Swiper2", {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                        slidesPerView: 'auto',
                        scrollbar: {
                            el: ".s4-swiper-scrollbar-2",
                        },
                    });
                }
                var s7Swiper = new Swiper(".s7Swiper", {
                    effect: "fade",
                    // fadeEffect: {
                    //   crossFade: true,
                    // },
                    autoplay: true,
                    navigation: {
                        nextEl: ".s7-swiper-button-next",
                        prevEl: ".s7-swiper-button-prev",
                    },
                    pagination: {
                        el: '.s7-swiper-pagination',
                        type: 'bullets'
                    },
                    on: {
                        transitionStart: function () {
                            $(".s7-watch-change-transfrom")[0].setAttribute(
                                "data-dura",
                                this.activeIndex
                            );
                        },
                    },
                });

                $(".s18Swiper").removeClass("swiper-no-swiping");

                var s18Swiper = new Swiper(".s18Swiper", {
                    effect: "fade",
                    scrollbar: {
                        el: ".s18-swiper-scrollbar",
                    },
                    on: {
                        transitionEnd: function () {
                            if (this.activeIndex > 0) {
                                $('.s18-mob-move-point').removeClass('active')
                            } else {
                                $('.s18-mob-move-point').addClass('active')
                            }
                        },
                    },

                });

                var s18SwiperThu = new Swiper(".s18-swiper-thu", {
                    controller: {
                        control: s18Swiper,
                    },
                });

                s18Swiper.controller.control = s18SwiperThu;
                s18SwiperThu.controller.control = s18Swiper;
            } else {
                let svt = $(".section-video-change").length;
                for (let i = 1; i <= svt; i++) {
                    let sst = ".section-video-change-" + i;
                    ScrollTrigger.create({
                        trigger: sst,
                        start: "top 30%",
                        end: "top 30%",
                        onEnter: function () {
                            $(sst).addClass("active");
                        },
                    });
                    ScrollTrigger.create({
                        trigger: sst,
                        start: "top 100%",
                        end: "top 100%",
                        onEnterBack: function () {
                            $(sst).removeClass("active");
                        },
                    });
                }

                let truseens2 = gsap
                    .timeline({
                        scrollTrigger: {
                            trigger: ".phoinix-section-s2",
                            start: "top ",
                            end: "bottom 100%",
                            scrub: 0,
                            ease: "liner",
                        },
                    })
                    .to(".s2-cover", 1, {
                        autoAlpha: 0,
                    })
                    .to(
                        ".s2-mid-title",
                        1,
                        {
                            y: "-70vh",
                            autoAlpha: 0,
                        },
                        "-=1"
                    )
                    .to(
                        ".s2-click-btn",
                        0.6,
                        {
                            y: "0vw",
                        },
                        "-=1"
                    );

                let truseens6 = gsap
                    .timeline({
                        scrollTrigger: {
                            trigger: ".phoinix-section-s6",
                            start: "top ",
                            end: "bottom 100%",
                            scrub: 0,
                            ease: "liner",
                        },
                    })
                    .to(".s6-change-section-title-2", 1, {
                        y: 0,
                        autoAlpha: 1,
                    })
                    .to(
                        ".s6-change-section-title-1",
                        0.35,
                        {
                            autoAlpha: 0,
                            y: "-3vw",
                        },
                        "-=1"
                    )
                    .to(
                        ".s6-change-bg-1",
                        0.35,
                        {
                            autoAlpha: 0,
                            y: "-3vw",
                        },
                        "-=1"
                    )
                    .to(
                        ".s6-change-bg-2",
                        1,
                        {
                            y: 0,
                            autoAlpha: 1,
                        },
                        "-=1"
                    );

                $(".s4-watch-item").mouseenter(function () {
                    $(this).parent().addClass("active");
                });
                $(".s4-watch-item").mouseleave(function () {
                    $(this).parent().removeClass("active");
                });

                var s7Swiper = new Swiper(".s7Swiper", {
                    effect: "fade",
                    fadeEffect: {
                        crossFade: true,
                    }
                });

                let s7l1 = $(".s7-watch-change-item-1").offset().left,
                    s7l2 = $(".s7-watch-change-item-2").offset().left,
                    s7l3 = $(".s7-watch-change-item-3").offset().left,
                    s7l4 = $(".s7-watch-change-item-4").offset().left,
                    s7w4 = (windowWidth * 20.9375) / 100,
                    s7wa = (windowWidth * 81.770833) / 100,
                    s7move5 = s7wa - s7w4 + "px",
                    s7move4 = 0 + "px",
                    s7move3 = (s7l3 - s7l4) * -1 + "px",
                    s7move2 = (s7l2 - s7l4) * -1 + "px",
                    s7move1 = (s7l1 - s7l4) * -1 + "px";
                $(".phoinix-container").css({ "--s7move1": s7move1 });
                // console.info(s7move1,s7move2,s7move3,s7move4,s7move5)

                // $('.s7-watch-change-transfrom').css('transform','translateX('+s7move1+'px)')

                let truseens7 = gsap
                    .timeline({
                        defaults: {
                            ease: "none",
                        },
                        scrollTrigger: {
                            trigger: ".phoinix-section-s7",
                            start: "top ",
                            end: "bottom 100%",
                            scrub: 1,
                            ease: "none",
                        },
                    })
                    .to(".s7-watch-change-transfrom", 1, {
                        x: s7move2,
                        ease: "none",
                    })
                    .to(
                        ".s7-mid-img-1",
                        1,
                        {
                            rotation: "15deg",
                        },
                        "-=1"
                    )
                    .to(
                        ".s7-watch-dial-1",
                        1,
                        {
                            autoAlpha: 1,
                        },
                        "-=1"
                    )
                    .to(".s7-watch-change-transfrom", 1, {
                        x: s7move3,
                    })
                    .to(
                        ".s7-watch-dial-2",
                        1,
                        {
                            autoAlpha: 1,
                        },
                        "-=1"
                    )
                    .to(
                        ".s7-mid-img-1",
                        0.3,
                        {
                            rotation: "30deg",
                        },
                        "-=1"
                    )
                    .to(
                        ".swiper-slide-1",
                        0.3,
                        {
                            autoAlpha: 0,
                        },
                        "-=1"
                    )
                    .to(
                        ".s7-mid-img-2",
                        1,
                        {
                            rotation: "30deg",
                        },
                        "-=1"
                    )
                    .to(".s7-watch-change-transfrom", 1, {
                        x: s7move4,
                    })
                    .to(
                        ".s7-watch-dial-3",
                        1,
                        {
                            autoAlpha: 1,
                        },
                        "-=1"
                    )
                    .to(
                        ".s7-mid-img-2",
                        0.3,
                        {
                            rotation: "45deg",
                        },
                        "-=1"
                    )
                    .to(
                        ".swiper-slide-2",
                        0.3,
                        {
                            autoAlpha: 0,
                        },
                        "-=1"
                    )
                    .to(
                        ".s7-mid-img-3",
                        1,
                        {
                            rotation: "45deg",
                        },
                        "-=1"
                    )
                    .to(".s7-watch-change-transfrom", 1, {
                        x: s7move5,
                    })
                    .to(
                        ".s7-watch-dial-4",
                        1,
                        {
                            autoAlpha: 1,
                        },
                        "-=1"
                    )
                    .to(
                        ".s7-mid-img-3",
                        0.3,
                        {
                            rotation: "60deg",
                        },
                        "-=1"
                    )
                    .to(
                        ".swiper-slide-3",
                        0.3,
                        {
                            autoAlpha: 0,
                        },
                        "-=1"
                    )
                    .to(
                        ".s7-mid-img-4",
                        1,
                        {
                            rotation: "60deg",
                        },
                        "-=1"
                    );

                var s18Swiper = new Swiper(".s18Swiper", {
                    effect: "fade",
                    autoplay: true,
                    on: {
                        slideChangeTransitionStart: function () {
                            $(".s18-section-right-title")[0].setAttribute(
                                "data-active",
                                this.activeIndex
                            );
                        },
                    },
                });

                let s18p1 = $(".s18-section-right-title-item-1 p").height() + "px",
                    s18p2 = $(".s18-section-right-title-item-2 p").height() + "px",
                    s18p3 = $(".s18-section-right-title-item-3 p").height() + "px";

                $(".phoinix-container").css({
                    "--s18p1": s18p1,
                    "--s18p2": s18p2,
                    "--s18p3": s18p3,
                });

                setTimeout(function () {
                    $(".s18-section-right-title-item p").css("height", "0px");
                }, 1000);

                $(".s18-section-right-title")[0].setAttribute("data-active", 0);

                $(".s18-section-right-title-item").click(function () {
                    let a = $(this).attr("data-click");
                    s18Swiper.slideTo(a, 1000, true);
                    $(".s18-section-right-title")[0].setAttribute("data-active", a);
                });
            }
        } else {
            var s18Swiper = new Swiper(".s18Swiper", {
                effect: "fade",
                autoplay: true,
                on: {
                    slideChangeTransitionStart: function () {
                        $(".s18-section-right-title")[0].setAttribute(
                            "data-active",
                            this.activeIndex
                        );
                    },
                },
            });


            setTimeout(function () {
                $(".s18-section-right-title-item p").css("height", "0px");
            }, 1000);

            $(".s18-section-right-title")[0].setAttribute("data-active", 0);

            $(".s18-section-right-title-item").click(function () {
                let a = $(this).attr("data-click");
                s18Swiper.slideTo(a, 1000, true);
                $(".s18-section-right-title")[0].setAttribute("data-active", a);
            });
        }

        let cst = $(".section-change-title").length;
        for (let i = 1; i <= cst; i++) {
            let cct = ".section-change-title-" + i;
            ScrollTrigger.create({
                trigger: cct,
                start: isPortrait ? "top 80%" : "top 85%",
                end: isPortrait ? "top 80%" : "top 85%",
                onEnter: function () {
                    $(cct).addClass("active");
                },
            });
            ScrollTrigger.create({
                trigger: cct,
                start: "top 100%",
                end: "top 100%",
                onEnterBack: function () {
                    $(cct).removeClass("active");
                },
            });
        }

        let x = true;

        $(".s5-show-dial-item-bg-btn-img").click(function () {
            let order = $(this).attr("data-order");
            $(this).parent().toggleClass("active");
            $(".s5-show-dial-item-" + order).toggleClass("active");
            // let s5a = $('.s5-show-dial-item-trigger-'+order).offset().top;

            // if(x){
            //   $('html, body').animate({
            //     scrollTop: s5a
            //   });
            //   x=false;
            // }else{
            //   $('html, body').animate({
            //     scrollTop: s5a-200
            //   });
            //   x=true;
            // }
            setTimeout(function () {
                ScrollTrigger.refresh();
            }, 500);
        });
    }
    function SwiperLoad() { }

    return {
        stLoad: stLoad(),
        SwiperLoad: SwiperLoad(),
    };
});

// Lấy tham chiếu đến cửa sổ pop-up và nút mở cửa sổ
var videoPopup = document.getElementById("videoPopup");
var openPopupButton = document.getElementById("openPopup");
var closePopupButton = document.getElementById("closePopup");
var video = document.getElementById("myVideo");
var htmlElement = document.documentElement; // <html>
var bodyElement = document.body; // <body>
// Khi nút mở cửa sổ được nhấp
// Khi nút mở cửa sổ được nhấp
video.autoplay = false;

// Thiết lập thuộc tính controls để hiển thị các nút điều khiển
video.controls = false;
openPopupButton.addEventListener("click", function () {
    videoPopup.style.display = "block";
    video.load();
    video.autoplay = true;

    // Thiết lập thuộc tính controls để hiển thị các nút điều khiển
    video.controls = true;
    htmlElement.style.overflow = "hidden";
    bodyElement.style.overflow = "hidden";
});
// Thiết lập thuộc tính autoplay để tự động phát video

closePopupButton.addEventListener("click", function () {
    videoPopup.style.display = "none";
    // Khi nút mở cửa sổ được nhấp
    video.autoplay = false;

    // Thiết lập thuộc tính controls để hiển thị các nút điều khiển
    video.controls = false;
    htmlElement.style.overflow = "auto";
    bodyElement.style.overflow = "auto";
});