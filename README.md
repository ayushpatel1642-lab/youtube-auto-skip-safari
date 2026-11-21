# youtube-auto-skip-safari
"Safari userscript that auto-clicks YouTube's Skip Ad button".
# YouTube Auto Skip (Safari)

Userscript for Safari that automatically clicks YouTube's **Skip Ad** button as soon as it becomes clickable.

## Install

1. Install [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) from the Mac App Store.
2. Open the app, click **Set Directory**, and pick a folder.
3. Safari > Settings > Extensions: enable **Userscripts** and allow it on `youtube.com`.
4. Download [`youtube-auto-skip.user.js`](https://raw.githubusercontent.com/ayushpatel1642-lab/youtube-auto-skip-safari/main/youtube-auto-skip.user.js) into that folder.into that folder.
5. 
6. Click the Userscripts toolbar icon, hit refresh, and reload YouTube.

## What it does

- Clicks Skip / overlay-close buttons the moment they unlock
- Optional fast-forward for ads (`FAST_FORWARD` flag)
- Small on-page status badge (`SHOW_BADGE` flag, set to `false` to hide it)

## Limitations

- YouTube locks the Skip button during a countdown. A userscript can't shorten it.
- Unskippable ads still play.
- YouTube changes its page structure often, so the selectors may need updating.
- Tested on macOS Safari only.

## Disclaimer

Use at your own risk. This may go against YouTube's Terms of Service.

## License

MIT
