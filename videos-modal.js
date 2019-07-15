/**
 * Videos Modal Plugin https://github.com/hello-motto
 * 
 * Version 1.0.3
 * 
 * @author Jean-Baptiste MOTTO <contact@hello-motto.fr>
 */
class VideosModal
{
    /**
     * Constructor of the class
     *
     * @param options
     * @returns {VideosModal}
     */
    constructor (options = {}) {
        var that = this;

        this.onClick = function (event) {
            event.preventDefault();

            var that = this;

            var link = event.target;

            var provider = link.getAttribute('data-videos-modal-provider');

            if (! that.isTarteAuCitronEnabled() || that.isProviderAllowedByTarteAuCitron(provider)) {
                that.open(link);
            } else {
                that.options.tarteAuCitron.userInterface.openPanel();
            }
        };

        that.clickHandler = that.onClick.bind(that);

        that.init(options, false);

        return this;
    }

    /**
     * Method that inits the default values
     *
     * @param options
     * @returns {VideosModal}
     */
    init (options, reset) {
        var that = this;

        if (reset !== true) {
            that.setDefaultOptions();
            that.setVideosModalContainer();
        }

        for (var property in options) {
            if (typeof that.options[property] !== 'undefined') {
                that.options[property] = options[property];
            }
        }

        that.setLinks();

        that.initEvents(reset);

        return this;
    }

    /**
     * Method that inits the Event Listeners
     *
     * @param reset
     * @returns {VideosModal}
     */
    initEvents (reset) {
        var that = this;
        var i;

        if (reset !== true) {
            if (window.addEventListener) {
                window.addEventListener('keydown', function (event) {
                    that.onkeydown(event);
                }, false);
            } else {
                window.attachEvent('onkeydown', function (event) {
                    that.onkeydown(event);
                });
            }

            // Add the close icon if it is enabled
            if (that.options.closeByIcon === true) {
                document.getElementById('videos-modal-close').addEventListener('click', function() {
                    that.close();
                });
            }

            if (this.options.closeOnClick === true) {
                document.getElementById('videos-modal-background').addEventListener('click', function () {
                    that.close();
                });
            }
        }

        for (i = 0; i < that.linksNumber; i++) {
            // Set the order of the videos if the navigation is allowed
            if (that.options.navigate === true && that.linksNumber > 1) {
                that.links[i].setAttribute('data-videos-modal-order', i);
            }
            that.links[i].addEventListener('click', that.clickHandler, false);
        }

        return this;
    }

    /**
     * Set the links by query selector
     *
     * @returns {VideosModal}
     */
    setLinks () {
        var that = this;

        that.currentLink = 0;

        that.links = document.querySelectorAll(that.options.links);

        that.linksNumber = that.links.length;

        return this;
    }

    /**
     * Reset the object with current options.
     * This method is usefull when new links are added to the DOM or removed from it.
     *
     * @returns {VideosModal}
     */
    reset () {
        var that = this;

        var links = that.links;

        for (var i = 0; i < that.linksNumber; i++) {
            links[i].removeEventListener('click', that.clickHandler);
        }

        return that.init(that.options, true);
    }

    /**
     * Set the default options that can be overwritten in the constructor
     */
    setDefaultOptions () {
        this.options = [];

        this.options.closeOnClick = true;
        this.options.closeWithEscape = true;
        this.options.closeByIcon = true;
        this.options.closeIcon = this.options.closeByIcon === true ? this.getDefaultCloseIcon() : null;
        this.options.loading = true;
        this.options.loaderIcon = this.options.loading === true ? this.getDefaultLoaderIcon() : null;
        this.options.navigate = true;
        this.options.leftArrow = this.options.navigate === true ? this.getDefaultLeftArrow() : null;
        this.options.rightArrow = this.options.navigate === true ? this.getDefaultRightArrow() : null;
        this.options.tarteAuCitron = null;
        this.options.links = '.videos-modal-link';

        this.options.videos_provider = null;
        this.options.videos_id = null;
        this.options.videos_width = null;
        this.options.videos_height = null;
        this.options.videos_autoplay = 0;
        this.options.videos_rel = 0;
        this.options.videos_controls = 0;
        this.options.videos_showinfo = 0;
        this.options.videos_allowfullscreen = 0;
        this.options.videos_title = true;
        this.options.videos_byline = true;
        this.options.videos_portrait = true;
        this.options.videos_loop = false;
    }

    /**
     * Open the modal and set the links values
     *
     * @param link
     * @returns {VideosModal}
     */
    open (link) {
        var that = this;
        var modal = document.getElementById('videos-modal');
        var provider = link.getAttribute('data-videos-modal-provider');
        modal.classList.add('opened');
        modal.appendChild(that.getVideoTemplate(link));

        if (that.isProviderAllowedByTarteAuCitron(provider)) {
            that.options.tarteAuCitron.services[provider].js();
        }

        if (that.options.navigate === true && that.linksNumber > 1) {
            that.currentLink = parseInt(link.getAttribute('data-videos-modal-order'));
            var prevLink = that.createLink(that.getPrevLink());
            prevLink.setAttribute('id', 'videos-modal-prev-link');
            prevLink.addEventListener('click', function(event) {
                event.preventDefault();
                that.prev();
            });
            prevLink.insertAdjacentHTML('afterbegin', that.options.leftArrow);
            var nextLink = that.createLink(that.getNextLink());
            nextLink.setAttribute('id', 'videos-modal-next-link');
            nextLink.addEventListener('click', function(event) {
                event.preventDefault();
                that.next();

            });
            nextLink.insertAdjacentHTML('afterbegin', that.options.rightArrow);
            modal.appendChild(prevLink);
            modal.appendChild(nextLink);
        }

        return this;
    }

    /**
     * Close the modal and remove the navigation links
     *
     * @returns {VideosModal}
     */
    close () {
        var that = this;

        var modal = document.getElementById('videos-modal');

        modal.classList.remove('opened');

        that.removeVideoContainer();

        that.removeNavigationLinks();

        return this;
    }

    /**
     * Set the current video to the previous and update navigation links
     *
     * @param link
     * @returns {VideosModal}
     */
    prev () {
        var link = document.getElementById('videos-modal-prev-link');
        this.updateNavigationLinks(link);

        return this;
    }

    /**
     * Set the current video to the next and update navigation links
     *
     * @param link
     * @returns {VideosModal}
     */
    next () {
        var link = document.getElementById('videos-modal-next-link');
        this.updateNavigationLinks(link);

        return this;
    }

    /**
     * Update the navigation links
     *
     * @param triggeredLink
     * @returns {VideosModal}
     */
    updateNavigationLinks (triggeredLink) {
        var that = this;
        var provider = triggeredLink.getAttribute('data-videos-modal-provider');
        var modal = document.getElementById('videos-modal');
        var prevLink = document.getElementById('videos-modal-prev-link');
        var nextLink = document.getElementById('videos-modal-next-link');

        if (! that.isTarteAuCitronEnabled() || that.isProviderAllowedByTarteAuCitron(provider)) {
            var newVideoTemplate = that.getVideoTemplate(triggeredLink);

            that.currentLink = parseInt(triggeredLink.getAttribute('data-videos-modal-order'));

            that.removeVideoContainer();

            that.editLink(prevLink, that.getPrevLink());

            that.editLink(nextLink, that.getNextLink());

            modal.appendChild(newVideoTemplate);

            if (that.isProviderAllowedByTarteAuCitron(provider)) {
                that.options.tarteAuCitron.services[provider].js();
            }
        } else {
            that.close();
            that.options.tarteAuCitron.userInterface.openPanel();
        }

        return this;
    }

    /**
     * Get all the links that trigger the videos
     *
     * @returns {NodeListOf<HTMLElementTagNameMap[*]>}
     */
    getLinks() {
        return document.querySelectorAll(this.options.links);
    }

    /**
     * Return the link from the list of the links that trigger the videos
     *
     * @param index
     * @returns {HTMLElementTagNameMap}
     */
    getLink (index) {
        return this.getLinks()[index];
    }

    /**
     * Return the current link in the list
     *
     * @returns {HTMLElementTagNameMap}
     */
    getCurrentLink() {
        return this.getLinks()[this.currentLink];
    }

    /**
     * Return the link before the current link in the list
     *
     * @returns {HTMLElementTagNameMap}
     */
    getPrevLink () {
        var linkNumber = this.currentLink > 0 ? this.currentLink - 1 : this.linksNumber - 1;
        return this.getLink(linkNumber);
    }

    /**
     * Return the link after the current link in the list
     *
     * @returns {HTMLElementTagNameMap}
     */
    getNextLink () {
        var linkNumber = this.currentLink === this.linksNumber - 1 ? 0 : this.currentLink + 1;
        return this.getLink(linkNumber);
    }

    /**
     * Remove the navigation links in the modal
     *
     * @returns {VideosModal}
     */
    removeNavigationLinks() {
        var modal = document.getElementById('videos-modal');
        var links = modal.getElementsByTagName('a'), index;

        for (index = links.length - 1; index >= 0; index--) {
            links[index].parentNode.removeChild(links[index]);
        }

        return this;
    }

    /**
     * Get the close icon (by default or custom)
     *
     * @returns {HTMLElement}
     */
    getCloseIcon () {
        return this.options.closeIcon;
    }

    /**
     * Get the loader icon (by default or custom)
     *
     * @returns {HTMLElement}
     */
    getLoaderIcon () {
        return this.options.loaderIcon;
    }

    /**
     * Get the video template as an iframe or a div if tarteaucitron is enabled
     *
     * @param link
     * @returns {HTMLElement}
     */
    getVideoTemplate (link) {
        var id, src, videoPlayer;
        var provider = this.setTemplateLinkValues(link, 'provider');
        var width = this.setTemplateLinkValues(link, 'width', window.innerWidth * 0.7);
        var height = this.setTemplateLinkValues(link, 'height', window.innerHeight * 0.7);
        var autoplay = this.setTemplateLinkValues(link, 'autoplay');
        var rel = this.setTemplateLinkValues(link, 'rel');
        var controls = this.setTemplateLinkValues(link, 'controls');
        var showinfo = this.setTemplateLinkValues(link, 'showinfo');
        var allowfullscreen = this.setTemplateLinkValues(link, 'allowfullscreen');
        var marginTop = parseInt((window.innerHeight - height) / 2) + 'px';
        var title = this.setTemplateLinkValues(link, 'title');
        var byline = this.setTemplateLinkValues(link, 'byline');
        var portrait = this.setTemplateLinkValues(link, 'portrait');
        var loop = this.setTemplateLinkValues(link, 'loop');

        switch (provider) {
            case 'youtube':
                id = this.setTemplateLinkValues(link, 'id', 'Q5fftru-t-g');
                src = '//www.youtube.com/embed/' + id + '?&autoplay=' + autoplay;
                break;
            case 'dailymotion':
                id = this.setTemplateLinkValues(link, 'id', 'xta4r');
                src = '//www.dailymotion.com/embed/video/' + id + '?info=' + showinfo + '&autoPlay=' + autoplay;
                break;
            case 'vimeo':
                id = this.setTemplateLinkValues(link, 'id', '210806913');
                src = '//player.vimeo.com/video/' + id + '?autoplay' + autoplay;
                src += '&title=' + title;
                src += '&byline=' + byline;
                src += '&portrait=' + portrait;
                src += '&loop=' + loop;
                break;
        }

        

        if (this.isTarteAuCitronEnabled() && this.isProviderAllowedByTarteAuCitron(provider)) {
            videoPlayer = document.createElement('div');
            videoPlayer.classList.add(provider + '_player');
            videoPlayer.setAttribute('videoID', id);
            videoPlayer.setAttribute('rel', rel);
            videoPlayer.setAttribute('controls', controls);
            videoPlayer.setAttribute('showinfo', showinfo);
            videoPlayer.setAttribute('allowfullscreen', allowfullscreen);
            videoPlayer.setAttribute('autoplay', autoplay);
            videoPlayer.setAttribute('title', title);
            videoPlayer.setAttribute('loop', loop);
            videoPlayer.setAttribute('byline', byline);
            videoPlayer.setAttribute('portrait', portrait);
        } else {
            videoPlayer = document.createElement('iframe');
            videoPlayer.setAttribute('src', src);
            videoPlayer.setAttribute('frameborder', 0);
        }

        videoPlayer.setAttribute('allowfullscreen', allowfullscreen);
        videoPlayer.setAttribute('width', width);
        videoPlayer.setAttribute('height', height);
        videoPlayer.classList.add('videos_player');

        videoPlayer.style.marginTop = marginTop;

        return videoPlayer;
    }

    /**
     * Create a new link and set its attributes from another
     *
     * @param link
     * @returns {HTMLAnchorElement}
     */
    createLink (link) {
        var newLink = document.createElement('a');
        this.editLink(newLink, link);

        return newLink;
    }

    /**
     * Set a link attributes from another link
     *
     * @param targetLink
     * @param duplicatedLink
     * @returns {VideosModal}
     */
    editLink (targetLink, duplicatedLink) {
        targetLink.setAttribute('data-videos-modal-order', duplicatedLink.getAttribute('data-videos-modal-order'));
        targetLink.setAttribute('data-videos-modal-id', this.getLinkAttribute(duplicatedLink, 'id'));
        targetLink.setAttribute('data-videos-modal-provider', this.getLinkAttribute(duplicatedLink, 'provider'));
        targetLink.setAttribute('data-videos-modal-width', this.getLinkAttribute(duplicatedLink, 'width'));
        targetLink.setAttribute('data-videos-modal-height', this.getLinkAttribute(duplicatedLink, 'height'));
        targetLink.setAttribute('data-videos-modal-autoplay', this.getLinkAttribute(duplicatedLink, 'autoplay'));
        targetLink.setAttribute('data-videos-modal-rel', this.getLinkAttribute(duplicatedLink, 'rel'));
        targetLink.setAttribute('data-videos-modal-controls', this.getLinkAttribute(duplicatedLink, 'controls'));
        targetLink.setAttribute('data-videos-modal-showinfo', this.getLinkAttribute(duplicatedLink, 'showinfo'));
        targetLink.setAttribute('data-videos-modal-allowfullscreen', this.getLinkAttribute(duplicatedLink, 'allowfullscreen'));
        targetLink.setAttribute('data-videos-modal-title', this.getLinkAttribute(duplicatedLink, 'title'));
        targetLink.setAttribute('data-videos-modal-byline', this.getLinkAttribute(duplicatedLink, 'byline'));
        targetLink.setAttribute('data-videos-modal-portrait', this.getLinkAttribute(duplicatedLink, 'portrait'));
        targetLink.setAttribute('data-videos-modal-loop', this.getLinkAttribute(duplicatedLink, 'loop'));

        return this;
    }

    /**
     * Set the Videos Modal Container and insert it at the end of the body tag
     *
     * @returns {VideosModal}
     */
    setVideosModalContainer () {
        var that = this;
        var videosModalContainer = document.getElementById('videos-modal');
        if (videosModalContainer === null) {
            videosModalContainer = document.createElement('div');
            videosModalContainer.setAttribute('id', 'videos-modal');
        }
        if (that.options.closeByIcon === true) {
            videosModalContainer.insertAdjacentHTML('beforeend', that.getCloseIcon());
        }
        if (that.options.loading === true) {
            videosModalContainer.insertAdjacentHTML('beforeend', that.getLoaderIcon());
        }

        document.body.appendChild(videosModalContainer);

        var modalBackground = document.createElement('div');
        modalBackground.setAttribute('id', 'videos-modal-background');
        videosModalContainer.appendChild(modalBackground);

        return this;
    }

    /**
     * Remove the video container
     *
     * @returns {VideosModal}
     */
    removeVideoContainer() {
        var modal = document.getElementById('videos-modal');
        var videoContainer = modal.getElementsByClassName('videos_player'), index;

        for (index = videoContainer.length - 1; index >= 0; index--) {
            videoContainer[index].parentNode.removeChild(videoContainer[index]);
        }

        return this;
    }

    /**
     * Check if tarteaucitron js is enabled
     *
     * @returns {boolean}
     */
    isTarteAuCitronEnabled () {
        return this.options.tarteAuCitron !== null;
    }

    /**
     * Check if the provider player is allowed by tarteaucitron js
     *
     * @param provider
     * @returns {boolean}
     */
    isProviderAllowedByTarteAuCitron (provider) {
        var tarteaucitron = this.options.tarteAuCitron;
        if (this.isTarteAuCitronEnabled()) {
            switch (provider) {
                case 'youtube':
                case 'dailymotion':
                case 'vimeo':
                    return tarteaucitron.state[provider] !== false;
            }
        }
        return false;
    }

    /**
     * Set the link parameters values from current link or this.options or default value
     *
     * @param link
     * @param parameter
     * @param defaultValue
     * @returns {string}
     */
    setTemplateLinkValues (link, parameter, defaultValue = null) {
        var value;
        if (typeof link.getAttribute('data-videos-modal-' + parameter) !== 'undefined' &&
            link.getAttribute('data-videos-modal-' + parameter) !== null &&
            link.getAttribute('data-videos-modal-' + parameter) !== 'null') {
            value = link.getAttribute('data-videos-modal-' + parameter);
        } else if (this.options['videos_' + parameter] !== null) {
            value = this.options['videos_' + parameter];
        } else {
            value = defaultValue;
        }

        return value;
    }

    /**
     * Return attribute from a link or this.options
     *
     * @param link
     * @param attribute
     * @returns {string}
     */
    getLinkAttribute (link, attribute) {
        return link.getAttribute('data-videos-modal-' + attribute) !== null ?
            link.getAttribute('data-videos-modal-' + attribute) : this.options['videos_' + attribute];
    }

    /**
     * Call functions triggered by keydown
     *
     * @param event
     */
    onkeydown (event) {
        var that = this;
        var modal = document.getElementById('videos-modal');

        if (modal.classList.contains('opened')) {
            switch (event.keyCode || event.which) {
                case 27:
                    // Close the modal by press the escape task
                    if (that.options.closeWithEscape === true) {
                        that.close();
                    }
                    break;
                case 37:
                    if (that.options.navigate === true && that.linksNumber > 1) {
                        that.prev();
                    }
                    break;
                case 39:
                    if (that.options.navigate === true && that.linksNumber > 1) {
                        that.next();
                    }
                    break;
            }
        }
    }

    /**
     * Return the by default loader icon
     *
     * @returns {string}
     */
    getDefaultLoaderIcon () {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="videos-modal-loader">' +
            '<rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(0 50 50)">' +
            '<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.875s" repeatCount="indefinite"/>' +
            '</rect>' +
            '<rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(45 50 50)">' +
            '<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"/>' +
            '</rect>' +
            '<rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(90 50 50)">' +
            '<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.625s" repeatCount="indefinite"/>' +
            '</rect>' +
            '<rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(135 50 50)">' +
            '<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"/>' +
            '</rect>' +
            '<rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(180 50 50)">' +
            '<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.375s" repeatCount="indefinite"/>' +
            '</rect>' +
            '<rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(225 50 50)">' +
            '<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"/>' +
            '</rect>' +
            '<rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(270 50 50)">' +
            '<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.125s" repeatCount="indefinite"/>' +
            '</rect>' +
            '<rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(315 50 50)">' +
            '<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/>' +
            '</rect>' +
            '</svg>';
    }

    /**
     * Return the by default close icon
     *
     * @returns {string}
     */
    getDefaultCloseIcon () {
        return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="videos-modal-close"' +
            'viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">' +
            '<path fill="#999" d="M30.3448276,31.4576271 C29.9059965,31.4572473 29.4852797,31.2855701 29.1751724,30.980339 ' +
            'L0.485517241,2.77694915 C-0.122171278,2.13584324 -0.104240278,1.13679247 0.52607603,0.517159487 C1.15639234,' +
            '-0.102473494 2.17266813,-0.120100579 2.82482759,0.477288136 L31.5144828,28.680678 C31.9872448,29.1460053 ' +
            '32.1285698,29.8453523 31.8726333,30.4529866 C31.6166968,31.0606209 31.0138299,31.4570487 30.3448276,31.4576271 Z" />' +
            '<path fill="#999" d="M1.65517241,31.4576271 C0.986170142,31.4570487 0.383303157,31.0606209 0.127366673,30.4529866 ' +
            'C-0.12856981,29.8453523 0.0127551942,29.1460053 0.485517241,28.680678 L29.1751724,0.477288136 C29.8273319,' +
            '-0.120100579 30.8436077,-0.102473494 31.473924,0.517159487 C32.1042403,1.13679247 32.1221713,2.13584324 ' +
            '31.5144828,2.77694915 L2.82482759,30.980339 C2.51472031,31.2855701 2.09400353,31.4572473 1.65517241,31.4576271 Z" />' +
            '</svg>';
    }

    /**
     * Return the by default navigation prev icon
     *
     * @returns {string}
     */
    getDefaultLeftArrow () {
        return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="videos-modal-left-arrow" ' +
            'viewBox="0 0 11.4 20" style="enable-background:new 0 0 11.4 20;" xml:space="preserve">' +
            '<path fill="#999" d="M0.4,9L9,0.4c0.5-0.5,1.4-0.5,2,0c0.5,0.5,0.5,1.4,0,2L3.4,10l7.6,7.6c0.5,0.5,0.5,1.4,0,2 ' +
            'c-0.5,0.5-1.4,0.5-2,0L0.4,11C-0.2,10.4-0.2,9.6,0.4,9L0.4,9L0.4,9z"/>' +
            '</svg>';
    }

    /**
     * Return the by default navigation next icon
     *
     * @returns {string}
     */
    getDefaultRightArrow () {
        return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="videos-modal-right-arrow" ' +
            'viewBox="0 0 11.4 20" style="enable-background:new 0 0 11.4 20;" xml:space="preserve">' +
            '<path fill="#999" d="M11,11l-8.6,8.6c-0.5,0.5-1.4,0.5-2,0c-0.5-0.5-0.5-1.4,0-2L8,10L0.4,2.4c-0.5-0.5-0.5-1.4,0-2 ' +
            'c0.5-0.5,1.4-0.5,2,0L11,9C11.5,9.6,11.5,10.4,11,11C11,11,11,11,11,11L11,11z"/>' +
            '</svg>';
    }
}