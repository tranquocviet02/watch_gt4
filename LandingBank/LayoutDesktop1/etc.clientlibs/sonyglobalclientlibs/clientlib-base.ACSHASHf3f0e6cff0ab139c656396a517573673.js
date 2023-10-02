/*******************************************************************************
 * Copyright 2019 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

/**
 * Element.matches()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Element.closest()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        "use strict";
        var el = this;
        if (!document.documentElement.contains(el)) {
            return null;
        }
        do {
            if (el.matches(s)) {
                return el;
            }
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

/*******************************************************************************
 * Copyright 2019 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var dataLayerEnabled = document.body.hasAttribute("data-cmp-data-layer-enabled");
    var dataLayer = (dataLayerEnabled)? window.adobeDataLayer = window.adobeDataLayer || [] : undefined;

    var NS = "cmp";
    var IS = "accordion";

    var keyCodes = {
        ENTER: 13,
        SPACE: 32,
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]'
    };

    var cssClasses = {
        button: {
            disabled: "cmp-accordion__button--disabled",
            expanded: "cmp-accordion__button--expanded"
        },
        panel: {
            hidden: "cmp-accordion__panel--hidden",
            expanded: "cmp-accordion__panel--expanded"
        }
    };

    var dataAttributes = {
        item: {
            expanded: "data-cmp-expanded"
        }
    };

    var properties = {
        /**
         * Determines whether a single accordion item is forced to be expanded at a time.
         * Expanding one item will collapse all others.
         *
         * @memberof Accordion
         * @type {Boolean}
         * @default false
         */
        "singleExpansion": {
            "default": false,
            "transform": function(value) {
                return !(value === null || typeof value === "undefined");
            }
        }
    };

    /**
     * Accordion Configuration.
     *
     * @typedef {Object} AccordionConfig Represents an Accordion configuration
     * @property {HTMLElement} element The HTMLElement representing the Accordion
     * @property {Object} options The Accordion options
     */

    /**
     * Accordion.
     *
     * @class Accordion
     * @classdesc An interactive Accordion component for toggling panels of related content
     * @param {AccordionConfig} config The Accordion configuration
     */
    function Accordion(config) {
        var that = this;

        if (config && config.element) {
            init(config);
        }

        /**
         * Initializes the Accordion.
         *
         * @private
         * @param {AccordionConfig} config The Accordion configuration
         */
        function init(config) {
            that._config = config;

            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");

            setupProperties(config.options);
            cacheElements(config.element);

            if (that._elements["item"]) {
                // ensures multiple element types are arrays.
                that._elements["item"] = Array.isArray(that._elements["item"]) ? that._elements["item"] : [that._elements["item"]];
                that._elements["button"] = Array.isArray(that._elements["button"]) ? that._elements["button"] : [that._elements["button"]];
                that._elements["panel"] = Array.isArray(that._elements["panel"]) ? that._elements["panel"] : [that._elements["panel"]];

                // Expand the item based on deep-link-id if it matches with any existing accordion item id
                var deepLinkItem = CQ.CoreComponents.container.utils.getDeepLinkItem(that, "item");
                if (deepLinkItem && !deepLinkItem.hasAttribute(dataAttributes.item.expanded)) {
                    setItemExpanded(deepLinkItem, true);
                }

                if (that._properties.singleExpansion) {
                    // No deep linking
                    if (!deepLinkItem) {
                        var expandedItems = getExpandedItems();
                        // no expanded item annotated, force the first item to display.
                        if (expandedItems.length === 0) {
                            toggle(0);
                        }
                        // multiple expanded items annotated, display the last item open.
                        if (expandedItems.length > 1) {
                            toggle(expandedItems.length - 1);
                        }
                    } else {
                        // Deep link case
                        // Collapse the items other than which is deep linked
                        for (var j = 0; j < that._elements["item"].length; j++) {
                            if (that._elements["item"][j].id !== deepLinkItem.id &&
                                that._elements["item"][j].hasAttribute(dataAttributes.item.expanded)) {
                                setItemExpanded(that._elements["item"][j], false);
                            }
                        }
                    }
                }

                refreshItems();
                bindEvents();

                if (window.Granite && window.Granite.author && window.Granite.author.MessageChannel) {
                    /*
                     * Editor message handling:
                     * - subscribe to "cmp.panelcontainer" message requests sent by the editor frame
                     * - check that the message data panel container type is correct and that the id (path) matches this specific Accordion component
                     * - if so, route the "navigate" operation to enact a navigation of the Accordion based on index data
                     */
                    new window.Granite.author.MessageChannel("cqauthor", window).subscribeRequestMessage("cmp.panelcontainer", function(message) {
                        if (message.data && message.data.type === "cmp-accordion" && message.data.id === that._elements.self.dataset["cmpPanelcontainerId"]) {
                            if (message.data.operation === "navigate") {
                                // switch to single expansion mode when navigating in edit mode.
                                var singleExpansion = that._properties.singleExpansion;
                                that._properties.singleExpansion = true;
                                toggle(message.data.index);

                                // revert to the configured state.
                                that._properties.singleExpansion = singleExpansion;
                            }
                        }
                    });
                }
            }
        }

        /**
         * Caches the Accordion elements as defined via the {@code data-accordion-hook="ELEMENT_NAME"} markup API.
         *
         * @private
         * @param {HTMLElement} wrapper The Accordion wrapper element
         */
        function cacheElements(wrapper) {
            that._elements = {};
            that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                if (hook.closest("." + NS + "-" + IS) === that._elements.self) { // only process own accordion elements
                    var capitalized = IS;
                    capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                    var key = hook.dataset[NS + "Hook" + capitalized];
                    if (that._elements[key]) {
                        if (!Array.isArray(that._elements[key])) {
                            var tmp = that._elements[key];
                            that._elements[key] = [tmp];
                        }
                        that._elements[key].push(hook);
                    } else {
                        that._elements[key] = hook;
                    }
                }
            }
        }

        /**
         * Sets up properties for the Accordion based on the passed options.
         *
         * @private
         * @param {Object} options The Accordion options
         */
        function setupProperties(options) {
            that._properties = {};

            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    var property = properties[key];
                    var value = null;

                    if (options && options[key] != null) {
                        value = options[key];

                        // transform the provided option
                        if (property && typeof property.transform === "function") {
                            value = property.transform(value);
                        }
                    }

                    if (value === null) {
                        // value still null, take the property default
                        value = properties[key]["default"];
                    }

                    that._properties[key] = value;
                }
            }
        }

        /**
         * Binds Accordion event handling.
         *
         * @private
         */
        function bindEvents() {
            var buttons = that._elements["button"];
            if (buttons) {
                for (var i = 0; i < buttons.length; i++) {
                    (function(index) {
                        buttons[i].addEventListener("click", function(event) {
                            toggle(index);
                            focusButton(index);
                        });
                        buttons[i].addEventListener("keydown", function(event) {
                            onButtonKeyDown(event, index);
                        });
                    })(i);
                }
            }
        }

        /**
         * Handles button keydown events.
         *
         * @private
         * @param {Object} event The keydown event
         * @param {Number} index The index of the button triggering the event
         */
        function onButtonKeyDown(event, index) {
            var lastIndex = that._elements["button"].length - 1;

            switch (event.keyCode) {
                case keyCodes.ARROW_LEFT:
                case keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        focusButton(index - 1);
                    }
                    break;
                case keyCodes.ARROW_RIGHT:
                case keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        focusButton(index + 1);
                    }
                    break;
                case keyCodes.HOME:
                    event.preventDefault();
                    focusButton(0);
                    break;
                case keyCodes.END:
                    event.preventDefault();
                    focusButton(lastIndex);
                    break;
                case keyCodes.ENTER:
                case keyCodes.SPACE:
                    event.preventDefault();
                    toggle(index);
                    focusButton(index);
                    break;
                default:
                    return;
            }
        }

        /**
         * General handler for toggle of an item.
         *
         * @private
         * @param {Number} index The index of the item to toggle
         */
        function toggle(index) {
            var item = that._elements["item"][index];
            if (item) {
                if (that._properties.singleExpansion) {
                    // ensure only a single item is expanded if single expansion is enabled.
                    for (var i = 0; i < that._elements["item"].length; i++) {
                        if (that._elements["item"][i] !== item) {
                            var expanded = getItemExpanded(that._elements["item"][i]);
                            if (expanded) {
                                setItemExpanded(that._elements["item"][i], false);
                            }
                        }
                    }
                    setItemExpanded(item, true);
                } else {
                    setItemExpanded(item, !getItemExpanded(item));
                }

                if (dataLayerEnabled) {
                    var accordionId = that._elements.self.id;
                    var expandedItems = getExpandedItems()
                        .map(function(item) {
                            return Object.keys(JSON.parse(item.dataset.cmpDataLayer))[0];
                        });

                    var uploadPayload = {component: {}};
                    uploadPayload.component[accordionId] = { shownItems: expandedItems };

                    var removePayload = {component: {}};
                    removePayload.component[accordionId] = { shownItems: undefined };

                    dataLayer.push(removePayload);
                    dataLayer.push(uploadPayload);
                }
            }
        }

        /**
         * Sets an item's expanded state based on the provided flag and refreshes its internals.
         *
         * @private
         * @param {HTMLElement} item The item to mark as expanded, or not expanded
         * @param {Boolean} expanded true to mark the item expanded, false otherwise
         */
        function setItemExpanded(item, expanded) {
            if (expanded) {
                item.setAttribute(dataAttributes.item.expanded, "");
                if (dataLayerEnabled) {
                    dataLayer.push({
                        event: "cmp:show",
                        eventInfo: {
                            path: "component." + getDataLayerId(item.dataset.cmpDataLayer)
                        }
                    });
                }

            } else {
                item.removeAttribute(dataAttributes.item.expanded);
                if (dataLayerEnabled) {
                    dataLayer.push({
                        event: "cmp:hide",
                        eventInfo: {
                            path: "component." + getDataLayerId(item.dataset.cmpDataLayer)
                        }
                    });
                }
            }
            refreshItem(item);
        }

        /**
         * Gets an item's expanded state.
         *
         * @private
         * @param {HTMLElement} item The item for checking its expanded state
         * @returns {Boolean} true if the item is expanded, false otherwise
         */
        function getItemExpanded(item) {
            return item && item.dataset && item.dataset["cmpExpanded"] !== undefined;
        }

        /**
         * Refreshes an item based on its expanded state.
         *
         * @private
         * @param {HTMLElement} item The item to refresh
         */
        function refreshItem(item) {
            var expanded = getItemExpanded(item);
            if (expanded) {
                expandItem(item);
            } else {
                collapseItem(item);
            }
        }

        /**
         * Refreshes all items based on their expanded state.
         *
         * @private
         */
        function refreshItems() {
            for (var i = 0; i < that._elements["item"].length; i++) {
                refreshItem(that._elements["item"][i]);
            }
        }

        /**
         * Returns all expanded items.
         *
         * @private
         * @returns {HTMLElement[]} The expanded items
         */
        function getExpandedItems() {
            var expandedItems = [];

            for (var i = 0; i < that._elements["item"].length; i++) {
                var item = that._elements["item"][i];
                var expanded = getItemExpanded(item);
                if (expanded) {
                    expandedItems.push(item);
                }
            }

            return expandedItems;
        }

        /**
         * Annotates the item and its internals with
         * the necessary style and accessibility attributes to indicate it is expanded.
         *
         * @private
         * @param {HTMLElement} item The item to annotate as expanded
         */
        function expandItem(item) {
            var index = that._elements["item"].indexOf(item);
            if (index > -1) {
                var button = that._elements["button"][index];
                var panel = that._elements["panel"][index];
                button.classList.add(cssClasses.button.expanded);
                button.setAttribute("aria-expanded", true);
                panel.classList.add(cssClasses.panel.expanded);
                panel.classList.remove(cssClasses.panel.hidden);
                panel.setAttribute("aria-hidden", false);

                if (that._properties.singleExpansion) {
                    button.classList.add(cssClasses.button.disabled);
                    button.setAttribute("aria-disabled", true);
                }
            }
        }

        /**
         * Annotates the item and its internals with
         * the necessary style and accessibility attributes to indicate it is not expanded.
         *
         * @private
         * @param {HTMLElement} item The item to annotate as not expanded
         */
        function collapseItem(item) {
            var index = that._elements["item"].indexOf(item);
            if (index > -1) {
                var button = that._elements["button"][index];
                var panel = that._elements["panel"][index];
                button.classList.remove(cssClasses.button.disabled);
                button.classList.remove(cssClasses.button.expanded);
                button.removeAttribute("aria-disabled");
                button.setAttribute("aria-expanded", false);
                panel.classList.add(cssClasses.panel.hidden);
                panel.classList.remove(cssClasses.panel.expanded);
                panel.setAttribute("aria-hidden", true);
            }
        }

        /**
         * Focuses the button at the provided index.
         *
         * @private
         * @param {Number} index The index of the button to focus
         */
        function focusButton(index) {
            var button = that._elements["button"][index];
            button.focus();
        }
    }

    /**
     * Reads options data from the Accordion wrapper element, defined via {@code data-cmp-*} data attributes.
     *
     * @private
     * @param {HTMLElement} element The Accordion element to read options data from
     * @returns {Object} The options read from the component data attributes
     */
    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    /**
     * Parses the dataLayer string and returns the ID
     *
     * @private
     * @param {String} componentDataLayer the dataLayer string
     * @returns {String} dataLayerId or undefined
     */
    function getDataLayerId(componentDataLayer) {
        return Object.keys(JSON.parse(componentDataLayer))[0];
    }

    /**
     * Document ready handler and DOM mutation observers. Initializes Accordion components as necessary.
     *
     * @private
     */
    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Accordion({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Accordion({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }
}());

/*******************************************************************************
 * Copyright 2018 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

/**
 * Element.matches()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Element.closest()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        "use strict";
        var el = this;
        if (!document.documentElement.contains(el)) {
            return null;
        }
        do {
            if (el.matches(s)) {
                return el;
            }
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

/*******************************************************************************
 * Copyright 2018 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var dataLayerEnabled = document.body.hasAttribute("data-cmp-data-layer-enabled");
    var dataLayer = (dataLayerEnabled)? window.adobeDataLayer = window.adobeDataLayer || [] : undefined;

    var NS = "cmp";
    var IS = "tabs";

    var keyCodes = {
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]',
        active: {
            tab: "cmp-tabs__tab--active",
            tabpanel: "cmp-tabs__tabpanel--active"
        }
    };

    /**
     * Tabs Configuration
     *
     * @typedef {Object} TabsConfig Represents a Tabs configuration
     * @property {HTMLElement} element The HTMLElement representing the Tabs
     * @property {Object} options The Tabs options
     */

    /**
     * Tabs
     *
     * @class Tabs
     * @classdesc An interactive Tabs component for navigating a list of tabs
     * @param {TabsConfig} config The Tabs configuration
     */
    function Tabs(config) {
        var that = this;

        if (config && config.element) {
            init(config);
        }

        /**
         * Initializes the Tabs
         *
         * @private
         * @param {TabsConfig} config The Tabs configuration
         */
        function init(config) {
            that._config = config;

            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");

            cacheElements(config.element);
            that._active = getActiveIndex(that._elements["tab"]);

            if (that._elements.tabpanel) {
                refreshActive();
                bindEvents();
            }

            // Show the tab based on deep-link-id if it matches with any existing tab item id
            var deepLinkItemIdx = CQ.CoreComponents.container.utils.getDeepLinkItemIdx(that, "tabpanel");
            if (deepLinkItemIdx) {
                var deepLinkItem = that._elements["tab"][deepLinkItemIdx];
                if (deepLinkItem && that._elements["tab"][that._active].id !== deepLinkItem.id) {
                    navigateAndFocusTab(deepLinkItemIdx);
                }
            }

            if (window.Granite && window.Granite.author && window.Granite.author.MessageChannel) {
                /*
                 * Editor message handling:
                 * - subscribe to "cmp.panelcontainer" message requests sent by the editor frame
                 * - check that the message data panel container type is correct and that the id (path) matches this specific Tabs component
                 * - if so, route the "navigate" operation to enact a navigation of the Tabs based on index data
                 */
                new window.Granite.author.MessageChannel("cqauthor", window).subscribeRequestMessage("cmp.panelcontainer", function(message) {
                    if (message.data && message.data.type === "cmp-tabs" && message.data.id === that._elements.self.dataset["cmpPanelcontainerId"]) {
                        if (message.data.operation === "navigate") {
                            navigate(message.data.index);
                        }
                    }
                });
            }
        }

        /**
         * Returns the index of the active tab, if no tab is active returns 0
         *
         * @param {Array} tabs Tab elements
         * @returns {Number} Index of the active tab, 0 if none is active
         */
        function getActiveIndex(tabs) {
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].classList.contains(selectors.active.tab)) {
                        return i;
                    }
                }
            }
            return 0;
        }

        /**
         * Caches the Tabs elements as defined via the {@code data-tabs-hook="ELEMENT_NAME"} markup API
         *
         * @private
         * @param {HTMLElement} wrapper The Tabs wrapper element
         */
        function cacheElements(wrapper) {
            that._elements = {};
            that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                if (hook.closest("." + NS + "-" + IS) === that._elements.self) { // only process own tab elements
                    var capitalized = IS;
                    capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                    var key = hook.dataset[NS + "Hook" + capitalized];
                    if (that._elements[key]) {
                        if (!Array.isArray(that._elements[key])) {
                            var tmp = that._elements[key];
                            that._elements[key] = [tmp];
                        }
                        that._elements[key].push(hook);
                    } else {
                        that._elements[key] = hook;
                    }
                }
            }
        }

        /**
         * Binds Tabs event handling
         *
         * @private
         */
        function bindEvents() {
            var tabs = that._elements["tab"];
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    (function(index) {
                        tabs[i].addEventListener("click", function(event) {
                            navigateAndFocusTab(index);
                        });
                        tabs[i].addEventListener("keydown", function(event) {
                            onKeyDown(event);
                        });
                    })(i);
                }
            }
        }

        /**
         * Handles tab keydown events
         *
         * @private
         * @param {Object} event The keydown event
         */
        function onKeyDown(event) {
            var index = that._active;
            var lastIndex = that._elements["tab"].length - 1;

            switch (event.keyCode) {
                case keyCodes.ARROW_LEFT:
                case keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        navigateAndFocusTab(index - 1);
                    }
                    break;
                case keyCodes.ARROW_RIGHT:
                case keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        navigateAndFocusTab(index + 1);
                    }
                    break;
                case keyCodes.HOME:
                    event.preventDefault();
                    navigateAndFocusTab(0);
                    break;
                case keyCodes.END:
                    event.preventDefault();
                    navigateAndFocusTab(lastIndex);
                    break;
                default:
                    return;
            }
        }

        /**
         * Refreshes the tab markup based on the current {@code Tabs#_active} index
         *
         * @private
         */
        function refreshActive() {
            var tabpanels = that._elements["tabpanel"];
            var tabs = that._elements["tab"];

            if (tabpanels) {
                if (Array.isArray(tabpanels)) {
                    for (var i = 0; i < tabpanels.length; i++) {
                        if (i === parseInt(that._active)) {
                            tabpanels[i].classList.add(selectors.active.tabpanel);
                            tabpanels[i].removeAttribute("aria-hidden");
                            tabs[i].classList.add(selectors.active.tab);
                            tabs[i].setAttribute("aria-selected", true);
                            tabs[i].setAttribute("tabindex", "0");
                        } else {
                            tabpanels[i].classList.remove(selectors.active.tabpanel);
                            tabpanels[i].setAttribute("aria-hidden", true);
                            tabs[i].classList.remove(selectors.active.tab);
                            tabs[i].setAttribute("aria-selected", false);
                            tabs[i].setAttribute("tabindex", "-1");
                        }
                    }
                } else {
                    // only one tab
                    tabpanels.classList.add(selectors.active.tabpanel);
                    tabs.classList.add(selectors.active.tab);
                }
            }
        }

        /**
         * Focuses the element and prevents scrolling the element into view
         *
         * @param {HTMLElement} element Element to focus
         */
        function focusWithoutScroll(element) {
            var x = window.scrollX || window.pageXOffset;
            var y = window.scrollY || window.pageYOffset;
            element.focus();
            window.scrollTo(x, y);
        }

        /**
         * Navigates to the tab at the provided index
         *
         * @private
         * @param {Number} index The index of the tab to navigate to
         */
        function navigate(index) {
            that._active = index;
            refreshActive();
        }

        /**
         * Navigates to the item at the provided index and ensures the active tab gains focus
         *
         * @private
         * @param {Number} index The index of the item to navigate to
         */
        function navigateAndFocusTab(index) {
            var exActive = that._active;
            navigate(index);
            focusWithoutScroll(that._elements["tab"][index]);

            if (dataLayerEnabled) {

                var activeItem = getDataLayerId(that._elements.tabpanel[index].dataset.cmpDataLayer);
                var exActiveItem = getDataLayerId(that._elements.tabpanel[exActive].dataset.cmpDataLayer);

                dataLayer.push({
                    event: "cmp:show",
                    eventInfo: {
                        path: "component." + activeItem
                    }
                });

                dataLayer.push({
                    event: "cmp:hide",
                    eventInfo: {
                        path: "component." + exActiveItem
                    }
                });

                var tabsId = that._elements.self.id;
                var uploadPayload = { component: {} };
                uploadPayload.component[tabsId] = { shownItems: [activeItem] };

                var removePayload = { component: {} };
                removePayload.component[tabsId] = { shownItems: undefined };

                dataLayer.push(removePayload);
                dataLayer.push(uploadPayload);
            }
        }
    }

    /**
     * Reads options data from the Tabs wrapper element, defined via {@code data-cmp-*} data attributes
     *
     * @private
     * @param {HTMLElement} element The Tabs element to read options data from
     * @returns {Object} The options read from the component data attributes
     */
    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    /**
     * Parses the dataLayer string and returns the ID
     *
     * @private
     * @param {String} componentDataLayer the dataLayer string
     * @returns {String} dataLayerId or undefined
     */
    function getDataLayerId(componentDataLayer) {
        return Object.keys(JSON.parse(componentDataLayer))[0];
    }

    /**
     * Document ready handler and DOM mutation observers. Initializes Tabs components as necessary.
     *
     * @private
     */
    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Tabs({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Tabs({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

}());

/*******************************************************************************
 * Copyright 2018 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var dataLayerEnabled = document.body.hasAttribute("data-cmp-data-layer-enabled");
    var dataLayer = (dataLayerEnabled)? window.adobeDataLayer = window.adobeDataLayer || [] : undefined;

    var NS = "cmp";
    var IS = "carousel";

    var keyCodes = {
        SPACE: 32,
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]'
    };

    var properties = {
        /**
         * Determines whether the Carousel will automatically transition between slides
         *
         * @memberof Carousel
         * @type {Boolean}
         * @default false
         */
        "autoplay": {
            "default": false,
            "transform": function(value) {
                return !(value === null || typeof value === "undefined");
            }
        },
        /**
         * Duration (in milliseconds) before automatically transitioning to the next slide
         *
         * @memberof Carousel
         * @type {Number}
         * @default 5000
         */
        "delay": {
            "default": 5000,
            "transform": function(value) {
                value = parseFloat(value);
                return !isNaN(value) ? value : null;
            }
        },
        /**
         * Determines whether automatic pause on hovering the carousel is disabled
         *
         * @memberof Carousel
         * @type {Boolean}
         * @default false
         */
        "autopauseDisabled": {
            "default": false,
            "transform": function(value) {
                return !(value === null || typeof value === "undefined");
            }
        }
    };

    /**
     * Carousel Configuration
     *
     * @typedef {Object} CarouselConfig Represents a Carousel configuration
     * @property {HTMLElement} element The HTMLElement representing the Carousel
     * @property {Object} options The Carousel options
     */

    /**
     * Carousel
     *
     * @class Carousel
     * @classdesc An interactive Carousel component for navigating a list of generic items
     * @param {CarouselConfig} config The Carousel configuration
     */
    function Carousel(config) {
        var that = this;

        if (config && config.element) {
            init(config);
        }

        /**
         * Initializes the Carousel
         *
         * @private
         * @param {CarouselConfig} config The Carousel configuration
         */
        function init(config) {
            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");

            setupProperties(config.options);
            cacheElements(config.element);

            that._active = 0;
            that._paused = false;

            if (that._elements.item) {
                refreshActive();
                bindEvents();
                resetAutoplayInterval();
                refreshPlayPauseActions();
            }

            if (window.Granite && window.Granite.author && window.Granite.author.MessageChannel) {
                /*
                 * Editor message handling:
                 * - subscribe to "cmp.panelcontainer" message requests sent by the editor frame
                 * - check that the message data panel container type is correct and that the id (path) matches this specific Carousel component
                 * - if so, route the "navigate" operation to enact a navigation of the Carousel based on index data
                 */
                new window.Granite.author.MessageChannel("cqauthor", window).subscribeRequestMessage("cmp.panelcontainer", function(message) {
                    if (message.data && message.data.type === "cmp-carousel" && message.data.id === that._elements.self.dataset["cmpPanelcontainerId"]) {
                        if (message.data.operation === "navigate") {
                            navigate(message.data.index);
                        }
                    }
                });
            }
        }

        /**
         * Caches the Carousel elements as defined via the {@code data-carousel-hook="ELEMENT_NAME"} markup API
         *
         * @private
         * @param {HTMLElement} wrapper The Carousel wrapper element
         */
        function cacheElements(wrapper) {
            that._elements = {};
            that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                var capitalized = IS;
                capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                var key = hook.dataset[NS + "Hook" + capitalized];
                if (that._elements[key]) {
                    if (!Array.isArray(that._elements[key])) {
                        var tmp = that._elements[key];
                        that._elements[key] = [tmp];
                    }
                    that._elements[key].push(hook);
                } else {
                    that._elements[key] = hook;
                }
            }
        }

        /**
         * Sets up properties for the Carousel based on the passed options.
         *
         * @private
         * @param {Object} options The Carousel options
         */
        function setupProperties(options) {
            that._properties = {};

            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    var property = properties[key];
                    var value = null;

                    if (options && options[key] != null) {
                        value = options[key];

                        // transform the provided option
                        if (property && typeof property.transform === "function") {
                            value = property.transform(value);
                        }
                    }

                    if (value === null) {
                        // value still null, take the property default
                        value = properties[key]["default"];
                    }

                    that._properties[key] = value;
                }
            }
        }

        /**
         * Binds Carousel event handling
         *
         * @private
         */
        function bindEvents() {
            if (that._elements["previous"]) {
                that._elements["previous"].addEventListener("click", function() {
                    var index = getPreviousIndex();
                    navigate(index);
                    if (dataLayerEnabled) {
                        dataLayer.push({
                            event: "cmp:show",
                            eventInfo: {
                                path: "component." + getDataLayerId(that._elements.item[index].dataset.cmpDataLayer)
                            }
                        });
                    }
                });
            }

            if (that._elements["next"]) {
                that._elements["next"].addEventListener("click", function() {
                    var index = getNextIndex();
                    navigate(index);
                    if (dataLayerEnabled) {
                        dataLayer.push({
                            event: "cmp:show",
                            eventInfo: {
                                path: "component." + getDataLayerId(that._elements.item[index].dataset.cmpDataLayer)
                            }
                        });
                    }
                });
            }

            var indicators = that._elements["indicator"];
            if (indicators) {
                for (var i = 0; i < indicators.length; i++) {
                    (function(index) {
                        indicators[i].addEventListener("click", function(event) {
                            navigateAndFocusIndicator(index);
                        });
                    })(i);
                }
            }

            if (that._elements["pause"]) {
                if (that._properties.autoplay) {
                    that._elements["pause"].addEventListener("click", onPauseClick);
                }
            }

            if (that._elements["play"]) {
                if (that._properties.autoplay) {
                    that._elements["play"].addEventListener("click", onPlayClick);
                }
            }

            that._elements.self.addEventListener("keydown", onKeyDown);

            if (!that._properties.autopauseDisabled) {
                that._elements.self.addEventListener("mouseenter", onMouseEnter);
                that._elements.self.addEventListener("mouseleave", onMouseLeave);
            }
        }

        /**
         * Handles carousel keydown events
         *
         * @private
         * @param {Object} event The keydown event
         */
        function onKeyDown(event) {
            var index = that._active;
            var lastIndex = that._elements["indicator"].length - 1;

            switch (event.keyCode) {
                case keyCodes.ARROW_LEFT:
                case keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        navigateAndFocusIndicator(index - 1);
                    }
                    break;
                case keyCodes.ARROW_RIGHT:
                case keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        navigateAndFocusIndicator(index + 1);
                    }
                    break;
                case keyCodes.HOME:
                    event.preventDefault();
                    navigateAndFocusIndicator(0);
                    break;
                case keyCodes.END:
                    event.preventDefault();
                    navigateAndFocusIndicator(lastIndex);
                    break;
                case keyCodes.SPACE:
                    if (that._properties.autoplay && (event.target !== that._elements["previous"] && event.target !== that._elements["next"])) {
                        event.preventDefault();
                        if (!that._paused) {
                            pause();
                        } else {
                            play();
                        }
                    }
                    if (event.target === that._elements["pause"]) {
                        that._elements["play"].focus();
                    }
                    if (event.target === that._elements["play"]) {
                        that._elements["pause"].focus();
                    }
                    break;
                default:
                    return;
            }
        }

        /**
         * Handles carousel mouseenter events
         *
         * @private
         * @param {Object} event The mouseenter event
         */
        function onMouseEnter(event) {
            clearAutoplayInterval();
        }

        /**
         * Handles carousel mouseleave events
         *
         * @private
         * @param {Object} event The mouseleave event
         */
        function onMouseLeave(event) {
            resetAutoplayInterval();
        }

        /**
         * Handles pause element click events
         *
         * @private
         * @param {Object} event The click event
         */
        function onPauseClick(event) {
            pause();
            that._elements["play"].focus();
        }

        /**
         * Handles play element click events
         *
         * @private
         * @param {Object} event The click event
         */
        function onPlayClick() {
            play();
            that._elements["pause"].focus();
        }

        /**
         * Pauses the playing of the Carousel. Sets {@code Carousel#_paused} marker.
         * Only relevant when autoplay is enabled
         *
         * @private
         */
        function pause() {
            that._paused = true;
            clearAutoplayInterval();
            refreshPlayPauseActions();
        }

        /**
         * Enables the playing of the Carousel. Sets {@code Carousel#_paused} marker.
         * Only relevant when autoplay is enabled
         *
         * @private
         */
        function play() {
            that._paused = false;

            // If the Carousel is hovered, don't begin auto transitioning until the next mouse leave event
            var hovered = false;
            if (that._elements.self.parentElement) {
                hovered = that._elements.self.parentElement.querySelector(":hover") === that._elements.self;
            }
            if (that._properties.autopauseDisabled || !hovered) {
                resetAutoplayInterval();
            }

            refreshPlayPauseActions();
        }

        /**
         * Refreshes the play/pause action markup based on the {@code Carousel#_paused} state
         *
         * @private
         */
        function refreshPlayPauseActions() {
            setActionDisabled(that._elements["pause"], that._paused);
            setActionDisabled(that._elements["play"], !that._paused);
        }

        /**
         * Refreshes the item markup based on the current {@code Carousel#_active} index
         *
         * @private
         */
        function refreshActive() {
            var items = that._elements["item"];
            var indicators = that._elements["indicator"];

            if (items) {
                if (Array.isArray(items)) {
                    for (var i = 0; i < items.length; i++) {
                        if (i === parseInt(that._active)) {
                            items[i].classList.add("cmp-carousel__item--active");
                            items[i].removeAttribute("aria-hidden");
                            indicators[i].classList.add("cmp-carousel__indicator--active");
                            indicators[i].setAttribute("aria-selected", true);
                            indicators[i].setAttribute("tabindex", "0");
                        } else {
                            items[i].classList.remove("cmp-carousel__item--active");
                            items[i].setAttribute("aria-hidden", true);
                            indicators[i].classList.remove("cmp-carousel__indicator--active");
                            indicators[i].setAttribute("aria-selected", false);
                            indicators[i].setAttribute("tabindex", "-1");
                        }
                    }
                } else {
                    // only one item
                    items.classList.add("cmp-carousel__item--active");
                    indicators.classList.add("cmp-carousel__indicator--active");
                }
            }
        }

        /**
         * Focuses the element and prevents scrolling the element into view
         *
         * @param {HTMLElement} element Element to focus
         */
        function focusWithoutScroll(element) {
            var x = window.scrollX || window.pageXOffset;
            var y = window.scrollY || window.pageYOffset;
            element.focus();
            window.scrollTo(x, y);
        }

        /**
         * Retrieves the next active index, with looping
         *
         * @private
         * @returns {Number} Index of the next carousel item
         */
        function getNextIndex() {
            return that._active === (that._elements["item"].length - 1) ? 0 : that._active + 1;
        }

        /**
         * Retrieves the previous active index, with looping
         *
         * @private
         * @returns {Number} Index of the previous carousel item
         */
        function getPreviousIndex() {
            return that._active === 0 ? (that._elements["item"].length - 1) : that._active - 1;
        }

        /**
         * Navigates to the item at the provided index
         *
         * @private
         * @param {Number} index The index of the item to navigate to
         */
        function navigate(index) {
            if (index < 0 || index > (that._elements["item"].length - 1)) {
                return;
            }

            that._active = index;
            refreshActive();

            if (dataLayerEnabled) {
                var carouselId = that._elements.self.id;
                var activeItem = getDataLayerId(that._elements.item[index].dataset.cmpDataLayer);
                var updatePayload = { component: {} };
                updatePayload.component[carouselId] = { shownItems: [activeItem] };

                var removePayload = { component: {} };
                removePayload.component[carouselId] = { shownItems: undefined };

                dataLayer.push(removePayload);
                dataLayer.push(updatePayload);
            }

            // reset the autoplay transition interval following navigation, if not already hovering the carousel
            if (that._elements.self.parentElement) {
                if (that._elements.self.parentElement.querySelector(":hover") !== that._elements.self) {
                    resetAutoplayInterval();
                }
            }
        }

        /**
         * Navigates to the item at the provided index and ensures the active indicator gains focus
         *
         * @private
         * @param {Number} index The index of the item to navigate to
         */
        function navigateAndFocusIndicator(index) {
            navigate(index);
            focusWithoutScroll(that._elements["indicator"][index]);

            if (dataLayerEnabled) {
                dataLayer.push({
                    event: "cmp:show",
                    eventInfo: {
                        path: "component." + getDataLayerId(that._elements.item[index].dataset.cmpDataLayer)
                    }
                });
            }
        }

        /**
         * Starts/resets automatic slide transition interval
         *
         * @private
         */
        function resetAutoplayInterval() {
            if (that._paused || !that._properties.autoplay) {
                return;
            }
            clearAutoplayInterval();
            that._autoplayIntervalId = window.setInterval(function() {
                if (document.visibilityState && document.hidden) {
                    return;
                }
                var indicators = that._elements["indicators"];
                if (indicators !== document.activeElement && indicators.contains(document.activeElement)) {
                    // if an indicator has focus, ensure we switch focus following navigation
                    navigateAndFocusIndicator(getNextIndex());
                } else {
                    navigate(getNextIndex());
                }
            }, that._properties.delay);
        }

        /**
         * Clears/pauses automatic slide transition interval
         *
         * @private
         */
        function clearAutoplayInterval() {
            window.clearInterval(that._autoplayIntervalId);
            that._autoplayIntervalId = null;
        }

        /**
         * Sets the disabled state for an action and toggles the appropriate CSS classes
         *
         * @private
         * @param {HTMLElement} action Action to disable
         * @param {Boolean} [disable] {@code true} to disable, {@code false} to enable
         */
        function setActionDisabled(action, disable) {
            if (!action) {
                return;
            }
            if (disable !== false) {
                action.disabled = true;
                action.classList.add("cmp-carousel__action--disabled");
            } else {
                action.disabled = false;
                action.classList.remove("cmp-carousel__action--disabled");
            }
        }
    }

    /**
     * Reads options data from the Carousel wrapper element, defined via {@code data-cmp-*} data attributes
     *
     * @private
     * @param {HTMLElement} element The Carousel element to read options data from
     * @returns {Object} The options read from the component data attributes
     */
    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    /**
     * Parses the dataLayer string and returns the ID
     *
     * @private
     * @param {String} componentDataLayer the dataLayer string
     * @returns {String} dataLayerId or undefined
     */
    function getDataLayerId(componentDataLayer) {
        return Object.keys(JSON.parse(componentDataLayer))[0];
    }

    /**
     * Document ready handler and DOM mutation observers. Initializes Carousel components as necessary.
     *
     * @private
     */
    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Carousel({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Carousel({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

}());

/*******************************************************************************
 * Copyright 2017 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
if (window.Element && !Element.prototype.closest) {
    // eslint valid-jsdoc: "off"
    Element.prototype.closest =
        function(s) {
            "use strict";
            var matches = (this.document || this.ownerDocument).querySelectorAll(s);
            var el      = this;
            var i;
            do {
                i = matches.length;
                while (--i >= 0 && matches.item(i) !== el) {
                    // continue
                }
            } while ((i < 0) && (el = el.parentElement));
            return el;
        };
}

if (window.Element && !Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            "use strict";
            var matches = (this.document || this.ownerDocument).querySelectorAll(s);
            var i       = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {
                // continue
            }
            return i > -1;
        };
}

if (!Object.assign) {
    Object.assign = function(target, varArgs) { // .length of function is 2
        "use strict";
        if (target === null) {
            throw new TypeError("Cannot convert undefined or null to object");
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource !== null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

(function(arr) {
    "use strict";
    arr.forEach(function(item) {
        if (item.hasOwnProperty("remove")) {
            return;
        }
        Object.defineProperty(item, "remove", {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                this.parentNode.removeChild(this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

/*******************************************************************************
 * Copyright 2016 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var NS = "cmp";
    var IS = "image";

    var EMPTY_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    var LAZY_THRESHOLD_DEFAULT = 0;
    var SRC_URI_TEMPLATE_WIDTH_VAR = "{.width}";

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]',
        image: '[data-cmp-hook-image="image"]',
        map: '[data-cmp-hook-image="map"]',
        area: '[data-cmp-hook-image="area"]'
    };

    var lazyLoader = {
        "cssClass": "cmp-image__image--is-loading",
        "style": {
            "height": 0,
            "padding-bottom": "" // will be replaced with % ratio
        }
    };

    var properties = {
        /**
         * An array of alternative image widths (in pixels).
         * Used to replace a {.width} variable in the src property with an optimal width if a URI template is provided.
         *
         * @memberof Image
         * @type {Number[]}
         * @default []
         */
        "widths": {
            "default": [],
            "transform": function(value) {
                var widths = [];
                value.split(",").forEach(function(item) {
                    item = parseFloat(item);
                    if (!isNaN(item)) {
                        widths.push(item);
                    }
                });
                return widths;
            }
        },
        /**
         * Indicates whether the image should be rendered lazily.
         *
         * @memberof Image
         * @type {Boolean}
         * @default false
         */
        "lazy": {
            "default": false,
            "transform": function(value) {
                return !(value === null || typeof value === "undefined");
            }
        },
        /**
         * The lazy threshold.
         * This is the number of pixels, in advance of becoming visible, when an lazy-loading image should begin
         * to load.
         *
         * @memberof Image
         * @type {Number}
         * @default 0
         */
        "lazythreshold": {
            "default": 0,
            "transform": function(value) {
                const val =  parseInt(value);
                if (isNaN(val)) {
                    return LAZY_THRESHOLD_DEFAULT;
                }
                return val;
            }
        },
        /**
         * The image source.
         *
         * Can be a simple image source, or a URI template representation that
         * can be variable expanded - useful for building an image configuration with an alternative width.
         * e.g. '/path/image.coreimg{.width}.jpeg/1506620954214.jpeg'
         *
         * @memberof Image
         * @type {String}
         */
        "src": {
            "transform": function(value) {
                return decodeURIComponent(value);
            }
        }
    };

    var devicePixelRatio = window.devicePixelRatio || 1;

    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    function Image(config) {
        var that = this;

        function init(config) {
            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");

            setupProperties(config.options);
            cacheElements(config.element);

            if (!that._elements.noscript) {
                return;
            }

            that._elements.container = that._elements.link ? that._elements.link : that._elements.self;

            unwrapNoScript();

            if (that._properties.lazy) {
                addLazyLoader();
            }

            if (that._elements.map) {
                that._elements.image.addEventListener("load", onLoad);
            }

            window.addEventListener("resize", onWindowResize);
            ["focus", "click", "load", "transitionend", "animationend", "scroll"].forEach(function(name) {
                document.addEventListener(name, that.update);
            });

            that._elements.image.addEventListener("cmp-image-redraw", that.update);
            that.update();
        }

        function loadImage() {
            var hasWidths = that._properties.widths && that._properties.widths.length > 0;
            var replacement = hasWidths ? "." + getOptimalWidth() : "";
            var url = that._properties.src.replace(SRC_URI_TEMPLATE_WIDTH_VAR, replacement);

            if (that._elements.image.getAttribute("src") !== url) {
                that._elements.image.setAttribute("src", url);
                if (!hasWidths) {
                    window.removeEventListener("scroll", that.update);
                }
            }

            if (that._lazyLoaderShowing) {
                that._elements.image.addEventListener("load", removeLazyLoader);
            }
        }

        function getOptimalWidth() {
            var container = that._elements.self;
            var containerWidth = container.clientWidth;
            while (containerWidth === 0 && container.parentNode) {
                container = container.parentNode;
                containerWidth = container.clientWidth;
            }
            var optimalWidth = containerWidth * devicePixelRatio;
            var len = that._properties.widths.length;
            var key = 0;

            while ((key < len - 1) && (that._properties.widths[key] < optimalWidth)) {
                key++;
            }

            return that._properties.widths[key].toString();
        }

        function addLazyLoader() {
            var width = that._elements.image.getAttribute("width");
            var height = that._elements.image.getAttribute("height");

            if (width && height) {
                var ratio = (height / width) * 100;
                var styles = lazyLoader.style;

                styles["padding-bottom"] = ratio + "%";

                for (var s in styles) {
                    if (styles.hasOwnProperty(s)) {
                        that._elements.image.style[s] = styles[s];
                    }
                }
            }
            that._elements.image.setAttribute("src", EMPTY_PIXEL);
            that._elements.image.classList.add(lazyLoader.cssClass);
            that._lazyLoaderShowing = true;
        }

        function unwrapNoScript() {
            var markup = decodeNoscript(that._elements.noscript.textContent.trim());
            var parser = new DOMParser();

            // temporary document avoids requesting the image before removing its src
            var temporaryDocument = parser.parseFromString(markup, "text/html");
            var imageElement = temporaryDocument.querySelector(selectors.image);
            imageElement.removeAttribute("src");
            that._elements.container.insertBefore(imageElement, that._elements.noscript);

            var mapElement = temporaryDocument.querySelector(selectors.map);
            if (mapElement) {
                that._elements.container.insertBefore(mapElement, that._elements.noscript);
            }

            that._elements.noscript.parentNode.removeChild(that._elements.noscript);
            if (that._elements.container.matches(selectors.image)) {
                that._elements.image = that._elements.container;
            } else {
                that._elements.image = that._elements.container.querySelector(selectors.image);
            }

            that._elements.map = that._elements.container.querySelector(selectors.map);
            that._elements.areas = that._elements.container.querySelectorAll(selectors.area);
        }

        function removeLazyLoader() {
            that._elements.image.classList.remove(lazyLoader.cssClass);
            for (var property in lazyLoader.style) {
                if (lazyLoader.style.hasOwnProperty(property)) {
                    that._elements.image.style[property] = "";
                }
            }
            that._elements.image.removeEventListener("load", removeLazyLoader);
            that._lazyLoaderShowing = false;
        }

        function isLazyVisible() {
            if (that._elements.container.offsetParent === null) {
                return false;
            }

            var wt = window.pageYOffset;
            var wb = wt + document.documentElement.clientHeight;
            var et = that._elements.container.getBoundingClientRect().top + wt;
            var eb = et + that._elements.container.clientHeight;

            return eb >= wt - that._properties.lazythreshold && et <= wb + that._properties.lazythreshold;
        }

        function resizeAreas() {
            if (that._elements.areas && that._elements.areas.length > 0) {
                for (var i = 0; i < that._elements.areas.length; i++) {
                    var width = that._elements.image.width;
                    var height = that._elements.image.height;

                    if (width && height) {
                        var relcoords = that._elements.areas[i].dataset.cmpRelcoords;
                        if (relcoords) {
                            var relativeCoordinates = relcoords.split(",");
                            var coordinates = new Array(relativeCoordinates.length);

                            for (var j = 0; j < coordinates.length; j++) {
                                if (j % 2 === 0) {
                                    coordinates[j] = parseInt(relativeCoordinates[j] * width);
                                } else {
                                    coordinates[j] = parseInt(relativeCoordinates[j] * height);
                                }
                            }

                            that._elements.areas[i].coords = coordinates;
                        }
                    }
                }
            }
        }

        function cacheElements(wrapper) {
            that._elements = {};
            that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                var capitalized = IS;
                capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                var key = hook.dataset[NS + "Hook" + capitalized];
                that._elements[key] = hook;
            }
        }

        function setupProperties(options) {
            that._properties = {};

            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    var property = properties[key];
                    if (options && options[key] != null) {
                        if (property && typeof property.transform === "function") {
                            that._properties[key] = property.transform(options[key]);
                        } else {
                            that._properties[key] = options[key];
                        }
                    } else {
                        that._properties[key] = properties[key]["default"];
                    }
                }
            }
        }

        function onWindowResize() {
            that.update();
            resizeAreas();
        }

        function onLoad() {
            resizeAreas();
        }

        that.update = function() {
            if (that._properties.lazy) {
                if (isLazyVisible()) {
                    loadImage();
                }
            } else {
                loadImage();
            }
        };

        if (config && config.element) {
            init(config);
        }
    }

    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Image({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body             = document.querySelector("body");
        var observer         = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Image({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

    /*
        on drag & drop of the component into a parsys, noscript's content will be escaped multiple times by the editor which creates
        the DOM for editing; the HTML parser cannot be used here due to the multiple escaping
     */
    function decodeNoscript(text) {
        text = text.replace(/&(amp;)*lt;/g, "<");
        text = text.replace(/&(amp;)*gt;/g, ">");
        return text;
    }

})();

/*******************************************************************************
 * Copyright 2017 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var NS = "cmp";
    var IS = "search";

    var DELAY = 300; // time before fetching new results when the user is typing a search string
    var LOADING_DISPLAY_DELAY = 300; // minimum time during which the loading indicator is displayed
    var PARAM_RESULTS_OFFSET = "resultsOffset";

    var keyCodes = {
        TAB: 9,
        ENTER: 13,
        ESCAPE: 27,
        ARROW_UP: 38,
        ARROW_DOWN: 40
    };

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]',
        item: {
            self: "[data-" + NS + "-hook-" + IS + '="item"]',
            title: "[data-" + NS + "-hook-" + IS + '="itemTitle"]',
            focused: "." + NS + "-search__item--is-focused"
        }
    };

    var properties = {
        /**
         * The minimum required length of the search term before results are fetched.
         *
         * @memberof Search
         * @type {Number}
         * @default 3
         */
        minLength: {
            "default": 3,
            transform: function(value) {
                value = parseFloat(value);
                return isNaN(value) ? null : value;
            }
        },
        /**
         * The maximal number of results fetched by a search request.
         *
         * @memberof Search
         * @type {Number}
         * @default 10
         */
        resultsSize: {
            "default": 10,
            transform: function(value) {
                value = parseFloat(value);
                return isNaN(value) ? null : value;
            }
        }
    };

    var idCount = 0;

    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    function toggleShow(element, show) {
        if (element) {
            if (show !== false) {
                element.style.display = "block";
                element.setAttribute("aria-hidden", false);
            } else {
                element.style.display = "none";
                element.setAttribute("aria-hidden", true);
            }
        }
    }

    function serialize(form) {
        var query = [];
        if (form && form.elements) {
            for (var i = 0; i < form.elements.length; i++) {
                var node = form.elements[i];
                if (!node.disabled && node.name) {
                    var param = [node.name, encodeURIComponent(node.value)];
                    query.push(param.join("="));
                }
            }
        }
        return query.join("&");
    }

    function mark(node, regex) {
        if (!node || !regex) {
            return;
        }

        // text nodes
        if (node.nodeType === 3) {
            var nodeValue = node.nodeValue;
            var match = regex.exec(nodeValue);

            if (nodeValue && match) {
                var element = document.createElement("mark");
                element.className = NS + "-search__item-mark";
                element.appendChild(document.createTextNode(match[0]));

                var after = node.splitText(match.index);
                after.nodeValue = after.nodeValue.substring(match[0].length);
                node.parentNode.insertBefore(element, after);
            }
        } else if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++) {
                // recurse
                mark(node.childNodes[i], regex);
            }
        }
    }

    function Search(config) {
        if (config.element) {
            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");
        }

        this._cacheElements(config.element);
        this._setupProperties(config.options);

        this._action = this._elements.form.getAttribute("action");
        this._resultsOffset = 0;
        this._hasMoreResults = true;

        this._elements.input.addEventListener("input", this._onInput.bind(this));
        this._elements.input.addEventListener("focus", this._onInput.bind(this));
        this._elements.input.addEventListener("keydown", this._onKeydown.bind(this));
        this._elements.clear.addEventListener("click", this._onClearClick.bind(this));
        document.addEventListener("click", this._onDocumentClick.bind(this));
        this._elements.results.addEventListener("scroll", this._onScroll.bind(this));

        this._makeAccessible();
    }

    Search.prototype._displayResults = function() {
        if (this._elements.input.value.length === 0) {
            toggleShow(this._elements.clear, false);
            this._cancelResults();
        } else if (this._elements.input.value.length < this._properties.minLength) {
            toggleShow(this._elements.clear, true);
        } else {
            this._updateResults();
            toggleShow(this._elements.clear, true);
        }
    };

    Search.prototype._onScroll = function(event) {
        // fetch new results when the results to be scrolled down are less than the visible results
        if (this._elements.results.scrollTop + 2 * this._elements.results.clientHeight >= this._elements.results.scrollHeight) {
            this._resultsOffset += this._properties.resultsSize;
            this._displayResults();
        }
    };

    Search.prototype._onInput = function(event) {
        var self = this;
        self._cancelResults();
        // start searching when the search term reaches the minimum length
        this._timeout = setTimeout(function() {
            self._displayResults();
        }, DELAY);
    };

    Search.prototype._onKeydown = function(event) {
        var self = this;

        switch (event.keyCode) {
            case keyCodes.TAB:
                if (self._resultsOpen()) {
                    event.preventDefault();
                }
                break;
            case keyCodes.ENTER:
                event.preventDefault();
                if (self._resultsOpen()) {
                    var focused = self._elements.results.querySelector(selectors.item.focused);
                    if (focused) {
                        focused.click();
                    }
                }
                break;
            case keyCodes.ESCAPE:
                self._cancelResults();
                break;
            case keyCodes.ARROW_UP:
                if (self._resultsOpen()) {
                    event.preventDefault();
                    self._stepResultFocus(true);
                }
                break;
            case keyCodes.ARROW_DOWN:
                if (self._resultsOpen()) {
                    event.preventDefault();
                    self._stepResultFocus();
                } else {
                    // test the input and if necessary fetch and display the results
                    self._onInput();
                }
                break;
            default:
                return;
        }
    };

    Search.prototype._onClearClick = function(event) {
        event.preventDefault();
        this._elements.input.value = "";
        toggleShow(this._elements.clear, false);
        toggleShow(this._elements.results, false);
    };

    Search.prototype._onDocumentClick = function(event) {
        var inputContainsTarget =  this._elements.input.contains(event.target);
        var resultsContainTarget = this._elements.results.contains(event.target);

        if (!(inputContainsTarget || resultsContainTarget)) {
            toggleShow(this._elements.results, false);
        }
    };

    Search.prototype._resultsOpen = function() {
        return this._elements.results.style.display !== "none";
    };

    Search.prototype._makeAccessible = function() {
        var id = NS + "-search-results-" + idCount;
        this._elements.input.setAttribute("aria-owns", id);
        this._elements.results.id = id;
        idCount++;
    };

    Search.prototype._generateItems = function(data, results) {
        var self = this;

        data.forEach(function(item) {
            var el = document.createElement("span");
            el.innerHTML = self._elements.itemTemplate.innerHTML;
            el.querySelectorAll(selectors.item.title)[0].appendChild(document.createTextNode(item.title));
            el.querySelectorAll(selectors.item.self)[0].setAttribute("href", item.url);
            results.innerHTML += el.innerHTML;
        });
    };

    Search.prototype._markResults = function() {
        var nodeList = this._elements.results.querySelectorAll(selectors.item.self);
        var escapedTerm = this._elements.input.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        var regex = new RegExp("(" + escapedTerm + ")", "gi");

        for (var i = this._resultsOffset - 1; i < nodeList.length; ++i) {
            var result = nodeList[i];
            mark(result, regex);
        }
    };

    Search.prototype._stepResultFocus = function(reverse) {
        var results = this._elements.results.querySelectorAll(selectors.item.self);
        var focused = this._elements.results.querySelector(selectors.item.focused);
        var newFocused;
        var index = Array.prototype.indexOf.call(results, focused);
        var focusedCssClass = NS + "-search__item--is-focused";

        if (results.length > 0) {

            if (!reverse) {
                // highlight the next result
                if (index < 0) {
                    results[0].classList.add(focusedCssClass);
                } else if (index + 1 < results.length) {
                    results[index].classList.remove(focusedCssClass);
                    results[index + 1].classList.add(focusedCssClass);
                }

                // if the last visible result is partially hidden, scroll up until it's completely visible
                newFocused = this._elements.results.querySelector(selectors.item.focused);
                if (newFocused) {
                    var bottomHiddenHeight = newFocused.offsetTop + newFocused.offsetHeight - this._elements.results.scrollTop - this._elements.results.clientHeight;
                    if (bottomHiddenHeight > 0) {
                        this._elements.results.scrollTop += bottomHiddenHeight;
                    } else {
                        this._onScroll();
                    }
                }

            } else {
                // highlight the previous result
                if (index >= 1) {
                    results[index].classList.remove(focusedCssClass);
                    results[index - 1].classList.add(focusedCssClass);
                }

                // if the first visible result is partially hidden, scroll down until it's completely visible
                newFocused = this._elements.results.querySelector(selectors.item.focused);
                if (newFocused) {
                    var topHiddenHeight = this._elements.results.scrollTop - newFocused.offsetTop;
                    if (topHiddenHeight > 0) {
                        this._elements.results.scrollTop -= topHiddenHeight;
                    }
                }
            }
        }
    };

    Search.prototype._updateResults = function() {
        var self = this;
        if (self._hasMoreResults) {
            var request = new XMLHttpRequest();
            var url = self._action + "?" + serialize(self._elements.form) + "&" + PARAM_RESULTS_OFFSET + "=" + self._resultsOffset;

            request.open("GET", url, true);
            request.onload = function() {
                // when the results are loaded: hide the loading indicator and display the search icon after a minimum period
                setTimeout(function() {
                    toggleShow(self._elements.loadingIndicator, false);
                    toggleShow(self._elements.icon, true);
                }, LOADING_DISPLAY_DELAY);
                if (request.status >= 200 && request.status < 400) {
                    // success status
                    var data = JSON.parse(request.responseText);
                    if (data.length > 0) {
                        self._generateItems(data, self._elements.results);
                        self._markResults();
                        toggleShow(self._elements.results, true);
                    } else {
                        self._hasMoreResults = false;
                    }
                    // the total number of results is not a multiple of the fetched results:
                    // -> we reached the end of the query
                    if (self._elements.results.querySelectorAll(selectors.item.self).length % self._properties.resultsSize > 0) {
                        self._hasMoreResults = false;
                    }
                } else {
                    // error status
                }
            };
            // when the results are loading: display the loading indicator and hide the search icon
            toggleShow(self._elements.loadingIndicator, true);
            toggleShow(self._elements.icon, false);
            request.send();
        }
    };

    Search.prototype._cancelResults = function() {
        clearTimeout(this._timeout);
        this._elements.results.scrollTop = 0;
        this._resultsOffset = 0;
        this._hasMoreResults = true;
        this._elements.results.innerHTML = "";
    };

    Search.prototype._cacheElements = function(wrapper) {
        this._elements = {};
        this._elements.self = wrapper;
        var hooks = this._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

        for (var i = 0; i < hooks.length; i++) {
            var hook = hooks[i];
            var capitalized = IS;
            capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
            var key = hook.dataset[NS + "Hook" + capitalized];
            this._elements[key] = hook;
        }
    };

    Search.prototype._setupProperties = function(options) {
        this._properties = {};

        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                var property = properties[key];
                if (options && options[key] != null) {
                    if (property && typeof property.transform === "function") {
                        this._properties[key] = property.transform(options[key]);
                    } else {
                        this._properties[key] = options[key];
                    }
                } else {
                    this._properties[key] = properties[key]["default"];
                }
            }
        }
    };

    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Search({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Search({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

})();

/*******************************************************************************
 * Copyright 2016 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var NS = "cmp";
    var IS = "formText";
    var IS_DASH = "form-text";

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]'
    };

    var properties = {
        /**
         * A validation message to display if there is a type mismatch between the user input and expected input.
         *
         * @type {String}
         */
        constraintMessage: {
        },
        /**
         * A validation message to display if no input is supplied, but input is expected for the field.
         *
         * @type {String}
         */
        requiredMessage: {
        }
    };

    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    function FormText(config) {
        if (config.element) {
            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");
        }

        this._cacheElements(config.element);
        this._setupProperties(config.options);

        this._elements.input.addEventListener("invalid", this._onInvalid.bind(this));
        this._elements.input.addEventListener("input", this._onInput.bind(this));
    }

    FormText.prototype._onInvalid = function(event) {
        event.target.setCustomValidity("");
        if (event.target.validity.typeMismatch) {
            if (this._properties.constraintMessage) {
                event.target.setCustomValidity(this._properties.constraintMessage);
            }
        } else if (event.target.validity.valueMissing) {
            if (this._properties.requiredMessage) {
                event.target.setCustomValidity(this._properties.requiredMessage);
            }
        }
    };

    FormText.prototype._onInput = function(event) {
        event.target.setCustomValidity("");
    };

    FormText.prototype._cacheElements = function(wrapper) {
        this._elements = {};
        this._elements.self = wrapper;
        var hooks = this._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS_DASH + "]");
        for (var i = 0; i < hooks.length; i++) {
            var hook = hooks[i];
            var capitalized = IS;
            capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
            var key = hook.dataset[NS + "Hook" + capitalized];
            this._elements[key] = hook;
        }
    };

    FormText.prototype._setupProperties = function(options) {
        this._properties = {};

        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                var property = properties[key];
                if (options && options[key] != null) {
                    if (property && typeof property.transform === "function") {
                        this._properties[key] = property.transform(options[key]);
                    } else {
                        this._properties[key] = options[key];
                    }
                } else {
                    this._properties[key] = properties[key]["default"];
                }
            }
        }
    };

    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new FormText({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new FormText({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

})();

/*******************************************************************************
 * Copyright 2020 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var NS = "cmp";
    var IS = "pdfviewer";
    var SDK_URL = "https://documentcloud.adobe.com/view-sdk/main.js";
    var SDK_READY_EVENT = "adobe_dc_view_sdk.ready";

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]',
        sdkScript: 'script[src="' + SDK_URL + '"]'
    };

    function initSDK() {
        var sdkIncluded = document.querySelectorAll(selectors.sdkScript).length > 0;
        if (!window.adobe_dc_view_sdk && !sdkIncluded) {
            var dcv = document.createElement("script");
            dcv.type = "text/javascript";
            dcv.src = SDK_URL;
            document.body.appendChild(dcv);
        }
    }

    function previewPdf(component) {
        // prevents multiple initialization
        component.removeAttribute("data-" + NS + "-is");

        // add the view sdk to the page
        initSDK();

        // manage the preview
        if (component.dataset && component.id) {
            if (window.AdobeDC && window.AdobeDC.View) {
                dcView(component);
            } else {
                document.addEventListener(SDK_READY_EVENT, function () {
                    dcView(component);
                });
            }
        }
    }

    function dcView(component) {
        var adobeDCView = new AdobeDC.View({
            clientId: component.dataset.cmpClientId,
            divId: component.id + '-content',
            reportSuiteId: component.dataset.cmpReportSuiteId
        });
        adobeDCView.previewFile({
            content:{location: {url: component.dataset.cmpDocumentPath}},
            metaData:{fileName: component.dataset.cmpDocumentFileName}
        }, JSON.parse(component.dataset.cmpViewerConfigJson));
    }

    /**
     * Document ready handler and DOM mutation observers. Initializes Accordion components as necessary.
     *
     * @private
     */
    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            previewPdf(elements[i]);
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                previewPdf(element);
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });

    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }
}());

/*******************************************************************************
 * Copyright 2020 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

/**
 * Element.matches()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Element.closest()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        "use strict";
        var el = this;
        if (!document.documentElement.contains(el)) {
            return null;
        }
        do {
            if (el.matches(s)) {
                return el;
            }
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
        value: function(predicate) {
            "use strict";
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== "function") {
                throw TypeError("predicate must be a function");
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return undefined.
            return undefined;
        },
        configurable: true,
        writable: true
    });
}

"use strict";function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_unsupportedIterableToArray(t,e)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArrayLimit(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var n=[],r=!0,o=!1,i=void 0;try{for(var u,a=t[Symbol.iterator]();!(r=(u=a.next()).done)&&(n.push(u.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==a.return||a.return()}finally{if(o)throw i}}return n}}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _createForOfIteratorHelper(t){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(t=_unsupportedIterableToArray(t))){var e=0,n=function(){};return{s:n,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,o,i=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return i=t.done,t},e:function(t){u=!0,o=t},f:function(){try{i||null==r.return||r.return()}finally{if(u)throw o}}}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}!function i(u,a,c){function f(e,t){if(!a[e]){if(!u[e]){var n="function"==typeof require&&require;if(!t&&n)return n(e,!0);if(s)return s(e,!0);var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}var o=a[e]={exports:{}};u[e][0].call(o.exports,function(t){return f(u[e][1][t]||t)},o,o.exports,i,u,a,c)}return a[e].exports}for(var s="function"==typeof require&&require,t=0;t<c.length;t++)f(c[t]);return f}({1:[function(t,tr,er){(function(Zn){(function(){function n(t,e){for(var n=-1,r=null==t?0:t.length,o=0,i=[];++n<r;){var u=t[n];e(u,n,t)&&(i[o++]=u)}return i}function i(t,e){for(var n=-1,r=null==t?0:t.length,o=Array(r);++n<r;)o[n]=e(t[n],n,t);return o}function f(t,e){for(var n=-1,r=e.length,o=t.length;++n<r;)t[o+n]=e[n];return t}function d(t,e){for(var n=-1,r=null==t?0:t.length;++n<r;)if(e(t[n],n,t))return!0;return!1}function t(e){return function(t){return e(t)}}function g(t){var n=-1,r=Array(t.size);return t.forEach(function(t,e){r[++n]=[e,t]}),r}function e(e,n){return function(t){return e(n(t))}}function v(t,e){return"__proto__"==e?It:t[e]}function b(t){var e=-1,n=Array(t.size);return t.forEach(function(t){n[++e]=t}),n}function r(){}function o(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function u(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function a(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function _(t){var e=-1,n=null==t?0:t.length;for(this.__data__=new a;++e<n;)this.add(t[e])}function m(t){this.size=(this.__data__=new u(t)).size}function c(t,e){var n=qn(t),r=!n&&Wn(t),o=!n&&!r&&Gn(t),i=!n&&!r&&!o&&Kn(t),u=n||r||o||i,a=u?function(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}(t.length,String):[],c=a.length;for(var f in t)!e&&!Ve.call(t,f)||u&&("length"==f||o&&("offset"==f||"parent"==f)||i&&("buffer"==f||"byteLength"==f||"byteOffset"==f)||X(f,c))||a.push(f);return a}function j(t,e,n){(n===It||ft(t[e],n))&&(n!==It||e in t)||l(t,e,n)}function O(t,e,n){var r=t[e];Ve.call(t,e)&&ft(r,n)&&(n!==It||e in t)||l(t,e,n)}function s(t,e){for(var n=t.length;n--;)if(ft(t[n][0],e))return n;return-1}function l(t,e,n){"__proto__"==e&&on?on(t,e,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[e]=n}function w(n,r,o,t,e,i){var u,a=r&zt,c=r&Ft,f=r&Ct;if(o&&(u=e?o(n,t,e,i):o(n)),u!==It)return u;if(!ht(n))return n;var s=qn(n);if(s){if(u=function(t){var e=t.length,n=new t.constructor(e);return e&&"string"==typeof t[0]&&Ve.call(t,"index")&&(n.index=t.index,n.input=t.input),n}(n),!a)return R(n,u)}else{var l=Cn(n),p=l==Gt||l==Bt;if(Gn(n))return D(n,a);if(l==Xt||l==Ut||p&&!e){if(u=c||p?{}:K(n),!a)return c?function(t,e){return U(t,Fn(t),e)}(n,function(t,e){return t&&U(e,wt(e),t)}(u,n)):function(t,e){return U(t,zn(t),e)}(n,function(t,e){return t&&U(e,Ot(e),t)}(u,n))}else{if(!Ee[l])return e?n:{};u=function(t,e,n){var r=t.constructor;switch(e){case ue:return M(t);case Vt:case Wt:return new r(+t);case ae:return function(t,e){return new t.constructor(e?M(t.buffer):t.buffer,t.byteOffset,t.byteLength)}(t,n);case ce:case fe:case se:case le:case pe:case ye:case he:case ve:case de:return P(t,n);case Jt:return new r;case Kt:case ne:return new r(t);case te:return function(t){var e=new t.constructor(t.source,je.exec(t));return e.lastIndex=t.lastIndex,e}(t);case ee:return new r;case re:return function(t){return wn?Object(wn.call(t)):{}}(t)}}(n,l,a)}}var y=(i=i||new m).get(n);if(y)return y;if(i.set(n,u),Jn(n))return n.forEach(function(t){u.add(w(t,r,o,t,n,i))}),u;if(Bn(n))return n.forEach(function(t,e){u.set(e,w(t,r,o,e,n,i))}),u;var h=s?It:(f?c?q:W:c?wt:Ot)(n);return function(t,e){for(var n=-1,r=null==t?0:t.length;++n<r&&!1!==e(t[n],n,t););}(h||n,function(t,e){h&&(t=n[e=t]),O(u,e,w(t,r,o,e,n,i))}),u}function p(t,e){for(var n=0,r=(e=C(e,t)).length;null!=t&&n<r;)t=t[rt(e[n++])];return n&&n==r?t:It}function y(t,e,n){var r=e(t);return qn(t)?r:f(r,n(t))}function h(t){return null==t?t===It?oe:Qt:rn&&rn in Object(t)?function(t){var e=Ve.call(t,rn),n=t[rn];try{t[rn]=It;var r=!0}catch(t){}var o=qe.call(t);return r&&(e?t[rn]=n:delete t[rn]),o}(t):function(t){return qe.call(t)}(t)}function A(t,e){return null!=t&&Ve.call(t,e)}function E(t,e){return null!=t&&e in Object(t)}function T(t){return vt(t)&&h(t)==Ut}function L(t,e,n,r,o){return t===e||(null==t||null==e||!vt(t)&&!vt(e)?t!=t&&e!=e:function(t,e,n,r,o,i){var u=qn(t),a=qn(e),c=u?Ht:Cn(t),f=a?Ht:Cn(e),s=(c=c==Ut?Xt:c)==Xt,l=(f=f==Ut?Xt:f)==Xt,p=c==f;if(p&&Gn(t)){if(!Gn(e))return!1;s=!(u=!0)}if(p&&!s)return i=i||new m,u||Kn(t)?V(t,e,n,r,o,i):function(t,e,n,r,o,i,u){switch(n){case ae:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case ue:return!(t.byteLength!=e.byteLength||!i(new Qe(t),new Qe(e)));case Vt:case Wt:case Kt:return ft(+t,+e);case qt:return t.name==e.name&&t.message==e.message;case te:case ne:return t==e+"";case Jt:var a=g;case ee:var c=r&Dt;if(a=a||b,t.size!=e.size&&!c)return!1;var f=u.get(t);if(f)return f==e;r|=Mt,u.set(t,e);var s=V(a(t),a(e),r,o,i,u);return u.delete(t),s;case re:if(wn)return wn.call(t)==wn.call(e)}return!1}(t,e,c,n,r,o,i);if(!(n&Dt)){var y=s&&Ve.call(t,"__wrapped__"),h=l&&Ve.call(e,"__wrapped__");if(y||h){var v=y?t.value():t,d=h?e.value():e;return i=i||new m,o(v,d,n,r,i)}}return!!p&&(i=i||new m,function(t,e,n,r,o,i){var u=n&Dt,a=W(t),c=a.length;if(c!=W(e).length&&!u)return!1;for(var f=c;f--;){var s=a[f];if(!(u?s in e:Ve.call(e,s)))return!1}var l=i.get(t);if(l&&i.get(e))return l==e;var p=!0;i.set(t,e),i.set(e,t);for(var y=u;++f<c;){s=a[f];var h=t[s],v=e[s];if(r)var d=u?r(v,h,s,e,t,i):r(h,v,s,t,e,i);if(!(d===It?h===v||o(h,v,n,r,i):d)){p=!1;break}y=y||"constructor"==s}if(p&&!y){var g=t.constructor,b=e.constructor;g!=b&&"constructor"in t&&"constructor"in e&&!("function"==typeof g&&g instanceof g&&"function"==typeof b&&b instanceof b)&&(p=!1)}return i.delete(t),i.delete(e),p}(t,e,n,r,o,i))}(t,e,n,r,L,o))}function S(t){return!(!ht(t)||function(t){return!!We&&We in t}(t))&&(pt(t)?Be:Oe).test(ot(t))}function x(t){return"function"==typeof t?t:null==t?Et:"object"==_typeof(t)?qn(t)?function(n,r){return Y(n)&&tt(r)?et(rt(n),r):function(t){var e=mt(t,n);return e===It&&e===r?jt(t,n):L(r,e,Dt|Mt)}}(t[0],t[1]):function(e){var n=function(t){for(var e=Ot(t),n=e.length;n--;){var r=e[n],o=t[r];e[n]=[r,o,tt(o)]}return e}(e);return 1==n.length&&n[0][2]?et(n[0][0],n[0][1]):function(t){return t===e||function(t,e,n,r){var o=n.length,i=o,u=!r;if(null==t)return!i;for(t=Object(t);o--;){var a=n[o];if(u&&a[2]?a[1]!==t[a[0]]:!(a[0]in t))return!1}for(;++o<i;){var c=(a=n[o])[0],f=t[c],s=a[1];if(u&&a[2]){if(f===It&&!(c in t))return!1}else{var l=new m;if(r)var p=r(f,s,c,t,e,l);if(!(p===It?L(s,f,Dt|Mt,r,l):p))return!1}}return!0}(t,e,n)}}(t):Lt(t)}function I(t){if(!Z(t))return cn(t);var e=[];for(var n in Object(t))Ve.call(t,n)&&"constructor"!=n&&e.push(n);return e}function N(t){if(!ht(t))return function(t){var e=[];if(null!=t)for(var n in Object(t))e.push(n);return e}(t);var e=Z(t),n=[];for(var r in t)("constructor"!=r||!e&&Ve.call(t,r))&&n.push(r);return n}function k(r,o,i,u,a){r!==o&&Nn(o,function(t,e){if(ht(t))a=a||new m,function(t,e,n,r,o,i,u){var a=v(t,n),c=v(e,n),f=u.get(c);if(f)return j(t,n,f);var s=i?i(a,c,n+"",t,e,u):It,l=s===It;if(l){var p=qn(c),y=!p&&Gn(c),h=!p&&!y&&Kn(c);s=c,p||y||h?s=qn(a)?a:lt(a)?R(a):y?D(c,!(l=!1)):h?P(c,!(l=!1)):[]:dt(c)||Wn(c)?Wn(s=a)?s=bt(a):(!ht(a)||r&&pt(a))&&(s=K(c)):l=!1}l&&(u.set(c,s),o(s,c,r,i,u),u.delete(c)),j(t,n,s)}(r,o,e,i,k,u,a);else{var n=u?u(v(r,e),t,e+"",r,o,a):It;n===It&&(n=t),j(r,e,n)}},wt)}function z(t){if("string"==typeof t)return t;if(qn(t))return i(t,z)+"";if(gt(t))return An?An.call(t):"";var e=t+"";return"0"==e&&1/t==-Pt?"-0":e}function F(t,e){return null==(t=function(t,e){return e.length<2?t:p(t,function(t,e,n){var r=-1,o=t.length;e<0&&(e=o<-e?0:o+e),(n=o<n?o:n)<0&&(n+=o),o=n<e?0:n-e>>>0,e>>>=0;for(var i=Array(o);++r<o;)i[r]=t[r+e];return i}(e,0,-1))}(t,e=C(e,t)))||delete t[rt(ut(e))]}function C(t,e){return qn(t)?t:Y(t,e)?[t]:$n(_t(t))}function D(t,e){if(e)return t.slice();var n=t.length,r=Xe?Xe(n):new t.constructor(n);return t.copy(r),r}function M(t){var e=new t.constructor(t.byteLength);return new Qe(e).set(new Qe(t)),e}function P(t,e){return new t.constructor(e?M(t.buffer):t.buffer,t.byteOffset,t.length)}function R(t,e){var n=-1,r=t.length;for(e=e||Array(r);++n<r;)e[n]=t[n];return e}function U(t,e,n,r){var o=!n;n=n||{};for(var i=-1,u=e.length;++i<u;){var a=e[i],c=r?r(n[a],t[a],a,n,t):It;c===It&&(c=t[a]),o?l(n,a,c):O(n,a,c)}return n}function H(a){return function(t,e){return Hn(nt(t,e,Et),t+"")}(function(t,e){var n=-1,r=e.length,o=1<r?e[r-1]:It,i=2<r?e[2]:It;for(o=3<a.length&&"function"==typeof o?(r--,o):It,i&&function(t,e,n){if(!ht(n))return!1;var r=_typeof(e);return!!("number"==r?st(n)&&X(e,n.length):"string"==r&&e in n)&&ft(n[e],t)}(e[0],e[1],i)&&(o=r<3?It:o,r=1),t=Object(t);++n<r;){var u=e[n];u&&a(t,u,n,o)}return t})}function $(t){return dt(t)?It:t}function V(t,e,r,o,i,u){var n=r&Dt,a=t.length,c=e.length;if(a!=c&&!(n&&a<c))return!1;var f=u.get(t);if(f&&u.get(e))return f==e;var s=-1,l=!0,p=r&Mt?new _:It;for(u.set(t,e),u.set(e,t);++s<a;){var y=t[s],h=e[s];if(o)var v=n?o(h,y,s,e,t,u):o(y,h,s,t,e,u);if(v!==It){if(v)continue;l=!1;break}if(p){if(!d(e,function(t,e){if(n=e,!p.has(n)&&(y===t||i(y,t,r,o,u)))return p.push(e);var n})){l=!1;break}}else if(y!==h&&!i(y,h,r,o,u)){l=!1;break}}return u.delete(t),u.delete(e),l}function W(t){return y(t,Ot,zn)}function q(t){return y(t,wt,Fn)}function G(t,e){var n=t.__data__;return function(t){var e=_typeof(t);return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t}(e)?n["string"==typeof e?"string":"hash"]:n.map}function B(t,e){var n=function(t,e){return null==t?It:t[e]}(t,e);return S(n)?n:It}function J(t,e,n){for(var r=-1,o=(e=C(e,t)).length,i=!1;++r<o;){var u=rt(e[r]);if(!(i=null!=t&&n(t,u)))break;t=t[u]}return i||++r!=o?i:!!(o=null==t?0:t.length)&&yt(o)&&X(u,o)&&(qn(t)||Wn(t))}function K(t){return"function"!=typeof t.constructor||Z(t)?{}:En(Ye(t))}function Q(t){return qn(t)||Wn(t)||!!(nn&&t&&t[nn])}function X(t,e){var n=_typeof(t);return!!(e=null==e?Rt:e)&&("number"==n||"symbol"!=n&&we.test(t))&&-1<t&&t%1==0&&t<e}function Y(t,e){if(qn(t))return!1;var n=_typeof(t);return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=t&&!gt(t))||be.test(t)||!ge.test(t)||null!=e&&t in Object(e)}function Z(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||Ue)}function tt(t){return t==t&&!ht(t)}function et(e,n){return function(t){return null!=t&&t[e]===n&&(n!==It||e in Object(t))}}function nt(i,u,a){return u=fn(u===It?i.length-1:u,0),function(){for(var t=arguments,e=-1,n=fn(t.length-u,0),r=Array(n);++e<n;)r[e]=t[u+e];e=-1;for(var o=Array(u+1);++e<u;)o[e]=t[e];return o[u]=a(r),function(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}(i,this,o)}}function rt(t){if("string"==typeof t||gt(t))return t;var e=t+"";return"0"==e&&1/t==-Pt?"-0":e}function ot(t){if(null!=t){try{return $e.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function it(t){return null!=t&&t.length?function t(e,n,r,o,i){var u=-1,a=e.length;for(r=r||Q,i=i||[];++u<a;){var c=e[u];0<n&&r(c)?1<n?t(c,n-1,r,o,i):f(i,c):o||(i[i.length]=c)}return i}(t,1):[]}function ut(t){var e=null==t?0:t.length;return e?t[e-1]:It}function at(o,i){if("function"!=typeof o||null!=i&&"function"!=typeof i)throw new TypeError(Nt);function u(){var t=arguments,e=i?i.apply(this,t):t[0],n=u.cache;if(n.has(e))return n.get(e);var r=o.apply(this,t);return u.cache=n.set(e,r)||n,r}return u.cache=new(at.Cache||a),u}function ct(e){if("function"!=typeof e)throw new TypeError(Nt);return function(){var t=arguments;switch(t.length){case 0:return!e.call(this);case 1:return!e.call(this,t[0]);case 2:return!e.call(this,t[0],t[1]);case 3:return!e.call(this,t[0],t[1],t[2])}return!e.apply(this,t)}}function ft(t,e){return t===e||t!=t&&e!=e}function st(t){return null!=t&&yt(t.length)&&!pt(t)}function lt(t){return vt(t)&&st(t)}function pt(t){if(!ht(t))return!1;var e=h(t);return e==Gt||e==Bt||e==$t||e==Zt}function yt(t){return"number"==typeof t&&-1<t&&t%1==0&&t<=Rt}function ht(t){var e=_typeof(t);return null!=t&&("object"==e||"function"==e)}function vt(t){return null!=t&&"object"==_typeof(t)}function dt(t){if(!vt(t)||h(t)!=Xt)return!1;var e=Ye(t);if(null===e)return!0;var n=Ve.call(e,"constructor")&&e.constructor;return"function"==typeof n&&n instanceof n&&$e.call(n)==Ge}function gt(t){return"symbol"==_typeof(t)||vt(t)&&h(t)==re}function bt(t){return U(t,wt(t))}function _t(t){return null==t?"":z(t)}function mt(t,e,n){var r=null==t?It:p(t,e);return r===It?n:r}function jt(t,e){return null!=t&&J(t,e,E)}function Ot(t){return st(t)?c(t):I(t)}function wt(t){return st(t)?c(t,!0):N(t)}function At(t){return function(){return t}}function Et(t){return t}function Tt(t){return x("function"==typeof t?t:w(t,zt))}function Lt(t){return Y(t)?function(e){return function(t){return null==t?It:t[e]}}(rt(t)):function(e){return function(t){return p(t,e)}}(t)}function St(){return[]}function xt(){return!1}var It,Nt="Expected a function",kt="__lodash_hash_undefined__",zt=1,Ft=2,Ct=4,Dt=1,Mt=2,Pt=1/0,Rt=9007199254740991,Ut="[object Arguments]",Ht="[object Array]",$t="[object AsyncFunction]",Vt="[object Boolean]",Wt="[object Date]",qt="[object Error]",Gt="[object Function]",Bt="[object GeneratorFunction]",Jt="[object Map]",Kt="[object Number]",Qt="[object Null]",Xt="[object Object]",Yt="[object Promise]",Zt="[object Proxy]",te="[object RegExp]",ee="[object Set]",ne="[object String]",re="[object Symbol]",oe="[object Undefined]",ie="[object WeakMap]",ue="[object ArrayBuffer]",ae="[object DataView]",ce="[object Float32Array]",fe="[object Float64Array]",se="[object Int8Array]",le="[object Int16Array]",pe="[object Int32Array]",ye="[object Uint8Array]",he="[object Uint8ClampedArray]",ve="[object Uint16Array]",de="[object Uint32Array]",ge=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,be=/^\w*$/,_e=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,me=/\\(\\)?/g,je=/\w*$/,Oe=/^\[object .+?Constructor\]$/,we=/^(?:0|[1-9]\d*)$/,Ae={};Ae[ce]=Ae[fe]=Ae[se]=Ae[le]=Ae[pe]=Ae[ye]=Ae[he]=Ae[ve]=Ae[de]=!0,Ae[Ut]=Ae[Ht]=Ae[ue]=Ae[Vt]=Ae[ae]=Ae[Wt]=Ae[qt]=Ae[Gt]=Ae[Jt]=Ae[Kt]=Ae[Xt]=Ae[te]=Ae[ee]=Ae[ne]=Ae[ie]=!1;var Ee={};Ee[Ut]=Ee[Ht]=Ee[ue]=Ee[ae]=Ee[Vt]=Ee[Wt]=Ee[ce]=Ee[fe]=Ee[se]=Ee[le]=Ee[pe]=Ee[Jt]=Ee[Kt]=Ee[Xt]=Ee[te]=Ee[ee]=Ee[ne]=Ee[re]=Ee[ye]=Ee[he]=Ee[ve]=Ee[de]=!0,Ee[qt]=Ee[Gt]=Ee[ie]=!1;var Te,Le="object"==_typeof(Zn)&&Zn&&Zn.Object===Object&&Zn,Se="object"==("undefined"==typeof self?"undefined":_typeof(self))&&self&&self.Object===Object&&self,xe=Le||Se||Function("return this")(),Ie="object"==_typeof(er)&&er&&!er.nodeType&&er,Ne=Ie&&"object"==_typeof(tr)&&tr&&!tr.nodeType&&tr,ke=Ne&&Ne.exports===Ie,ze=ke&&Le.process,Fe=function(){try{return ze&&ze.binding&&ze.binding("util")}catch(t){}}(),Ce=Fe&&Fe.isMap,De=Fe&&Fe.isSet,Me=Fe&&Fe.isTypedArray,Pe=Array.prototype,Re=Function.prototype,Ue=Object.prototype,He=xe["__core-js_shared__"],$e=Re.toString,Ve=Ue.hasOwnProperty,We=(Te=/[^.]+$/.exec(He&&He.keys&&He.keys.IE_PROTO||""))?"Symbol(src)_1."+Te:"",qe=Ue.toString,Ge=$e.call(Object),Be=RegExp("^"+$e.call(Ve).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Je=ke?xe.Buffer:It,Ke=xe.Symbol,Qe=xe.Uint8Array,Xe=Je?Je.allocUnsafe:It,Ye=e(Object.getPrototypeOf,Object),Ze=Object.create,tn=Ue.propertyIsEnumerable,en=Pe.splice,nn=Ke?Ke.isConcatSpreadable:It,rn=Ke?Ke.toStringTag:It,on=function(){try{var t=B(Object,"defineProperty");return t({},"",{}),t}catch(t){}}(),un=Object.getOwnPropertySymbols,an=Je?Je.isBuffer:It,cn=e(Object.keys,Object),fn=Math.max,sn=Date.now,ln=B(xe,"DataView"),pn=B(xe,"Map"),yn=B(xe,"Promise"),hn=B(xe,"Set"),vn=B(xe,"WeakMap"),dn=B(Object,"create"),gn=ot(ln),bn=ot(pn),_n=ot(yn),mn=ot(hn),jn=ot(vn),On=Ke?Ke.prototype:It,wn=On?On.valueOf:It,An=On?On.toString:It,En=function(t){if(!ht(t))return{};if(Ze)return Ze(t);Tn.prototype=t;var e=new Tn;return Tn.prototype=It,e};function Tn(){}o.prototype.clear=function(){this.__data__=dn?dn(null):{},this.size=0},o.prototype.delete=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},o.prototype.get=function(t){var e=this.__data__;if(dn){var n=e[t];return n===kt?It:n}return Ve.call(e,t)?e[t]:It},o.prototype.has=function(t){var e=this.__data__;return dn?e[t]!==It:Ve.call(e,t)},o.prototype.set=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=dn&&e===It?kt:e,this},u.prototype.clear=function(){this.__data__=[],this.size=0},u.prototype.delete=function(t){var e=this.__data__,n=s(e,t);return!(n<0||(n==e.length-1?e.pop():en.call(e,n,1),--this.size,0))},u.prototype.get=function(t){var e=this.__data__,n=s(e,t);return n<0?It:e[n][1]},u.prototype.has=function(t){return-1<s(this.__data__,t)},u.prototype.set=function(t,e){var n=this.__data__,r=s(n,t);return r<0?(++this.size,n.push([t,e])):n[r][1]=e,this},a.prototype.clear=function(){this.size=0,this.__data__={hash:new o,map:new(pn||u),string:new o}},a.prototype.delete=function(t){var e=G(this,t).delete(t);return this.size-=e?1:0,e},a.prototype.get=function(t){return G(this,t).get(t)},a.prototype.has=function(t){return G(this,t).has(t)},a.prototype.set=function(t,e){var n=G(this,t),r=n.size;return n.set(t,e),this.size+=n.size==r?0:1,this},_.prototype.add=_.prototype.push=function(t){return this.__data__.set(t,kt),this},_.prototype.has=function(t){return this.__data__.has(t)},m.prototype.clear=function(){this.__data__=new u,this.size=0},m.prototype.delete=function(t){var e=this.__data__,n=e.delete(t);return this.size=e.size,n},m.prototype.get=function(t){return this.__data__.get(t)},m.prototype.has=function(t){return this.__data__.has(t)},m.prototype.set=function(t,e){var n=this.__data__;if(n instanceof u){var r=n.__data__;if(!pn||r.length<199)return r.push([t,e]),this.size=++n.size,this;n=this.__data__=new a(r)}return n.set(t,e),this.size=n.size,this};var Ln,Sn,xn,In=(Sn=function(t,e){return t&&Nn(t,e,Ot)},function(t,e){if(null==t)return t;if(!st(t))return Sn(t,e);for(var n=t.length,r=xn?n:-1,o=Object(t);(xn?r--:++r<n)&&!1!==e(o[r],r,o););return t}),Nn=function(t,e,n){for(var r=-1,o=Object(t),i=n(t),u=i.length;u--;){var a=i[Ln?u:++r];if(!1===e(o[a],a,o))break}return t},kn=on?function(t,e){return on(t,"toString",{configurable:!0,enumerable:!1,value:At(e),writable:!0})}:Et,zn=un?function(e){return null==e?[]:(e=Object(e),n(un(e),function(t){return tn.call(e,t)}))}:St,Fn=un?function(t){for(var e=[];t;)f(e,zn(t)),t=Ye(t);return e}:St,Cn=h;(ln&&Cn(new ln(new ArrayBuffer(1)))!=ae||pn&&Cn(new pn)!=Jt||yn&&Cn(yn.resolve())!=Yt||hn&&Cn(new hn)!=ee||vn&&Cn(new vn)!=ie)&&(Cn=function(t){var e=h(t),n=e==Xt?t.constructor:It,r=n?ot(n):"";if(r)switch(r){case gn:return ae;case bn:return Jt;case _n:return Yt;case mn:return ee;case jn:return ie}return e});var Dn,Mn,Pn,Rn,Un,Hn=(Pn=kn,Un=Rn=0,function(){var t=sn(),e=16-(t-Un);if(Un=t,0<e){if(800<=++Rn)return arguments[0]}else Rn=0;return Pn.apply(It,arguments)}),$n=(Mn=(Dn=at(function(t){var o=[];return 46===t.charCodeAt(0)&&o.push(""),t.replace(_e,function(t,e,n,r){o.push(n?r.replace(me,"$1"):e||t)}),o},function(t){return 500===Mn.size&&Mn.clear(),t})).cache,Dn);at.Cache=a;var Vn,Wn=T(function(){return arguments}())?T:function(t){return vt(t)&&Ve.call(t,"callee")&&!tn.call(t,"callee")},qn=Array.isArray,Gn=an||xt,Bn=Ce?t(Ce):function(t){return vt(t)&&Cn(t)==Jt},Jn=De?t(De):function(t){return vt(t)&&Cn(t)==ee},Kn=Me?t(Me):function(t){return vt(t)&&yt(t.length)&&!!Ae[h(t)]},Qn=H(function(t,e,n){k(t,e,n)}),Xn=H(function(t,e,n,r){k(t,e,n,r)}),Yn=Hn(nt(Vn=function(e,t){var n={};if(null==e)return n;var r=!1;t=i(t,function(t){return t=C(t,e),r=r||1<t.length,t}),U(e,q(e),n),r&&(n=w(n,zt|Ft|Ct,$));for(var o=t.length;o--;)F(n,t[o]);return n},It,it),Vn+"");r.constant=At,r.flatten=it,r.iteratee=Tt,r.keys=Ot,r.keysIn=wt,r.memoize=at,r.merge=Qn,r.mergeWith=Xn,r.negate=ct,r.omit=Yn,r.property=Lt,r.reject=function(t,e){return(qn(t)?n:function(t,r){var o=[];return In(t,function(t,e,n){r(t,e,n)&&o.push(t)}),o})(t,ct(function(t,e){var n=r.iteratee||Tt;return n=n===Tt?x:n,arguments.length?n(t,e):n}(e,3)))},r.toPlainObject=bt,r.cloneDeep=function(t){return w(t,zt|Ct)},r.cloneDeepWith=function(t,e){return w(t,zt|Ct,e="function"==typeof e?e:It)},r.eq=ft,r.get=mt,r.has=function(t,e){return null!=t&&J(t,e,A)},r.hasIn=jt,r.identity=Et,r.isArguments=Wn,r.isArray=qn,r.isArrayLike=st,r.isArrayLikeObject=lt,r.isBuffer=Gn,r.isEmpty=function(t){if(null==t)return!0;if(st(t)&&(qn(t)||"string"==typeof t||"function"==typeof t.splice||Gn(t)||Kn(t)||Wn(t)))return!t.length;var e=Cn(t);if(e==Jt||e==ee)return!t.size;if(Z(t))return!I(t).length;for(var n in t)if(Ve.call(t,n))return!1;return!0},r.isEqual=function(t,e){return L(t,e)},r.isFunction=pt,r.isLength=yt,r.isMap=Bn,r.isNull=function(t){return null===t},r.isObject=ht,r.isObjectLike=vt,r.isPlainObject=dt,r.isSet=Jn,r.isSymbol=gt,r.isTypedArray=Kn,r.last=ut,r.stubArray=St,r.stubFalse=xt,r.toString=_t,r.VERSION="4.17.5","function"==typeof define&&"object"==_typeof(define.amd)&&define.amd?(xe._=r,define(function(){return r})):Ne?((Ne.exports=r)._=r,Ie._=r):xe._=r}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],2:[function(t,e,n){e.exports={itemType:{DATA:"data",FCTN:"fctn",EVENT:"event",LISTENER_ON:"listenerOn",LISTENER_OFF:"listenerOff"},dataLayerEvent:{CHANGE:"adobeDataLayer:change",EVENT:"adobeDataLayer:event"},listenerScope:{PAST:"past",FUTURE:"future",ALL:"all"}}},{}],3:[function(t,e,n){var r=t("../custom-lodash"),c=r.cloneDeep,s=r.get,l=t("../version.json").version,p=t("./item"),y=t("./listener"),h=t("./listenerManager"),v=t("./constants"),d=t("./utils/customMerge");e.exports=function(t){var f,e=t,n=[],r={},o={},i={getState:function(){return r},getDataLayer:function(){return n},getPreviousState:function(){return o}};function u(t){o=c(r),r=d(r,t.data)}function a(t){if(t.valid){({data:function(t){u(t),f.triggerListeners(t)},fctn:function(t){t.config.call(n,n)},event:function(t){t.data&&u(t),f.triggerListeners(t)},listenerOn:function(t){var e=y(t);switch(e.scope){case v.listenerScope.PAST:var n,r=_createForOfIteratorHelper(c(t));try{for(r.s();!(n=r.n()).done;){var o=n.value;f.triggerListener(e,o)}}catch(t){r.e(t)}finally{r.f()}break;case v.listenerScope.FUTURE:f.register(e);break;case v.listenerScope.ALL:if(f.register(e)){var i,u=_createForOfIteratorHelper(c(t));try{for(u.s();!(i=u.n()).done;){var a=i.value;f.triggerListener(e,a)}}catch(t){u.e(t)}finally{u.f()}}}},listenerOff:function(t){f.unregister(y(t))}})[t.type](t)}else{var e="The following item cannot be handled by the data layer because it does not have a valid format: "+JSON.stringify(t.config);console.error(e)}function c(t){return 0===n.length||t.index>n.length-1?[]:n.slice(0,t.index).map(function(t){return p(t)})}}return function(){Array.isArray(e.dataLayer)||(e.dataLayer=[]);(n=e.dataLayer).version=l,r={},o={},f=h(i)}(),n.push=function(t){var n=arguments,r=arguments;if(Object.keys(n).forEach(function(t){var e=p(n[t]);switch(e.valid||delete r[t],e.type){case v.itemType.DATA:case v.itemType.EVENT:a(e);break;case v.itemType.FCTN:delete r[t],a(e);break;case v.itemType.LISTENER_ON:case v.itemType.LISTENER_OFF:delete r[t]}}),r[0])return Array.prototype.push.apply(this,r)},n.getState=function(t){return t?s(c(r),t):c(r)},n.addEventListener=function(t,e,n){a(p({on:t,handler:e,scope:n&&n.scope,path:n&&n.path}))},n.removeEventListener=function(t,e){a(p({off:t,handler:e}))},function(){for(var t=0;t<n.length;t++){var e=p(n[t],t);a(e),e.type!==v.itemType.LISTENER_ON&&e.type!==v.itemType.LISTENER_OFF&&e.type!==v.itemType.FCTN&&e.valid||(n.splice(t,1),t--)}}(),i}},{"../custom-lodash":1,"../version.json":14,"./constants":2,"./item":5,"./listener":7,"./listenerManager":8,"./utils/customMerge":10}],4:[function(t,e,n){var r={Manager:t("./dataLayerManager")};r.Manager({dataLayer:window.adobeDataLayer}),e.exports=r},{"./dataLayerManager":3}],5:[function(t,e,n){var r=t("../custom-lodash"),u=r.isPlainObject,a=r.isEmpty,c=r.omit,f=t("./utils/dataMatchesContraints"),s=t("./itemConstraints"),l=t("./constants");e.exports=function(t,e){var n=t,r=e,o=Object.keys(s).find(function(t){return f(n,s[t])})||"function"==typeof n&&l.itemType.FCTN||u(n)&&l.itemType.DATA,i=function(){var t=c(n,Object.keys(s.event));if(!a(t))return t}();return{config:n,type:o,data:i,valid:!!o,index:r}}},{"../custom-lodash":1,"./constants":2,"./itemConstraints":6,"./utils/dataMatchesContraints":11}],6:[function(t,e,n){e.exports={event:{event:{type:"string"},eventInfo:{optional:!0}},listenerOn:{on:{type:"string"},handler:{type:"function"},scope:{type:"string",values:["past","future","all"],optional:!0},path:{type:"string",optional:!0}},listenerOff:{off:{type:"string"},handler:{type:"function",optional:!0},scope:{type:"string",values:["past","future","all"],optional:!0},path:{type:"string",optional:!0}}}},{}],7:[function(t,e,n){var r=t("./constants");e.exports=function(t){return{event:t.config.on||t.config.off,handler:t.config.handler||null,scope:t.config.scope||t.config.on&&r.listenerScope.ALL||null,path:t.config.path||null}}},{"./constants":2}],8:[function(t,e,n){var r=t("../custom-lodash"),f=r.cloneDeep,s=r.get,u=t("./constants"),l=t("./utils/listenerMatch"),a=t("./utils/indexOfListener");e.exports=function(t){var o={},c=t,r=a.bind(null,o);function i(t,e,n){if(void 0===e.index&&l(t,e)){var r=[f(e.config)];if(e.data)if(t.path){var o=s(c.getPreviousState(),t.path),i=s(f(e.data),t.path);r.push(o,i)}else if(!n){var u=c.getPreviousState(),a=f(c.getState());r.push(u,a)}t.handler.apply(c.getDataLayer(),r)}}return{register:function(t){var e=t.event;return Object.prototype.hasOwnProperty.call(o,e)?-1===r(t)&&(o[t.event].push(t),!0):(o[t.event]=[t],!0)},unregister:function(t){var e=t.event;if(Object.prototype.hasOwnProperty.call(o,e))if(t.handler||t.scope||t.path){var n=r(t);-1<n&&o[e].splice(n,1)}else o[e]=[]},triggerListeners:function(r){(function(t){var e=[];switch(t.type){case u.itemType.DATA:e.push(u.dataLayerEvent.CHANGE);break;case u.itemType.EVENT:e.push(u.dataLayerEvent.EVENT),t.data&&e.push(u.dataLayerEvent.CHANGE),t.config.event!==u.dataLayerEvent.CHANGE&&e.push(t.config.event)}return e})(r).forEach(function(t){if(Object.prototype.hasOwnProperty.call(o,t)){var e,n=_createForOfIteratorHelper(o[t]);try{for(n.s();!(e=n.n()).done;){i(e.value,r,!1)}}catch(t){n.e(t)}finally{n.f()}}})},triggerListener:function(t,e){i(t,e,!0)}}}},{"../custom-lodash":1,"./constants":2,"./utils/indexOfListener":12,"./utils/listenerMatch":13}],9:[function(t,e,n){var r=t("../../custom-lodash"),o=r.has,i=r.get;e.exports=function(t,e){for(var n=e.substring(0,e.lastIndexOf("."));n;){if(o(t,n)){var r=i(t,n);if(null==r)return!0}n=n.substring(0,n.lastIndexOf("."))}return!1}},{"../../custom-lodash":1}],10:[function(t,e,n){var r=t("../../custom-lodash"),s=r.cloneDeepWith,l=r.isObject,p=r.isArray,y=r.reject,o=r.mergeWith,i=r.isNull;e.exports=function(t,e){return o(t,e,function(t,e,n,r){if(null==e)return null}),t=function(t,e){return s(t,function(f){return function e(t,n,r,o){if(l(t)){if(p(t))return y(t,f).map(function(t){return s(t,e)});for(var i={},u=0,a=Object.keys(t);u<a.length;u++){var c=a[u];f(t[c])||(i[c]=s(t[c],e))}return i}}}(1<arguments.length&&void 0!==e?e:function(t){return!t}))}(t,i)}},{"../../custom-lodash":1}],11:[function(t,e,n){e.exports=function(c,f){return void 0===Object.keys(f).find(function(t){var e=f[t].type,n=f[t].values,r=!f[t].optional,o=c[t],i=_typeof(o),u=e&&i!==e,a=n&&!n.includes(o);return r?!o||u||a:o&&(u||a)})}},{}],12:[function(t,e,n){var c=t("../../custom-lodash").isEqual;e.exports=function(t,e){var n=e.event;if(Object.prototype.hasOwnProperty.call(t,n)){var r,o=_createForOfIteratorHelper(t[n].entries());try{for(o.s();!(r=o.n()).done;){var i=_slicedToArray(r.value,2),u=i[0],a=i[1];if(c(a.handler,e.handler))return u}}catch(t){o.e(t)}finally{o.f()}}return-1}},{"../../custom-lodash":1}],13:[function(t,e,n){var r=t("../../custom-lodash").has,i=t("../constants"),o=t("./ancestorRemoved");function u(t,e){return!e.data||!t.path||(r(e.data,t.path)||o(e.data,t.path))}e.exports=function(t,e){var n=t.event,r=e.config,o=!1;return e.type===i.itemType.DATA?n===i.dataLayerEvent.CHANGE&&(o=u(t,e)):e.type===i.itemType.EVENT&&(n!==i.dataLayerEvent.EVENT&&n!==r.event||(o=u(t,e)),e.data&&n===i.dataLayerEvent.CHANGE&&(o=u(t,e))),o}},{"../../custom-lodash":1,"../constants":2,"./ancestorRemoved":9}],14:[function(t,e,n){e.exports={version:"1.1.0"}},{}]},{},[4]);
//# sourceMappingURL=adobe-client-data-layer.min.js.map

/*******************************************************************************
 * Copyright 2020 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var dataLayerEnabled = document.body.hasAttribute("data-cmp-data-layer-enabled");
    var dataLayer = (dataLayerEnabled)? window.adobeDataLayer = window.adobeDataLayer || [] : undefined;

    function addComponentToDataLayer(component) {
        dataLayer.push({
            component: getComponentObject(component)
        });
    }

    function attachClickEventListener(element) {
        element.addEventListener("click", addClickToDataLayer);
    }

    function getComponentObject(element) {
        var component = getComponentData(element);
        var componentID = Object.keys(component)[0];
        var parentElement = element.parentNode.closest("[data-cmp-data-layer], body");

        if (parentElement) {
            component[componentID].parentId = parentElement.id;
        }

        return component;
    }

    function addClickToDataLayer(event) {
        var element = event.currentTarget;
        var componentId = getClickId(element);

        dataLayer.push({
            event: "cmp:click",
            eventInfo: {
                path: "component." + componentId
            }
        });
    }

    function getComponentData(element) {
        var dataLayerJson = element.dataset.cmpDataLayer;
        return JSON.parse(dataLayerJson);
    }

    function getClickId(element) {
        if (element.dataset.cmpDataLayer) {
            return Object.keys(JSON.parse(element.dataset.cmpDataLayer))[0];
        }

        var componentElement = element.closest("[data-cmp-data-layer]");

        return Object.keys(JSON.parse(componentElement.dataset.cmpDataLayer))[0];
    }

    function onDocumentReady() {
        var components = document.querySelectorAll("[data-cmp-data-layer]");
        var clickableElements = document.querySelectorAll("[data-cmp-clickable]");

        components.forEach(function(component) {
            addComponentToDataLayer(component);
        });

        clickableElements.forEach(function(element) {
            attachClickEventListener(element);
        });

        dataLayer.push({
            event: "cmp:loaded"
        });
    }

    if (dataLayerEnabled) {
        if (document.readyState !== "loading") {
            onDocumentReady();
        } else {
            document.addEventListener("DOMContentLoaded", onDocumentReady);
        }
    }

}());

