# Videos Modal
A little JS plugin for videos embed working with tarteaucitronjs

## Installation

Include `videos-modal.js` script :
```html
<script src="videos-modal.js"></script>
```

Include `videos-modal.css` stylesheet :
```html
<link rel="stylesheet" href="videos-modal.css">
```

## Usage

This is a script that show videos (from youtube or others) into a modal. It's working with tarteaucitron and videos will be blocked if the provider (Youtube for example) is not allowed by the user.<br>
Examples below can be found in the [example page](https://www.hello-motto.fr/videos-modal/examples/index.html).

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
    videos_width: null,
    videos_height: null,
    videos_autoplay: 0,
    videos_rel: 0,
    videos_controls: 0,
    videos_showinfo: 0,
    videos_allowfullscreen: 0
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
<a href="https://www.youtube.com/watch?v=elbgmrH06Qg" class="videos-modal-link" data-videos-modal-id="elbgmrH06Qg"
    data-videos-modal-autoplay="1" data-videos-modal-rel="0" data-videos-modal-controls="1" data-videos-modal-showinfo="1" data-videos-modal-allowfullscreen="1">
        First link
</a>
```

### Add or remove links after the page is loaded

If there are new links or links are removed after the page is loaded (ajax or modified DOM), you can easily reset the script and the links list.

```js
videosModal.reset();
```

## Compatibility

This script should work with all modern browsers (so forget IE). If you see compatibility problems please contact me.

## Next versions

At present it only supports youtube videos, but in the next versions it will work with other providers.<br>
Notice that the `allowfullscreen` parameter [doesn't work with tarteaucitron (fr)](https://github.com/AmauriC/tarteaucitron.js/issues/273)