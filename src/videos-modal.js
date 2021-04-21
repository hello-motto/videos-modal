/**
 * Videos Modal Plugin https://github.com/hello-motto
 * 
 * Version 1.0.10
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
        let that = this;

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
        let that = this;

        if (reset !== true) {
            that.setDefaultOptions();
        }

        for (let property in options) {
            if (typeof that.options[property] !== 'undefined') {
                that.options[property] = options[property];
            }
        }

        if (reset !== true) {
            that.setVideosModalContainer();
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
        let that = this;
        let i;

        if (reset !== true) {
            if (window.addEventListener) {
                window.addEventListener('keydown', function (event) {
                    that.onKeyDown(event);
                }, false);
            } else {
                window.attachEvent('onkeydown', function (event) {
                    that.onKeyDown(event);
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
     * This is what happens when the click on link is triggered
     *
     * @param event
     */
    onClick (event) {
        event.preventDefault();

        let that = this;

        // This can not be the event.target if the link has children nodes
        let link = event.currentTarget;

        that.open(link);
    }

    /**
     * Return all the providers that are supported in this plugin
     *
     * @returns {string[]}
     */
    getSupportedProviders () {
        return [
            'youtube',
            'dailymotion',
            'vimeo',
            'youtubeplaylist'
        ];
    }

    /**
     * Check if the parameter provider is supported
     *
     * @param provider
     * @returns {boolean}
     */
    isProviderSupported (provider) {
        return this.getSupportedProviders().indexOf(provider) > -1;
    }

    /**
     * Set the links by query selector
     *
     * @returns {VideosModal}
     */
    setLinks () {
        let that = this;

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
        let that = this;

        let links = that.links;

        for (let i = 0; i < that.linksNumber; i++) {
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
        this.options.onlyLandscape = true;

        this.options.videos_provider = 'media';
        this.options.videos_id = null;
        this.options.videos_width = null;
        this.options.videos_height = null;
        this.options.videos_autoplay = 0;
        this.options.videos_rel = 0;
        this.options.videos_controls = 0;
        this.options.videos_showinfo = 0;
        this.options.videos_allowfullscreen = 0;
        this.options.videos_theme = 'dark';
        this.options.videos_title = true;
        this.options.videos_byline = true;
        this.options.videos_portrait = true;
        this.options.videos_loop = 0;
        this.options.videos_muted = 1;
        this.options.videos_poster = '';
        this.options.videos_preload = 'auto';
        this.options.videos_mp4 = null;
        this.options.videos_ogg = null;
        this.options.videos_webm = null;
    }

    /**
     * Open the modal and set the links values
     *
     * @param link
     * @returns {VideosModal}
     */
    open (link) {
        let that = this;
        let modal = that.getVideosModalContainer();
        let provider = that.getLinkProvider(link);

        if (that.isTarteAuCitronEnabled() && ! that.isProviderAllowedByTarteAuCitron(provider)) {
            that.options.tarteAuCitron.userInterface.openPanel();
        } else {
            modal.classList.add('opened');
            modal.appendChild(that.getVideoTemplate(link));

            if (! that.hasNoProvider(link)) {
                if (that.isProviderAllowedByTarteAuCitron(provider)) {
                    that.options.tarteAuCitron.services[provider].js();
                }
            }

            if (that.options.navigate === true && that.linksNumber > 1) {
                that.currentLink = parseInt(link.getAttribute('data-videos-modal-order'));
                let prevLink = that.createLink(that.getPrevLink());
                prevLink.setAttribute('id', 'videos-modal-prev-link');
                prevLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    that.prev();
                });
                prevLink.insertAdjacentHTML('afterbegin', that.options.leftArrow);
                let nextLink = that.createLink(that.getNextLink());
                nextLink.setAttribute('id', 'videos-modal-next-link');
                nextLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    that.next();

                });
                nextLink.insertAdjacentHTML('afterbegin', that.options.rightArrow);
                modal.appendChild(prevLink);
                modal.appendChild(nextLink);
            }
        }

        return this;
    }

    /**
     * Close the modal and remove the navigation links
     *
     * @returns {VideosModal}
     */
    close () {
        let that = this;

        let modal = document.getElementById('videos-modal');

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
        let that = this;
        let link = that.getNavigationPrevLink();
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
        let that = this;
        let link = that.getNavigationNextLink();
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
        let that = this;
        let provider = triggeredLink.getAttribute('data-videos-modal-provider');
        let modal = that.getVideosModalContainer();
        let prevLink = document.getElementById('videos-modal-prev-link');
        let nextLink = document.getElementById('videos-modal-next-link');
        that.isProviderSupported(provider);
        if (! that.isTarteAuCitronEnabled() || (that.hasNoProvider(triggeredLink)) ||
            that.isProviderAllowedByTarteAuCitron(provider)) {
            let newVideoTemplate = that.getVideoTemplate(triggeredLink);

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
        let linkNumber = this.currentLink > 0 ? this.currentLink - 1 : this.linksNumber - 1;
        return this.getLink(linkNumber);
    }

    /**
     * Return the link after the current link in the list
     *
     * @returns {HTMLElementTagNameMap}
     */
    getNextLink () {
        let linkNumber = this.currentLink === this.linksNumber - 1 ? 0 : this.currentLink + 1;
        return this.getLink(linkNumber);
    }

    /**
     * Return the provider of the current link. If the current link does not have a provider parameter, it will return
     * the default provider
     *
     * @param link
     * @returns {string}
     */
    getLinkProvider (link) {
        let that = this;
        let provider = link.getAttribute('data-videos-modal-provider');

        if (typeof provider === 'undefined' || provider === null || provider === '') {
            provider = that.options.videos_provider;
        }

        return provider;
    }

    /**
     * Remove the navigation links in the modal
     *
     * @returns {VideosModal}
     */
    removeNavigationLinks() {
        let that = this;
        let modal = that.getVideosModalContainer();
        let links = modal.getElementsByTagName('a'), index;

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
        let id, src, marginTop, videoPlayer, mp4, ogg, webm, mp4Src, oggSrc, webmSrc;
        let provider = this.setTemplateLinkValues(link, 'provider');
        let width = this.setTemplateLinkValues(link, 'width', (window.innerWidth * 0.7));
        let height = this.setTemplateLinkValues(link, 'height', (window.innerHeight * 0.7));
        let autoplay = parseInt(this.setTemplateLinkValues(link, 'autoplay'));
        let rel = this.setTemplateLinkValues(link, 'rel');
        let controls = parseInt(this.setTemplateLinkValues(link, 'controls'));
        let showinfo = parseInt(this.setTemplateLinkValues(link, 'showinfo'));
        let theme = this.setTemplateLinkValues(link, 'theme', 'dark');
        let allowfullscreen = this.setTemplateLinkValues(link, 'allowfullscreen');
        let title = this.setTemplateLinkValues(link, 'title');
        let byline = this.setTemplateLinkValues(link, 'byline');
        let portrait = this.setTemplateLinkValues(link, 'portrait');
        let loop = this.setTemplateLinkValues(link, 'loop');
        let muted = parseInt(this.setTemplateLinkValues(link, 'muted'));
        let poster = this.setTemplateLinkValues(link, 'poster');
        let preload = this.setTemplateLinkValues(link, 'preload');

        switch (provider) {
            case 'youtube':
                id = this.setTemplateLinkValues(link, 'id', 'Q5fftru-t-g');
                src = `//www.youtube-nocookie.com/embed/${id}?autoplay=${autoplay}`;
                src += `&loop=${loop}`;
                src += `&controls=${controls}`;
                src += `&rel=${rel}`;
                src += `&showinfo=${showinfo}`;
                src += `&theme=${theme === 'dark' || theme === 'light' ? theme : 'dark'}`;
                break;
            case 'youtubeplaylist':
                id = this.setTemplateLinkValues(link, 'id', 'PLDz1o5Ur8b7V56es-ci2_HdykvZPLNU95');
                src = `//www.youtube-nocookie.com/embed/videoseries?list=${id}&autoplay=${autoplay}`;
                src += `&loop=${loop}`;
                src += `&controls=${controls}`;
                src += `&rel=${rel}`;
                src += `&showinfo=${showinfo}`;
                break;
            case 'dailymotion':
                id = this.setTemplateLinkValues(link, 'id', 'xta4r');
                src = `//www.dailymotion.com/embed/video/${id}?info=${showinfo}&autoPlay=${autoplay}`;
                break;
            case 'vimeo':
                id = this.setTemplateLinkValues(link, 'id', '210806913');
                src = `//player.vimeo.com/video/${id}?autoplay=${autoplay}`;
                src += `&title=${title}`;
                src += `&byline=${byline}`;
                src += `&portrait=${portrait}`;
                src += `&loop=${loop}`;
                break;
            default:
                src = this.setTemplateLinkValues(link, 'id');
                break;
        }

        if (! this.hasNoProvider(link)) {
            if (this.isTarteAuCitronEnabled() && this.isProviderAllowedByTarteAuCitron(provider)) {
                videoPlayer = document.createElement('div');
                videoPlayer.classList.add(`${provider === 'youtubeplaylist' ? 'youtube_playlist' : provider}_player`);
                videoPlayer.setAttribute(`${provider === 'youtubeplaylist' ? 'playlistID' : 'videoID'}`, id);
                videoPlayer.setAttribute('rel', rel);
                videoPlayer.setAttribute('controls', controls);
                videoPlayer.setAttribute('showinfo', showinfo);
                videoPlayer.setAttribute('autoplay', autoplay);
                if (provider === 'vimeo') {
                    videoPlayer.setAttribute('title', title);
                    videoPlayer.setAttribute('loop', loop);
                    videoPlayer.setAttribute('byline', byline);
                    videoPlayer.setAttribute('portrait', portrait);
                } else if (provider === 'youtube') {
                    videoPlayer.setAttribute('theme', theme);
                }
            } else {
                videoPlayer = document.createElement('iframe');
                videoPlayer.setAttribute('src', src);
                videoPlayer.setAttribute('frameborder', '0');
            }
            videoPlayer.setAttribute('allowfullscreen', allowfullscreen);
        } else {
            videoPlayer = document.createElement('video');
            videoPlayer.controls = controls;
            videoPlayer.loop = loop;
            videoPlayer.autoplay = autoplay;
            videoPlayer.muted = muted;
            videoPlayer.setAttribute('poster', poster);
            videoPlayer.setAttribute('preload', preload);
            mp4 = this.setTemplateLinkValues(link, 'mp4');
            ogg = this.setTemplateLinkValues(link, 'ogg');
            webm = this.setTemplateLinkValues(link, 'webm');
            if (mp4 !== 'null') {
                mp4Src = document.createElement('source');
                mp4Src.setAttribute('type', 'video/mp4');
                mp4Src.setAttribute('src', mp4);
                videoPlayer.appendChild(mp4Src);
            }
            if (ogg !== 'null') {
                oggSrc = document.createElement('source');
                oggSrc.setAttribute('type', 'video/ogg');
                oggSrc.setAttribute('src', ogg);
                videoPlayer.appendChild(oggSrc);
            }
            if (webm !== 'null') {
                webmSrc = document.createElement('source');
                webmSrc.setAttribute('type', 'video/webm');
                webmSrc.setAttribute('src', webm);
                videoPlayer.appendChild(webmSrc);
            }
        }

        if (this.options.onlyLandscape === true &&
            window.matchMedia('(orientation: portrait)').matches) {
            videoPlayer.setAttribute('width', height);
            videoPlayer.setAttribute('height', width);
            marginTop = parseInt((window.innerHeight - width) / 2);
        } else {
            videoPlayer.setAttribute('width', width);
            videoPlayer.setAttribute('height', height);
            marginTop = parseInt((window.innerHeight - height) / 2);
        }
        videoPlayer.classList.add('videos_player');

        videoPlayer.style.marginTop = `${marginTop}px`;

        return videoPlayer;
    }

    /**
     * Create a new link and set its attributes from another
     *
     * @param link
     * @returns {HTMLAnchorElement}
     */
    createLink (link) {
        let newLink = document.createElement('a');
        this.editLink(newLink, link);

        return newLink;
    }

    /**
     * Set a link attributes from another link
     *
     * @param targetLink
     * @param link
     * @returns {VideosModal}
     */
    editLink (targetLink, link) {
        targetLink.setAttribute('data-videos-modal-order', link.getAttribute('data-videos-modal-order'));
        targetLink.setAttribute('data-videos-modal-id', this.getLinkAttribute(link, 'id'));
        targetLink.setAttribute('data-videos-modal-provider', this.getLinkAttribute(link, 'provider'));
        targetLink.setAttribute('data-videos-modal-width', this.getLinkAttribute(link, 'width'));
        targetLink.setAttribute('data-videos-modal-height', this.getLinkAttribute(link, 'height'));
        targetLink.setAttribute('data-videos-modal-autoplay', this.getLinkAttribute(link, 'autoplay'));
        targetLink.setAttribute('data-videos-modal-rel', this.getLinkAttribute(link, 'rel'));
        targetLink.setAttribute('data-videos-modal-controls', this.getLinkAttribute(link, 'controls'));
        targetLink.setAttribute('data-videos-modal-showinfo', this.getLinkAttribute(link, 'showinfo'));
        targetLink.setAttribute('data-videos-modal-allowfullscreen',
            this.getLinkAttribute(link, 'allowfullscreen'));
        targetLink.setAttribute('data-videos-modal-theme', this.getLinkAttribute(link, 'theme'));
        targetLink.setAttribute('data-videos-modal-title', this.getLinkAttribute(link, 'title'));
        targetLink.setAttribute('data-videos-modal-byline', this.getLinkAttribute(link, 'byline'));
        targetLink.setAttribute('data-videos-modal-portrait', this.getLinkAttribute(link, 'portrait'));
        targetLink.setAttribute('data-videos-modal-loop', this.getLinkAttribute(link, 'loop'));
        targetLink.setAttribute('data-videos-modal-muted', this.getLinkAttribute(link, 'muted'));
        targetLink.setAttribute('data-videos-modal-poster', this.getLinkAttribute(link, 'poster'));
        targetLink.setAttribute('data-videos-modal-preload', this.getLinkAttribute(link, 'preload'));
        targetLink.setAttribute('data-videos-modal-mp4', this.getLinkAttribute(link, 'mp4'));
        targetLink.setAttribute('data-videos-modal-ogg', this.getLinkAttribute(link, 'ogg'));
        targetLink.setAttribute('data-videos-modal-webm', this.getLinkAttribute(link, 'webm'));

        return this;
    }

    /**
     * Set the Videos Modal Container and insert it at the end of the body tag
     *
     * @returns {VideosModal}
     */
    setVideosModalContainer () {
        let that = this;
        let videosModalContainer = that.getVideosModalContainer();
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
        if (that.options.onlyLandscape === true) {
            videosModalContainer.classList.add('only-landscape');
        }

        let modalBackground = document.createElement('div');
        modalBackground.setAttribute('id', 'videos-modal-background');
        videosModalContainer.appendChild(modalBackground);

        document.body.appendChild(videosModalContainer);

        return this;
    }

    /**
     * Remove the video container
     *
     * @returns {VideosModal}
     */
    removeVideoContainer() {
        let that = this;
        let modal = that.getVideosModalContainer();
        let videoContainer = modal.getElementsByClassName('videos_player'), index;

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
        let tarteaucitron = this.options.tarteAuCitron;
        return this.isTarteAuCitronEnabled() && this.isProviderSupported(provider) && tarteaucitron.state[provider];
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
        let value;
        let parameterValue = link.getAttribute(`data-videos-modal-${parameter}`);
        if (typeof parameterValue !== 'undefined' && parameterValue !== null && parameterValue !== 'null') {
            value = parameterValue;
        } else if (this.options[`videos_${parameter}`] !== null) {
            value = this.options[`videos_${parameter}`];
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
        return link.getAttribute(`data-videos-modal-${attribute}`) !== null ?
            link.getAttribute(`data-videos-modal-${attribute}`) : this.options[`videos_${attribute}`];
    }

    /**
     * Check if the video of the param link has some registered provider
     *
     * @param link
     * @returns {boolean}
     */
    hasNoProvider (link) {
        return this.setTemplateLinkValues(link, 'provider') === 'media';
    }

    /**
     * Call functions triggered by keydown
     *
     * @param event
     */
    onKeyDown (event) {
        let that = this;
        let modal = that.getVideosModalContainer();

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
     * Return the Videos Modal Container
     *
     * @returns {HTMLElement}
     */
    getVideosModalContainer () {
        return document.getElementById('videos-modal');
    }

    /**
     * Return the HTML navigation previous link
     *
     * @returns {HTMLElement}
     */
    getNavigationPrevLink () {
        return document.getElementById('videos-modal-prev-link');
    }

    /**
     * Return the HTML navigation next link
     *
     * @returns {HTMLElement}
     */
    getNavigationNextLink () {
        return document.getElementById('videos-modal-next-link');
    }

    /**
     * Return the by default loader icon
     *
     * @returns {string}
     */
    getDefaultLoaderIcon () {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="videos-modal-loader">
    <rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(0 50 50)">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.875s" repeatCount="indefinite"/>
    </rect>
    <rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(45 50 50)">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"/>
    </rect>
    <rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(90 50 50)">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.625s" repeatCount="indefinite"/>
    </rect>
    <rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(135 50 50)">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"/>
    </rect>
    <rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(180 50 50)">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.375s" repeatCount="indefinite"/>
    </rect>
    <rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(225 50 50)">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"/>
    </rect>
    <rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(270 50 50)">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.125s" repeatCount="indefinite"/>
    </rect>
    <rect x="47" y="22.5" rx="9.4" ry="4.5" width="6" height="15" fill="#fff" transform="rotate(315 50 50)">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/>
    </rect>
</svg>`;
    }

    /**
     * Return the by default close icon
     *
     * @returns {string}
     */
    getDefaultCloseIcon () {
        return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="videos-modal-close" viewBox="0 0 32 32"
    style="enable-background:new 0 0 32 32;" xml:space="preserve">
    <path fill="#999" d="M30.3448276,31.4576271 C29.9059965,31.4572473 29.4852797,31.2855701 29.1751724,30.980339
        L0.485517241,2.77694915 C-0.122171278,2.13584324 -0.104240278,1.13679247 0.52607603,0.517159487 C1.15639234,
        -0.102473494 2.17266813,-0.120100579 2.82482759,0.477288136 L31.5144828,28.680678 C31.9872448,29.1460053
        32.1285698,29.8453523 31.8726333,30.4529866 C31.6166968,31.0606209 31.0138299,31.4570487 30.3448276,31.4576271 Z" />
    <path fill="#999" d="M1.65517241,31.4576271 C0.986170142,31.4570487 0.383303157,31.0606209 0.127366673,30.4529866
        C-0.12856981,29.8453523 0.0127551942,29.1460053 0.485517241,28.680678 L29.1751724,0.477288136 C29.8273319,
        -0.120100579 30.8436077,-0.102473494 31.473924,0.517159487 C32.1042403,1.13679247 32.1221713,2.13584324
        31.5144828,2.77694915 L2.82482759,30.980339 C2.51472031,31.2855701 2.09400353,31.4572473 1.65517241,31.4576271 Z" />
</svg>`;
    }

    /**
     * Return the by default navigation prev icon
     *
     * @returns {string}
     */
    getDefaultLeftArrow () {
        return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="videos-modal-left-arrow"
    viewBox="0 0 11.4 20" style="enable-background:new 0 0 11.4 20;" xml:space="preserve">
    <path fill="#999" d="M0.4,9L9,0.4c0.5-0.5,1.4-0.5,2,0c0.5,0.5,0.5,1.4,0,2L3.4,10l7.6,7.6c0.5,0.5,0.5,1.4,0,2
        c-0.5,0.5-1.4,0.5-2,0L0.4,11C-0.2,10.4-0.2,9.6,0.4,9L0.4,9L0.4,9z"/>
</svg>`;
    }

    /**
     * Return the by default navigation next icon
     *
     * @returns {string}
     */
    getDefaultRightArrow () {
        return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="videos-modal-right-arrow"
    viewBox="0 0 11.4 20" style="enable-background:new 0 0 11.4 20;" xml:space="preserve">
    <path fill="#999" d="M11,11l-8.6,8.6c-0.5,0.5-1.4,0.5-2,0c-0.5-0.5-0.5-1.4,0-2L8,10L0.4,2.4c-0.5-0.5-0.5-1.4,0-2
    c0.5-0.5,1.4-0.5,2,0L11,9C11.5,9.6,11.5,10.4,11,11C11,11,11,11,11,11L11,11z"/>
</svg>`;
    }
}
