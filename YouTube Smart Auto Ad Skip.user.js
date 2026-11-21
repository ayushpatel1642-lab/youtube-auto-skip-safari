// ==UserScript==
// ==UserScript==
// @name         YouTube Smart Auto Ad Skip
// @namespace    https://github.com/ayushpatel1642-lab/youtube-auto-skip-safari
// @version      1.0.0
// @description  Auto-clicks YouTube's Skip Ad button once it unlocks.
// @author       ayushpatel1642-lab
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @run-at       document-idle
// @inject-into  content
// @downloadURL  https://raw.githubusercontent.com/ayushpatel1642-lab/youtube-auto-skip-safari/main/youtube-auto-skip.user.js
// @updateURL    https://raw.githubusercontent.com/ayushpatel1642-lab/youtube-auto-skip-safari/main/youtube-auto-skip.user.js
// ==/UserScript==
// ==/UserScript==

(() => {
  'use strict';

  const SHOW_BADGE = false;   // set false once it works
  const FAST_FORWARD = true; // also mute + speed up + jump ads to the end

  const SELECTORS = [
    '.ytp-skip-ad-button',
    '.ytp-ad-skip-button-modern',
    '.ytp-ad-skip-button',
    '.ytp-ad-skip-button-container button',
    '.ytp-skip-ad button',
    '[id^="skip-button"] button',
    '[id^="skip-button"]',
    '.ytp-ad-overlay-close-button'
  ].join(',');

  // On-page status badge (bottom-left)
  const badge = document.createElement('div');
  badge.style.cssText =
    'position:fixed;left:8px;bottom:8px;z-index:2147483647;padding:3px 8px;' +
    'border-radius:10px;font:11px -apple-system,sans-serif;color:#fff;' +
    'background:#1a7f37;opacity:.85;pointer-events:none';
  badge.textContent = 'AdSkip on';
  if (SHOW_BADGE) document.documentElement.appendChild(badge);

  let flashTimer;
  const flash = msg => {
    badge.textContent = msg;
    badge.style.background = '#b45309';
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => {
      badge.textContent = 'AdSkip on';
      badge.style.background = '#1a7f37';
    }, 2500);
  };

  const visible = el =>
    !el.disabled &&
    el.getClientRects().length > 0 &&
    getComputedStyle(el).visibility !== 'hidden';

  const press = el => {
    const opts = { bubbles: true, cancelable: true, composed: true, view: window };
    for (const t of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) {
      const E = t.startsWith('pointer') ? PointerEvent : MouseEvent;
      el.dispatchEvent(new E(t, opts));
    }
  };

  const adShowing = () =>
    !!document.querySelector('.html5-video-player.ad-showing, #movie_player.ad-showing');

  let lastClick = 0;
  let saved = null;

  const handleVideo = () => {
    if (!FAST_FORWARD) return;
    const v = document.querySelector('video.html5-main-video') || document.querySelector('video');
    if (!v) return;

    if (adShowing()) {
      if (!saved) {
        saved = { muted: v.muted, rate: v.playbackRate };
        flash('Ad detected');
      }
      v.muted = true;
      try { v.playbackRate = 16; } catch (e) {}
      if (isFinite(v.duration) && v.duration > 0 && v.currentTime < v.duration - 0.2) {
        v.currentTime = v.duration - 0.1;
      }
    } else if (saved) {
      v.muted = saved.muted;
      try { v.playbackRate = saved.rate; } catch (e) {}
      saved = null;
    }
  };

  let queued = false;

  const check = () => {
    queued = false;
    const found = new Set(document.querySelectorAll(SELECTORS));

    if (adShowing()) {
      document.querySelectorAll('#movie_player button, .video-ads button').forEach(b => {
        const label = (b.textContent || '') + ' ' + (b.getAttribute('aria-label') || '');
        if (/skip/i.test(label)) found.add(b);
      });
    }

    const now = Date.now();
    if (now - lastClick > 400) {
      for (const b of found) {
        if (visible(b)) {
          press(b);
          lastClick = now;
          flash('Skip clicked');
          break;
        }
      }
    }

    handleVideo();
  };

  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(check);
  };

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'disabled', 'hidden']
  });

  check();
  setInterval(check, 500); // direct call, also runs in background tabs
})();