# Videos Modal
[![NPM @latest](https://img.shields.io/npm/v/hello-motto-videos-modal.svg)](https://www.npmjs.com/package/hello-motto-videos-modal)<br>

A little JS plugin for videos embed working with tarteaucitronjs.<br>

[![NPM stats](https://nodei.co/npm/hello-motto-videos-modal.svg?downloadRank=true&downloads=true)](https://www.npmjs.org/package/hello-motto-videos-modal)

## Installation

### Node.js JavaScript

You may install the NPM package `hello-motto-videos-modal`. When installed you can add it in your resources.

```bash
$ npm -g install hello-motto-videos-modal
```

### Direct download

Instead of using NPM, it is possible to download [the last stable version here](https://github.com/hello-motto/videos-modal/archive/master.zip) and use the files that you need.

### HTML

Include `videos-modal.css` or `videos-modal.min.css` stylesheet :
```html
<!-- Normal version -->
<link rel="stylesheet" href="videos-modal.css"/>
<!-- OR the minified version -->
<link rel="stylesheet" href="videos-modal.min.css"/>
```

Include `videos-modal.js` or `videos-modal.min.js` script :
```html
<!-- Normal version -->
<script src="videos-modal.js"></script>
<!-- OR the minified and uglyfied version -->
<script src="videos-modal.min.js"></script>
```

## Usage

This is a script that show videos (from youtube or others) into a modal. It's working with tarteaucitron and videos will be blocked if the provider (Youtube for example) is not allowed by the user.<br>
Examples below can be found in the [example page](https://www.hello-motto.fr/videos-modal/examples/multi-providers.html)
and in the [example without tarteaucitron page](https://www.hello-motto.fr/videos-modal/examples/without-tarteaucitron.html).

### Create JavaScript Object

To instanciate the object it is possible to pass an optional JSON object as argument. This object is optional because
all the parameters have default values and most of them can be overwritten by each link.<br>
Here are the options with the by default values.<br>
Only options beginning with `video_` can be overwritten by link attributes.

```js
var videosModal = new VideosModal({
    closeOnClick: true,
    closeWithEscape: true,
    closeByIcon: true,
    closeIcon: '', // Default icon VideosModal.getDefaultCloseIcon(), this needs that closeByIcon is set as true
    loading: true,
    loaderIcon: '', // Default icon VideosModal().getDefaultLoaderIcon(), this needs that loading is set as true
    navigate: true,
    leftArrow: '', // Default icon VideosModal.getDefaultLeftArrow(), this needs that navigate is set as true
    rightArrow: '', // Default icon VideosModal.getDefaultRightArrow(), this needs that navigate is set as true
    tarteAuCitron: null, // if tarteaucitron is used, put the variable into it.
    links: '.videos-modal-link', // It is possible to set several selectors as a string.
    videos_id: null,
    videos_provider: null,
    videos_width: null,
    videos_height: null,
    videos_autoplay: 0,
    videos_rel: 0,
    videos_controls: 0,
    videos_showinfo: 0,
    videos_allowfullscreen: 0,
    videos_title: true,
    videos_byline: true,
    videos_portrait: true,
    videos_loop: false
});
```

### Create HTML container for the modal (optional)

This is an optional container. If this not exists, it will be inserted at the end of the body.

```html
<div id="videos-modal"></div>
```

### Add links for the embed videos

The `href` attribute won't be used (but is important if javascript is no enabled). The `data-videos-modal-*` attributes overwrite the by default parameters.

```html
<!-- Youtube Provider Video -->
<a href="https://www.youtube.com/watch?v=elbgmrH06Qg" class="videos-modal-link" data-videos-modal-provider="youtube"
    data-videos-modal-id="elbgmrH06Qg" data-videos-modal-autoplay="1" data-videos-modal-rel="0"
    data-videos-modal-controls="1" data-videos-modal-showinfo="1" data-videos-modal-allowfullscreen="1">
        First link
</a>
```

To add some video media, don't use `data-videos-modal-id` but `data-videos-modal-` + format of the video. For example `data-videos-modal-ogg` for ogg format videos. 

```html
<!-- Video Media without provider -->
<a href="./media/scrabble.mp4" class="play" data-videos-modal-mp4="./media/scrabble.mp4" data-videos-modal-autoplay="1"
    data-videos-modal-controls="1" data-videos-modal-muted="0" data-videos-modal-loop="0">
    Scrabble
</a>
```

### Add or remove links after the page is loaded

If there are new links or links are removed after the page is loaded (ajax or modified DOM), you can easily reset the script and the links list.

```js
videosModal.reset();
```

## Compatibility

This script should work with all modern browsers (so forget IE). If you see compatibility problems please contact me.

## Available providers

- Youtube
- Dailymotion
- Vimeo

## Next versions

At present it only supports youtube, vimeo and dailymotion videos, but in the next versions it will work with other providers.<br>
Notice that the `allowfullscreen` parameter [doesn't work with tarteaucitron (fr)](https://github.com/AmauriC/tarteaucitron.js/issues/273).
