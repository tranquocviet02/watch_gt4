if (window.aemConfig === undefined) {
            window.aemConfig = {
                apiTimeoutMillisecs: 20000,
                productsEndPoint: {
                    starRatingEndpoint: '/headphones/products/wf-1000xm5/jcr:content.statistics.productId.regions.crr.json',
                    method: 'GET'
                },
                geofilterUS: {
                    isGeolocationPopUpForUSEnabled: 'false',
                    geoLocationUSCookieExpiration: 2147483647,
                    headline: '',
                    subHeadline: '',
                    configuredCountryIcon: '',
                    configuredCountryLinkLabel: '',
                    configuredCountryCode: 'VN',
                    configuredCountryLinkDestination: '',
                    usIcon: "https://www.sony.com/campaign/GLOBAL/geofilter/flags/US.png",
                    usLinkLabel: "United States",
                    usLinkDestination: "https://electronics.sony.com/",
                    usCountryCode: "US"
                },
                cadcEndPoint: {
                    getRatingsUrl: "/bin/cadcratingsandreviewssummary.json",
                    getRatingsUrlMethod: "POST"
                },
                cadcRatingsAndReviewsEndPoint: {
                    getRatingsAndReviewsUrl: "/bin/cadcratingsandreviewscountdistribution.json",
                    getRatingsAndReviewsUrlMethod: "POST"
                },
                bazaarVoiceProductsEndPoint: {
                    getBazaarVoiceProductsUrl: "/apps/bazaarVoiceProducts",
                    getBazaarVoiceProductsUrlMethod: "POST"
                },
                productCompare: {
                    lazyLoadedProductSet: 8
                },
                buyButton: {
                    displayBuyButton: 'true',
                    hideWheretoBuyButton: 'false',
                    priceDominateFlag: 'false',
                    ecUrlLocale: "",
                    dealerLocatorUrl: "",
                    notifyMeUrlLocale: "",
                    ecUrlLocaleStatic: "",
                    dealerLocatorUrlStatic: "",
                    notifyMeUrlLocaleStatic: "",
                    whereToBuyLabel: "Nơi mua sản phẩm",
                    availableSoonLabel: "Sắp ra mắt",
                    notifyMeLabel: "Thông báo cho tôi",
                    openInNewTab: 'true',
                    isArchived: "true",
                    publishStatusOfTransitionPage: 'https://www.sony.com.vn/headphones/products/wf-1000xm5/buy',
                    displayTextAboveBuyButton: 'false',
                    textForWhereToBuy: "",
                    textForNotifyMe: "",
                    whereToBuyLabelEN: "Nơi mua sản phẩm",
                    availableSoonLabelEN: "Sắp ra mắt",
                    notifyMeLabelEN: "Thông báo cho tôi"



                },
                queryParamForRelatedProducts: '?category=',
                languageSelectionCookieName: "lang",
                languageSelectionCookieTTL: 31556952000,
                euLocaleList: ['de_AT', 'fr_BE', 'nl_BE', 'en_GB', 'cs_CZ', 'de_DE', 'da_DK', 'en_EE', 'es_ES', 'fi_FI', 'fr_FR', 'el_GR', 'hr_HR', 'hu_HU', 'en_IE', 'it_IT', 'lt_LT', 'fr_LU', 'de_LU', 'nl_NL', 'no_NO', 'pl_PL', 'pt_PT', 'ro_RO', 'sv_SE', 'sl_SI', 'sk_SK', 'tr_TR', 'he_IL', 'en_LV'],
                hlsDefaultAudioTrack: '',
                crrIncludeLocalSyndicatedReviewsOnly: 'true',
                crrDisplayReviews: 'true',
                crrLocaleSharingCountryName: [{
                    "label": "All Regions",
                    "value": "vi_VN,en_SG,en_MY,en_TH"
                }, {
                    "label": "Việt Nam",
                    "value": "vi_VN"
                }, {
                    "label": "Singapore",
                    "value": "en_SG"
                }, {
                    "label": "Malaysia",
                    "value": "en_MY"
                }, {
                    "label": "Thailand",
                    "value": "en_TH"
                }],
                crrDisplayReplyAcrossLocales: true,
                crrDisplayReviewCountryName: true,
                crrLocaleOfLocaleSharing: ['vi_VN', 'en_SG', 'en_MY', 'en_TH'],
                enableSapHybrisApiButton: 'false',
                siteId: "",
                offsetLimit: 8,
                loadingLabel: "Loading...",
                isGeolocationEnabled: 'false',
                parentRegion: 'vi_VN',
                geoFilterParentRegion: 'VN',
                geoLocationCookieExpiration: '86400000',
                productCodeSeperator: "__",
                pricebuyendpoints: {
                    displayPrice: 'true',
                    displaySecondaryPrice: '',
                    secondaryCurrencyCode: '₫',
                    displayPriceSpecTable: 'true',
                    currencySymbolPosition: 'false',
                    fractionDigit: '0',
                    spaceInBetween: 'true',
                    priceRRP: '       ',
                    priceTax: '       ',
                    priceprefix: 'Giá bán từ',
                    priceSuffix: '',
                    noPriceAvailable: 'Không có giá',
                    priceFootnote: 'Price_Footnote_01',
                    locale: 'vi_VN',
                    isPublish: "true",
                    currencyCode: 'đ',
                    currencyCodeWithIsoFormat: '',
                    groupingSeparator: ',',
                    decimalSeparator: ',',
                    getPriceAndBuyUrl: "/bin/pricebuy.json",
                    getPriceAndBuyMethod: "POST"
                },

                jpdomainendpoints: {
                    coordinationAPI: '',
                    couponAPI: '',
                    loginAPI: '',
                    myfavoriteAPI: '',

                },

                popupNotificationEnabled: '',
                newPeriod: '60',
                energyLabelAndProductFiche: "",
                productFicheLabel: "",
                productFiche: "",
                models: '',
                imageInNewTab: 'false',
                globalLevelEnergyShow: 'false',
                energyLabelGalleryComponent: 'false',
                energyLabelSpecComponent: 'false',
                energyLabelOtherComponent: 'false',
                enableEcSearchRedirection: false,
                ecSearchRedirectionUrl: "",
                displaySupportResult: 'true',
                displayCommunity: 'true',
                displayNarrow: 'true',
                relatedProductsLimit: '',
                locale: 'vi_VN',
                bigBazarCookieValue: '3006011',
                mktChannelBigBazar: 'BigBazar',
                mktChannelOther: 'other',
                strApiErrorInfoJp: 'エラー：%num% サインイン情報が取得できませんでした',
                strNameFixedValJp: 'MMMMM',
                geoLocationCookieExpirationTime: 20000,
                jpHeaderApiTimeout: 15000,
                maxMiniCartCount: 99,
                maxMiniCartDisplay: '99+',
                showMiniCart: true,
                showFavoriteIcon: true,
                pdbProductName: 'pdb',
                sonyStoreProductName: 'sonystore',
                notDisplayCouponPrice: false,
                turnOffSonyStoreArea: false,
                statusCodes: {
                    timeout: '91',
                    disabledLv1: '05',
                    disabledLv2: '06',
                    normalTermination: '00',
                    inputError: '10',
                    internalSystemError: '50',
                    externalSystemError: '51',
                    pageTransition: '01',
                    signinStatusError: '20',
                    salesChannelError: '22',
                    inconsistentSigninState: '30',
                },
                sonyStorePurchaseConfig: {

                    truthyPriceFlagValue: '1',
                    falsyPriceFlagValue: '0',
                    purchaseLeadFlag: '13',
                    thousandGroupingSeperator: ',',
                    preOrderLabelFlag: '222',
                    salesStatusFlags: {
                        emailRegSalesStatusFlag: '11',
                        entryRegSalesStatusFlag: '12',
                        preOrderSalesStatusFlag: '14',
                        onSaleSalesStatusFlag: '20',
                        arrivalUndecidedSalesStatusFlag: '41',
                        emergencyStopSalesStatusFlag: '42',
                        endOfShipmentSalesStatusFlag: '43',
                    },
                    errorSalesStatusFlags: {
                        endOfSalesStatusFlag: '40',
                        after30DaysEndOfSalesStatusFlag: '50',
                        errorSalesStatusFlag: '99',
                    },
                    inventoryIcon: {
                        "0": "",
                        "1": "当日出荷",
                        "2": "翌日出荷",
                        "3": "翌々日出荷"
                    },
                    benefitIcon: [{
                        code: "13",
                        iconText: "24回払いまで分割払手数料1％",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-1per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "39",
                        iconText: "長期保証サービス",
                        linkDestination: "https://www.sony.jp/store/benefit/warranty/index.html",
                        benefitPromotionText: "ソニーストアはメーカー保証内容＜3年＞付き",
                    }, {
                        code: "251",
                        iconText: "長期保証 会員限定特典​",
                        linkDestination: "https://www.sony.jp/store/benefit/warranty/index.html",
                        benefitPromotionText: "",
                    }, {
                        code: "230",
                        iconText: "60回払いまで分割払手数料0％",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-0per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "44",
                        iconText: "長期保証＜3年ワイド＞プレゼント",
                        linkDestination: "https://www.sony.jp/store/benefit/warranty/index.html​",
                        benefitPromotionText: "ソニーストアはメーカー保証内容＋破損・水ぬれ等＜3年＞付き",
                    }, {
                        code: "26",
                        iconText: "大型テレビ設置サービス<ベーシック>付き　設置サービス付きのモデルとなります。",
                        linkDestination: "https://www.sony.jp/store/service/setting/index_bravia.html",
                        benefitPromotionText: "",
                    }, {
                        code: "41",
                        iconText: "60回払いまで分割払手数料1％",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-1per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "43",
                        iconText: "24回払いまで分割払手数料0％",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-0per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "196",
                        iconText: "基本設置サービス",
                        linkDestination: "https://www.sony.jp/store/service/setting/index_bravia.html",
                        benefitPromotionText: "",
                    }, {
                        code: "206",
                        iconText: "メッセージ刻印サービス",
                        linkDestination: "https://www.sony.jp/store/service/engraving/index.html",
                        benefitPromotionText: "",
                    }, {
                        code: "228",
                        iconText: "長期保証＜5年ベーシック＞プレゼント",
                        linkDestination: "https://www.sony.jp/store/benefit/warranty/index.html",
                        benefitPromotionText: "ソニーストアはメーカ保証内容＜5年＞付き",
                    }, {
                        code: "227",
                        iconText: "長期保証＜5年ワイド＞プレゼント",
                        linkDestination: "https://www.sony.jp/store/benefit/warranty/index.html",
                        benefitPromotionText: "ソニーストアはメーカー保証内容＋破損・水ぬれ等＜5年＞付き",
                    }, {
                        code: "244",
                        iconText: "長期保証＜3年ワイド＞付属 キャンペーント",
                        linkDestination: "https://www.sony.jp/store/benefit/warranty/index.html",
                        benefitPromotionText: "今ならメーカー保証内容＋破損・水ぬれ等＜3年＞付き",
                    }, {
                        code: "243",
                        iconText: "長期保証＜5年ベーシック＞付属　キャンペーン",
                        linkDestination: "https://www.sony.jp/store/benefit/warranty/index.html",
                        benefitPromotionText: "今ならメーカ保証内容＜5年＞付き",
                    }, {
                        code: "236",
                        iconText: "デザイン刻印サービス",
                        linkDestination: "https://www.sony.jp/store/service/engraving/index.html",
                        benefitPromotionText: "",
                    }, {
                        code: "235",
                        iconText: "デザイン＆メッセージ刻印サービス",
                        linkDestination: "https://www.sony.jp/store/service/engraving/index.html",
                        benefitPromotionText: "",
                    }, {
                        code: "246",
                        iconText: "36回払いまで分割払手数料1％",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-1per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "247",
                        iconText: "送料無料",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/delivery.html",
                        benefitPromotionText: "",
                    }, {
                        code: "248",
                        iconText: "提携カード決済で3％OFF",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/payment.html#PAGE-TI-01-SONYCARD",
                        benefitPromotionText: "",
                    }, {
                        code: "249",
                        iconText: "刻印サービス",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/stock.html",
                        benefitPromotionText: "",
                    }, {
                        code: "250",
                        iconText: "残価設定クレジット",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/remaining-credit.html",
                        benefitPromotionText: "",
                    }, {
                        code: "252",
                        iconText: "12回払いまで分割払手数料0%",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-0per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "253",
                        iconText: "35回払い月額11,000円",
                        linkDestination: "https://aibo.sony.jp/store/",
                        benefitPromotionText: "",
                    }, {
                        code: "254",
                        iconText: "My Sony ID登録特典優待クーポン",
                        linkDestination: "https://www.sony.jp/msc/entry/index.html",
                        benefitPromotionText: "",
                    }, {
                        code: "255",
                        iconText: "12回払いまで分割払手数料1％",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-1per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "256",
                        iconText: "36回払いまで分割払手数料0％",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-0per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "258",
                        iconText: "35回払い月額11,100円",
                        linkDestination: "https://aibo.sony.jp/store/",
                        benefitPromotionText: "",
                    }, {
                        code: "259",
                        iconText: "35回払い月額11,200円",
                        linkDestination: "https://aibo.sony.jp/store/",
                        benefitPromotionText: "",
                    }, {
                        code: "242",
                        iconText: "",
                        linkDestination: "",
                        benefitPromotionText: "今ならメーカー保証内容＋破損・水ぬれ等＜5年＞付き"
                    }, ]
                }

            }
        } else {
            window.aemConfig.apiTimeoutMillisecs = 20000;
            window.aemConfig.productsEndPoint = {
                    starRatingEndpoint: '/headphones/products/wf-1000xm5/jcr:content.statistics.productId.regions.crr.json',
                    method: 'GET'
                },
                window.aemConfig.geofilterUS = {
                    isGeolocationPopUpForUSEnabled: 'false',
                    geoLocationUSCookieExpiration: 2147483647,
                    headline: '',
                    subHeadline: '',
                    configuredCountryIcon: '',
                    configuredCountryLinkLabel: '',
                    configuredCountryCode: 'VN',
                    configuredCountryLinkDestination: '',
                    usIcon: "https://www.sony.com/campaign/GLOBAL/geofilter/flags/US.png",
                    usLinkLabel: "United States",
                    usLinkDestination: "https://electronics.sony.com/",
                    usCountryCode: "US"
                },
                window.aemConfig.cadcEndPoint = {
                    getRatingsUrl: "/bin/cadcratingsandreviewssummary.json",
                    getRatingsUrlMethod: "POST"
                },
                window.aemConfig.cadcRatingsAndReviewsEndPoint = {
                    getRatingsAndReviewsUrl: "/bin/cadcratingsandreviewscountdistribution.json",
                    getRatingsAndReviewsUrlMethod: "POST"
                },
                window.aemConfig.bazaarVoiceProductsEndPoint = {
                    getBazaarVoiceProductsUrl: "/apps/bazaarVoiceProducts",
                    getBazaarVoiceProductsUrlMethod: "POST"
                },
                window.aemConfig.productCompare = {
                    lazyLoadedProductSet: 8
                },
                window.aemConfig.buyButton = {
                    displayBuyButton: 'true',
                    hideWheretoBuyButton: 'false',
                    priceDominateFlag: 'false',
                    ecUrlLocale: "",
                    dealerLocatorUrl: "",
                    notifyMeUrlLocale: "",
                    ecUrlLocaleStatic: "",
                    dealerLocatorUrlStatic: "",
                    notifyMeUrlLocaleStatic: "",
                    whereToBuyLabel: "Nơi mua sản phẩm",
                    availableSoonLabel: "Sắp ra mắt",
                    notifyMeLabel: "Thông báo cho tôi",
                    openInNewTab: 'true',
                    isArchived: "true",
                    publishStatusOfTransitionPage: 'https://www.sony.com.vn/headphones/products/wf-1000xm5/buy',
                    displayTextAboveBuyButton: 'false',
                    textForWhereToBuy: "",
                    textForNotifyMe: "",
                    whereToBuyLabelEN: "Nơi mua sản phẩm",
                    availableSoonLabelEN: "Sắp ra mắt",
                    notifyMeLabelEN: "Thông báo cho tôi"

                },
                window.aemConfig.crrIncludeLocalSyndicatedReviewsOnly = 'true',
                window.aemConfig.hlsDefaultAudioTrack = '',
                window.aemConfig.crrDisplayReviews = 'true',
                window.aemConfig.euLocaleList = ['de_AT', 'fr_BE', 'nl_BE', 'en_GB', 'cs_CZ', 'de_DE', 'da_DK', 'en_EE', 'es_ES', 'fi_FI', 'fr_FR', 'el_GR', 'hr_HR', 'hu_HU', 'en_IE', 'it_IT', 'lt_LT', 'fr_LU', 'de_LU', 'nl_NL', 'no_NO', 'pl_PL', 'pt_PT', 'ro_RO', 'sv_SE', 'sl_SI', 'sk_SK', 'tr_TR', 'he_IL', 'en_LV'],
                window.aemConfig.crrLocaleSharingCountryName = [{
                    "label": "All Regions",
                    "value": "vi_VN,en_SG,en_MY,en_TH"
                }, {
                    "label": "Việt Nam",
                    "value": "vi_VN"
                }, {
                    "label": "Singapore",
                    "value": "en_SG"
                }, {
                    "label": "Malaysia",
                    "value": "en_MY"
                }, {
                    "label": "Thailand",
                    "value": "en_TH"
                }],
                window.aemConfig.crrDisplayReplyAcrossLocales = true,
                window.aemConfig.crrDisplayReviewCountryName = true,
                window.aemConfig.crrLocaleOfLocaleSharing = ['vi_VN', 'en_SG', 'en_MY', 'en_TH'],
                window.aemConfig.enableSapHybrisApiButton = 'false',
                window.aemConfig.siteId = "",
                window.aemConfig.offsetLimit = 8,
                window.aemConfig.loadingLabel = "Loading...",
                window.aemConfig.isGeolocationEnabled = 'false',
                window.aemConfig.parentRegion = 'vi_VN',
                window.aemConfig.geoFilterParentRegion = 'VN',
                window.aemConfig.geoLocationCookieExpiration = '86400000',
                window.aemConfig.productCodeSeperator = "__",
                window.aemConfig.pricebuyendpoints = {
                    displayPrice: 'true',
                    displaySecondaryPrice: '',
                    secondaryCurrencyCode: '₫',
                    displayPriceSpecTable: 'true',
                    currencySymbolPosition: 'false',
                    fractionDigit: '0',
                    spaceInBetween: 'true',
                    priceRRP: '       ',
                    priceTax: '       ',
                    priceprefix: 'Giá bán từ',
                    priceSuffix: '',
                    noPriceAvailable: 'Không có giá',
                    locale: 'vi_VN',
                    priceFootnote: 'Price_Footnote_01',
                    currencyCode: 'đ',
                    currencyCodeWithIsoFormat: '',
                    groupingSeparator: ',',
                    decimalSeparator: ',',
                    getPriceAndBuyUrl: "/bin/pricebuy.json",
                    getPriceAndBuyMethod: "POST"
                },
                window.aemConfig.jpdomainendpoints = {
                    coordinationAPI: '',
                    couponAPI: '',
                    loginAPI: '',
                    myfavoriteAPI: '',

                },
                window.aemConfig.popupNotificationEnabled = '',
                window.aemConfig.languageSelectionCookieName = "lang",
                window.aemConfig.queryParamForRelatedProducts = '?category=',
                window.aemConfig.languageSelectionCookieTTL = 31556952000,
                window.aemConfig.newPeriod = '60',
                window.aemConfig.energyLabelAndProductFiche = "",
                window.aemConfig.productFicheLabel = "",
                window.aemConfig.productFiche = "",
                window.aemConfig.models = '',
                window.aemConfig.imageInNewTab = 'false',
                window.aemConfig.globalLevelEnergyShow = 'false',
                window.aemConfig.energyLabelGalleryComponent = 'false',
                window.aemConfig.energyLabelSpecComponent = 'false',
                window.aemConfig.energyLabelOtherComponent = 'false',
                window.aemConfig.enableEcSearchRedirection = false,
                window.aemConfig.ecSearchRedirectionUrl = "",
                window.aemConfig.displaySupportResult = 'true',
                window.aemConfig.displayCommunity = 'true',
                window.aemConfig.displayNarrow = 'true',
                window.aemConfig.relatedProductsLimit = '',
                window.aemConfig.locale = 'vi_VN',
                window.aemConfig.isPublish = "true",
                window.aemConfig.bigBazarCookieValue = '3006011',
                window.aemConfig.mktChannelBigBazar = 'BigBazar',
                window.aemConfig.mktChannelOther = 'other',
                window.aemConfig.strApiErrorInfoJp = 'エラー：%num% サインイン情報が取得できませんでした',
                window.aemConfig.strNameFixedValJp = 'MMMMM',
                window.aemConfig.geoLocationCookieExpirationTime = 20000,
                window.aemConfig.jpHeaderApiTimeout = 15000,
                window.aemConfig.maxMiniCartCount = 99,
                window.aemConfig.maxMiniCartDisplay = '99+',
                window.aemConfig.showMiniCart = true,
                window.aemConfig.showFavoriteIcon = true,
                window.aemConfig.pdbProductName = 'pdb',
                window.aemConfig.sonyStoreProductName = 'sonystore',
                window.aemConfig.notDisplayCouponPrice = false,
                window.aemConfig.turnOffSonyStoreArea = false,
                window.aemConfig.statusCodes = {
                    timeout: '91',
                    disabledLv1: '05',
                    disabledLv2: '06',
                    normalTermination: '00',
                    inputError: '10',
                    internalSystemError: '50',
                    externalSystemError: '51',
                    pageTransition: '01',
                    signinStatusError: '20',
                    salesChannelError: '22',
                    inconsistentSigninState: '30',
                },
                window.aemConfig.sonyStorePurchaseConfig = {

                    truthyPriceFlagValue: '1',
                    falsyPriceFlagValue: '0',
                    purchaseLeadFlag: '13',
                    thousandGroupingSeperator: ',',
                    preOrderLabelFlag: '222',
                    salesStatusFlags: {
                        emailRegSalesStatusFlag: '11',
                        entryRegSalesStatusFlag: '12',
                        preOrderSalesStatusFlag: '14',
                        onSaleSalesStatusFlag: '20',
                        arrivalUndecidedSalesStatusFlag: '41',
                        emergencyStopSalesStatusFlag: '42',
                        endOfShipmentSalesStatusFlag: '43',
                    },
                    errorSalesStatusFlags: {
                        endOfSalesStatusFlag: '40',
                        after30DaysEndOfSalesStatusFlag: '50',
                        errorSalesStatusFlag: '99',
                    },
                    inventoryIcon: {
                        "0": "",
                        "1": "当日出荷",
                        "2": "翌日出荷",
                        "3": "翌々日出荷"
                    },
                    benefitIcon: [{
                        code: "13",
                        iconText: "24回払いまで分割払手数料1％",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-1per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "39",
                        iconText: "長期保証サービス",
                        linkDestination: "https://www.sony.jp/store/benefit/warranty/index.html",
                        benefitPromotionText: "ソニーストアはメーカー保証内容＜3年＞付き",
                    }, {
                        code: "251",
                        iconText: "長期保証 会員限定特典​",
                        linkDestination: "https://www.sony.jp/store/benefit/warranty/index.html",
                        benefitPromotionText: "",
                    }, {
                        code: "230",
                        iconText: "60回払いまで分割払手数料0％",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-0per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "44",
                        iconText: "長期保証＜3年ワイド＞プレゼント",
                        linkDestination: "https://www.sony.jp/store/benefit/warranty/index.html​",
                        benefitPromotionText: "ソニーストアはメーカー保証内容＋破損・水ぬれ等＜3年＞付き",
                    }, {
                        code: "26",
                        iconText: "大型テレビ設置サービス<ベーシック>付き　設置サービス付きのモデルとなります。",
                        linkDestination: "https://www.sony.jp/store/service/setting/index_bravia.html",
                        benefitPromotionText: "",
                    }, {
                        code: "41",
                        iconText: "60回払いまで分割払手数料1％",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-1per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "43",
                        iconText: "24回払いまで分割払手数料0％",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-0per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "196",
                        iconText: "基本設置サービス",
                        linkDestination: "https://www.sony.jp/store/service/setting/index_bravia.html",
                        benefitPromotionText: "",
                    }, {
                        code: "206",
                        iconText: "メッセージ刻印サービス",
                        linkDestination: "https://www.sony.jp/store/service/engraving/index.html",
                        benefitPromotionText: "",
                    }, {
                        code: "228",
                        iconText: "長期保証＜5年ベーシック＞プレゼント",
                        linkDestination: "https://www.sony.jp/store/benefit/warranty/index.html",
                        benefitPromotionText: "ソニーストアはメーカ保証内容＜5年＞付き",
                    }, {
                        code: "227",
                        iconText: "長期保証＜5年ワイド＞プレゼント",
                        linkDestination: "https://www.sony.jp/store/benefit/warranty/index.html",
                        benefitPromotionText: "ソニーストアはメーカー保証内容＋破損・水ぬれ等＜5年＞付き",
                    }, {
                        code: "244",
                        iconText: "長期保証＜3年ワイド＞付属 キャンペーント",
                        linkDestination: "https://www.sony.jp/store/benefit/warranty/index.html",
                        benefitPromotionText: "今ならメーカー保証内容＋破損・水ぬれ等＜3年＞付き",
                    }, {
                        code: "243",
                        iconText: "長期保証＜5年ベーシック＞付属　キャンペーン",
                        linkDestination: "https://www.sony.jp/store/benefit/warranty/index.html",
                        benefitPromotionText: "今ならメーカ保証内容＜5年＞付き",
                    }, {
                        code: "236",
                        iconText: "デザイン刻印サービス",
                        linkDestination: "https://www.sony.jp/store/service/engraving/index.html",
                        benefitPromotionText: "",
                    }, {
                        code: "235",
                        iconText: "デザイン＆メッセージ刻印サービス",
                        linkDestination: "https://www.sony.jp/store/service/engraving/index.html",
                        benefitPromotionText: "",
                    }, {
                        code: "246",
                        iconText: "36回払いまで分割払手数料1％",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-1per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "247",
                        iconText: "送料無料",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/delivery.html",
                        benefitPromotionText: "",
                    }, {
                        code: "248",
                        iconText: "提携カード決済で3％OFF",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/payment.html#PAGE-TI-01-SONYCARD",
                        benefitPromotionText: "",
                    }, {
                        code: "249",
                        iconText: "刻印サービス",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/stock.html",
                        benefitPromotionText: "",
                    }, {
                        code: "250",
                        iconText: "残価設定クレジット",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/remaining-credit.html",
                        benefitPromotionText: "",
                    }, {
                        code: "252",
                        iconText: "12回払いまで分割払手数料0%",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-0per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "253",
                        iconText: "35回払い月額11,000円",
                        linkDestination: "https://aibo.sony.jp/store/",
                        benefitPromotionText: "",
                    }, {
                        code: "254",
                        iconText: "My Sony ID登録特典優待クーポン",
                        linkDestination: "https://www.sony.jp/msc/entry/index.html",
                        benefitPromotionText: "",
                    }, {
                        code: "255",
                        iconText: "12回払いまで分割払手数料1％",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-1per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "256",
                        iconText: "36回払いまで分割払手数料0％",
                        linkDestination: "https://www.sony.jp/store/guide/shopping/installment-0per.html",
                        benefitPromotionText: "",
                    }, {
                        code: "258",
                        iconText: "35回払い月額11,100円",
                        linkDestination: "https://aibo.sony.jp/store/",
                        benefitPromotionText: "",
                    }, {
                        code: "259",
                        iconText: "35回払い月額11,200円",
                        linkDestination: "https://aibo.sony.jp/store/",
                        benefitPromotionText: "",
                    }, {
                        code: "242",
                        iconText: "",
                        linkDestination: "",
                        benefitPromotionText: "今ならメーカー保証内容＋破損・水ぬれ等＜5年＞付き"
                    }, ]
                }
        }