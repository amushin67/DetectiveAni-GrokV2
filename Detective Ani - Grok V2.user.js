// ==UserScript==
// @name         Detective Ani - Grok V2
// @namespace    https://github.com/amushin67
// @version      1.0
// @description  Out of Grok: Find medias. Inside Grok: New skin and functions.
// @author       Amu + Grok
// @match        *://*/*
// @icon         https://grok.com/images/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @connect      *
// @connect      raw.githubusercontent.com
// @connect      grok.com
// @connect      assets.grok.com
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const host = location.hostname.toLowerCase();
    const isGrok = host === 'grok.com' || host.endsWith('.grok.com') || host.includes('grok.com');
    const isRedgifs = host === 'redgifs.com' || host.endsWith('.redgifs.com') || host.includes('redgifs.com');

    // ============================================================
    // 1. SKIN (só no Grok)
    // ============================================================
    if (isGrok) {
        const VIDEO_URL = 'https://raw.githubusercontent.com/amushin67/StaryAni/refs/heads/main/ani.mp4';
        let videoBlobUrl = null;

        function loadVideoAsBlob() {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: VIDEO_URL,
                    responseType: 'arraybuffer',
                    onload: res => {
                        if (res.status >= 200 && res.status < 300) {
                            const blob = new Blob([res.response], { type: 'video/mp4' });
                            videoBlobUrl = URL.createObjectURL(blob);
                            resolve(videoBlobUrl);
                        } else reject(new Error('HTTP ' + res.status));
                    },
                    onerror: reject
                });
            });
        }

        function createBackground(src) {
            const old = document.getElementById('stary-sky-bg');
            if (old) old.remove();

            const container = document.createElement('div');
            container.id = 'stary-sky-bg';
            container.setAttribute('aria-hidden', 'true');

            const video = document.createElement('video');
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.preload = 'auto';
            video.src = src;
            video.style.cssText = 'width:100%!important;height:100%!important;object-fit:cover!important;filter:brightness(1.05) contrast(1.1) saturate(1.15);transform:scale(1.02);';

            container.appendChild(video);
            (document.body || document.documentElement).prepend(container);
            video.play().catch(() => {});
        }

        function injectSkinStyles() {
            if (document.getElementById('stary-sky-styles')) return;

            const style = document.createElement('style');
            style.id = 'stary-sky-styles';
            style.textContent = `
                #stary-sky-bg {
                    position: fixed !important;
                    inset: 0 !important;
                    z-index: -1 !important;
                    pointer-events: none !important;
                    overflow: hidden !important;
                }
                html, body, #root {
                    background: transparent !important;
                    background-color: transparent !important;
                }
                main, [class*="chat"], [class*="conversation"], [class*="content"],
                [class*="main"], .overflow-y-auto,
                [class*="bg-surface"], [class*="bg-background"], [class*="bg-black"],
                [class*="bg-neutral"], [class*="from-background"], [class*="via-background"],
                [class*="to-background"], [class*="bg-gradient"] {
                    background: transparent !important;
                    background-color: transparent !important;
                    background-image: none !important;
                }
                .relative.min-w-0.w-full,
                [class*="@xl\\:w-4\\/5"],
                [class*="max-w-breakout"],
                div:has(> .query-bar),
                div:has([class*="query-bar"]),
                div:has([data-wd-toolbar]) {
                    background: transparent !important;
                    background-color: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                }
                .query-bar,
                [class*="query-bar"],
                [class*="bg-\\[hsl\\(var\\(--wd-composer-bg\\)\\)\\]"],
                div[style*="--wd-composer-bg"],
                [data-wd-toolbar] {
                    background: rgba(45, 28, 18, 0.32) !important;
                    background-color: rgba(45, 28, 18, 0.32) !important;
                    border: 1px solid rgba(180, 130, 90, 0.28) !important;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.35) !important;
                    backdrop-filter: blur(10px) saturate(130%) !important;
                    -webkit-backdrop-filter: blur(10px) saturate(130%) !important;
                    border-radius: 24px !important;
                }
                [data-wd-toolbar] *, [role="radiogroup"], [role="radiogroup"] * {
                    background: transparent !important;
                    background-color: transparent !important;
                }
                .query-bar button, [data-wd-toolbar] button, [role="radiogroup"] button {
                    background-color: rgba(255, 220, 180, 0.09) !important;
                    color: #f5e6d3 !important;
                }
                .query-bar button:hover, [data-wd-toolbar] button:hover, [role="radiogroup"] button:hover {
                    background-color: rgba(180, 120, 70, 0.28) !important;
                }
                .query-bar button[aria-checked="true"], [role="radiogroup"] button[aria-checked="true"] {
                    background-color: rgba(160, 100, 50, 0.38) !important;
                    color: #fff8f0 !important;
                }
                [class*="sidebar"], nav, aside, .sticky, [class*="sticky"] {
                    background: transparent !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                }
                [class*="message-bubble"], [class*="rounded-"][class*="bg-"], .prose {
                    background: rgba(50, 32, 20, 0.35) !important;
                    backdrop-filter: blur(8px) !important;
                    -webkit-backdrop-filter: blur(8px) !important;
                    border: 1px solid rgba(180, 130, 90, 0.20) !important;
                }
                [class*="dialog"], [class*="modal"], [class*="popover"], [role="dialog"] {
                    background: rgba(45, 28, 18, 0.50) !important;
                    backdrop-filter: blur(14px) !important;
                }
                body, p, span, div, h1, h2, h3, h4, h5, h6, li, a {
                    color: #f5e6d3 !important;
                }
                /* Proteção dos botões do Imagine */
                .grok-extra-buttons button, .grok-extra-btn {
                    background: rgba(45, 28, 18, 0.80) !important;
                    color: #f5e6d3 !important;
                    border: 1px solid rgba(180, 130, 90, 0.40) !important;
                    backdrop-filter: blur(8px) !important;
                    -webkit-backdrop-filter: blur(8px) !important;
                }
            `;
            (document.head || document.documentElement).appendChild(style);
        }

        async function initSkin() {
            injectSkinStyles();
            try {
                const src = await loadVideoAsBlob();
                createBackground(src);
            } catch (e) {
                createBackground(VIDEO_URL);
            }
            const obs = new MutationObserver(() => {
                if (!document.getElementById('stary-sky-bg') && videoBlobUrl) createBackground(videoBlobUrl);
                if (!document.getElementById('stary-sky-styles')) injectSkinStyles();
            });
            obs.observe(document.documentElement, { childList: true, subtree: true });
        }
        initSkin();
    }

    // ============================================================
    // 2. IMAGINE BUTTONS (só no Grok)
    // ============================================================
    if (isGrok) {
        const PLUS_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>`;
        const DL_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

        function createButton(text, onClickOrUrl, isDownload = false) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'grok-extra-btn';
            btn.innerHTML = (isDownload ? DL_SVG : PLUS_SVG) + ` <span>${text}</span>`;
            btn.style.cssText = `
                display:inline-flex;align-items:center;gap:6px;
                height:36px;padding:0 13px;border-radius:9999px;
                font-size:13px;font-weight:500;cursor:pointer;
                border:1px solid rgba(180,130,90,0.40);
                background:rgba(45,28,18,0.80);color:#f5e6d3;
                backdrop-filter:blur(8px);transition:all .15s ease;
            `;
            btn.onmouseenter = () => { btn.style.background = 'rgba(70,42,25,0.95)'; btn.style.color = '#fff8f0'; };
            btn.onmouseleave = () => { btn.style.background = 'rgba(45,28,18,0.80)'; btn.style.color = '#f5e6d3'; };

            if (typeof onClickOrUrl === 'string') {
                btn.onclick = e => { e.preventDefault(); e.stopPropagation(); location.href = onClickOrUrl; };
            } else {
                btn.onclick = e => { e.preventDefault(); e.stopPropagation(); onClickOrUrl(btn); };
            }
            return btn;
        }

        function getUserEmail() {
            try {
                for (const store of [localStorage, sessionStorage]) {
                    for (let i = 0; i < store.length; i++) {
                        const val = store.getItem(store.key(i));
                        if (val && val.includes('@') && val.length < 120) {
                            const m = val.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                            if (m) return m[0].toLowerCase();
                        }
                    }
                }
            } catch {}
            return 'user';
        }

        function sanitize(str) {
            return String(str || '').replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim();
        }

        function formatCreatedTime(iso) {
            if (!iso) return 'unknown';
            const d = new Date(iso);
            return isNaN(d) ? 'unknown' : d.toISOString().replace('T', '_').slice(0, 16).replace(':', '-');
        }

        function getExt(a) {
            if (a.mimeType?.includes('png')) return 'png';
            if (a.mimeType?.includes('webp')) return 'webp';
            if (a.mimeType?.includes('jpeg') || a.mimeType?.includes('jpg')) return 'jpg';
            if (a.mimeType?.includes('mp4')) return 'mp4';
            if (a.mimeType?.includes('webm')) return 'webm';
            return 'jpg';
        }

        function makeFilename(a) {
            return `${formatCreatedTime(a.createTime || a.createdAt)}_${sanitize(a.assetId || a.id || 'id')}.${getExt(a)}`;
        }

        function getDownloadUrl(a) {
            if (a.url) return a.url;
            if (a.downloadUrl) return a.downloadUrl;
            if (a.urlKeys?.content) return a.urlKeys.content;
            if (a.assetId) {
                return a.mimeType?.startsWith('video/')
                    ? `https://assets.grok.com/generated/${a.assetId}/video.mp4`
                    : `https://assets.grok.com/generated/${a.assetId}/image.jpg`;
            }
            return null;
        }

        function hasSignatureComment(data) {
            if (!(data instanceof Uint8Array) || data.length < 20) return false;
            const sig = new TextEncoder().encode('Signature:');
            const max = Math.min(data.length, 16384);
            for (let i = 0; i < max - sig.length; i++) {
                let ok = true;
                for (let j = 0; j < sig.length; j++) if (data[i + j] !== sig[j]) { ok = false; break; }
                if (ok) return true;
            }
            return false;
        }

        async function fetchAssetsPage(token) {
            const p = new URLSearchParams({
                pageSize: '100',
                orderBy: 'ORDER_BY_CREATE_TIME',
                source: 'SOURCE_ANY',
                isLatest: 'true',
                includeImagineFiles: 'true'
            });
            if (token) p.set('pageToken', token);
            const res = await fetch(`/rest/assets?${p}`, { credentials: 'include' });
            if (!res.ok) throw new Error(res.status);
            return res.json();
        }

        function crc32(buf) {
            let c = ~0;
            for (let i = 0; i < buf.length; i++) {
                c ^= buf[i];
                for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
            }
            return ~c >>> 0;
        }

        function createZip(files) {
            const parts = [], central = [];
            let offset = 0;
            for (const f of files) {
                const name = new TextEncoder().encode(f.name);
                const data = f.data;
                const crc = crc32(data);
                const size = data.length;

                const local = new Uint8Array(30 + name.length);
                const v = new DataView(local.buffer);
                v.setUint32(0, 0x04034b50, true);
                v.setUint16(4, 20, true);
                v.setUint32(14, crc, true);
                v.setUint32(18, size, true);
                v.setUint32(22, size, true);
                v.setUint16(26, name.length, true);
                local.set(name, 30);
                parts.push(local, data);

                const cent = new Uint8Array(46 + name.length);
                const cv = new DataView(cent.buffer);
                cv.setUint32(0, 0x02014b50, true);
                cv.setUint16(4, 20, true);
                cv.setUint16(6, 20, true);
                cv.setUint32(16, crc, true);
                cv.setUint32(20, size, true);
                cv.setUint32(24, size, true);
                cv.setUint16(28, name.length, true);
                cv.setUint32(42, offset, true);
                cent.set(name, 46);
                central.push(cent);
                offset += local.length + data.length;
            }
            const csize = central.reduce((s, h) => s + h.length, 0);
            const end = new Uint8Array(22);
            const ev = new DataView(end.buffer);
            ev.setUint32(0, 0x06054b50, true);
            ev.setUint16(8, files.length, true);
            ev.setUint16(10, files.length, true);
            ev.setUint32(12, csize, true);
            ev.setUint32(16, offset, true);

            const zip = new Uint8Array(offset + csize + 22);
            let pos = 0;
            for (const p of parts) { zip.set(p, pos); pos += p.length; }
            for (const h of central) { zip.set(h, pos); pos += h.length; }
            zip.set(end, pos);
            return zip;
        }

        async function downloadAsZip(type, btn) {
            const isVideo = type === 'video';
            const label = isVideo ? 'Videos' : 'Images';
            const prefix = isVideo ? 'video/' : 'image/';
            const original = btn.innerHTML;
            const email = getUserEmail().replace(/[\\/:*?"<>|@]/g, '_');

            btn.disabled = true;
            btn.innerHTML = '⏳ Listing...';

            try {
                const assets = [];
                let token = null, page = 0;
                do {
                    page++;
                    btn.innerHTML = `⏳ Page ${page} (${assets.length})`;
                    const data = await fetchAssetsPage(token);
                    assets.push(...(data.assets || data.items || []).filter(a => (a.mimeType || '').startsWith(prefix)));
                    token = data.nextPageToken || null;
                } while (token);

                if (!assets.length) {
                    alert(`Nenhum ${label.toLowerCase()} encontrado.`);
                    btn.innerHTML = original;
                    btn.disabled = false;
                    return;
                }

                const list = assets.map(a => ({
                    url: getDownloadUrl(a),
                    name: makeFilename(a)
                })).filter(i => i.url);

                btn.innerHTML = `⏳ ${list.length} arquivos...`;

                const files = [];
                let done = 0, fail = 0, notGrok = 0;
                const queue = [...list];

                async function worker() {
                    while (queue.length) {
                        const item = queue.shift();
                        try {
                            const buf = await new Promise((res, rej) => {
                                const t = setTimeout(() => rej('timeout'), 90000);
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: item.url,
                                    responseType: 'arraybuffer',
                                    onload: r => {
                                        clearTimeout(t);
                                        if (r.status >= 200 && r.status < 300) res(new Uint8Array(r.response));
                                        else rej(r.status);
                                    },
                                    onerror: e => { clearTimeout(t); rej(e); }
                                });
                            });
                            if (!isVideo && !hasSignatureComment(buf)) { notGrok++; continue; }
                            files.push({ name: item.name, data: buf });
                            done++;
                        } catch { fail++; }
                        btn.innerHTML = `⏳ ${done + fail + notGrok}/${list.length}`;
                    }
                }

                await Promise.all(Array.from({ length: Math.min(48, list.length) }, () => worker()));

                if (!files.length) {
                    alert(isVideo ? 'Todos falharam.' : 'Nenhuma imagem com Signature encontrada.');
                    btn.innerHTML = original;
                    btn.disabled = false;
                    return;
                }

                btn.innerHTML = `📦 ZIP (${files.length})...`;
                const blob = new Blob([createZip(files)], { type: 'application/zip' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${email} ${label.toLowerCase()}.zip`;
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 10000);

                btn.innerHTML = `✅ ${files.length}`;
                setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 4000);
            } catch (e) {
                console.error(e);
                alert('Erro: ' + e.message);
                btn.innerHTML = original;
                btn.disabled = false;
            }
        }

        function createButtons() {
            const box = document.createElement('div');
            box.className = 'grok-extra-buttons';
            box.style.cssText = 'display:flex;gap:8px;align-items:center;';
            box.append(
                createButton('Templates', 'https://grok.com/imagine/templates'),
                createButton('Files', 'https://grok.com/files'),
                createButton('Images', b => downloadAsZip('image', b), true),
                createButton('Videos', b => downloadAsZip('video', b), true)
            );
            return box;
        }

        function inject() {
            if (document.querySelector('.grok-extra-buttons')) return;

            const candidates = [...document.querySelectorAll('button, a, [role="button"]')];
            const target = candidates.find(el => {
                const t = (el.textContent || '').toLowerCase();
                return t.includes('new project') || t.includes('novo projeto') || t.includes('+ new');
            });

            if (target) {
                const wrap = document.createElement('div');
                wrap.style.cssText = 'display:flex;gap:8px;align-items:center;';
                target.parentNode.insertBefore(wrap, target);
                wrap.append(createButtons(), target);
                console.log('[Imagine] Botões injetados');
                return;
            }

            // Fallback fixo
            if (location.pathname.startsWith('/imagine') || location.pathname.startsWith('/files')) {
                const fixed = createButtons();
                fixed.style.cssText = 'position:fixed;top:70px;right:18px;z-index:99999;display:flex;gap:8px;';
                document.body.appendChild(fixed);
                console.log('[Imagine] Botões no canto (fallback)');
            }
        }

        function start() {
            inject();
            [800, 2000, 4000, 7000].forEach(t => setTimeout(inject, t));
        }

        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
        else start();

        new MutationObserver(() => {
            if (!document.querySelector('.grok-extra-buttons')) inject();
        }).observe(document.body || document.documentElement, { childList: true, subtree: true });

        const _push = history.pushState;
        const _replace = history.replaceState;
        history.pushState = function () { _push.apply(this, arguments); setTimeout(inject, 400); };
        history.replaceState = function () { _replace.apply(this, arguments); setTimeout(inject, 400); };
        window.addEventListener('popstate', () => setTimeout(inject, 400));
    }

    // ============================================================
    // 3. DETECTIVE ANI (só fora do Grok e Redgifs)
    // ============================================================
    if (!isGrok && !isRedgifs) {

        const MAKE_IMAGINE_LINK = uuid => `https://grok.com/imagine/post/${uuid}`;
        const BYTES_TO_FETCH = 65536;
        const MARKER = 'titlex$';
        const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
        const ICON_CLASS = 'titlex-ani';
        const ICON_CLASS_X = 'grok-uuid-icon';
        const ANI_STORAGE_KEY = 'detectiveAniHasShown';
        const ANI_IMAGE_URL = 'https://raw.githubusercontent.com/amushin67/DetectiveAni/refs/heads/main/detective_ani.webp';
        const ANI_WIDTH = 722;
        const ANI_HEIGHT = 327;
        const ANI_DURATION_MS = 7000;
        const ANI_FADE_MS = 700;

        const checkedUrls = new Set();
        const mediaState = new WeakMap();
        let iconsVisible = true;
        let aniAlreadyShown = false;
        let aniBlobUrl = null;

        try { aniAlreadyShown = sessionStorage.getItem(ANI_STORAGE_KEY) === 'true'; } catch {}

        GM_addStyle(`
            .${ICON_CLASS}, .${ICON_CLASS_X} {
                position:absolute!important;bottom:4px!important;right:4px!important;
                z-index:2147483647!important;width:8px!important;height:8px!important;
                font-size:8px!important;line-height:8px!important;cursor:pointer!important;
                transition:transform .15s ease,opacity .15s ease!important;
                user-select:none!important;pointer-events:auto!important;opacity:.9!important;
                filter:drop-shadow(0 0 2px rgba(0,0,0,.85));
            }
            .${ICON_CLASS}:hover, .${ICON_CLASS_X}:hover { transform:scale(1.8)!important;opacity:1!important; }
            .${ICON_CLASS}.hidden, .${ICON_CLASS_X}.hidden { display:none!important; }
            #detective-ani-overlay {
                position:fixed!important;bottom:0!important;right:0!important;
                width:${ANI_WIDTH}px!important;height:${ANI_HEIGHT}px!important;
                z-index:2147483646!important;pointer-events:none!important;opacity:0;
                transition:opacity ${ANI_FADE_MS}ms cubic-bezier(.4,0,.2,1)!important;
            }
            #detective-ani-overlay.visible { opacity:1!important; }
            #detective-ani-overlay.fade-out { opacity:0!important; }
        `);

        function loadAniAsBlob(cb) {
            if (aniBlobUrl) return cb(aniBlobUrl);
            GM_xmlhttpRequest({
                method: 'GET',
                url: ANI_IMAGE_URL,
                responseType: 'blob',
                timeout: 15000,
                onload(res) {
                    if (res.status >= 200 && res.status < 300 && res.response) {
                        aniBlobUrl = URL.createObjectURL(res.response);
                        cb(aniBlobUrl);
                    }
                }
            });
        }

        function showDetectiveAni() {
            if (aniAlreadyShown) return;
            aniAlreadyShown = true;
            try { sessionStorage.setItem(ANI_STORAGE_KEY, 'true'); } catch {}

            document.getElementById('detective-ani-overlay')?.remove();
            loadAniAsBlob(url => {
                const img = document.createElement('img');
                img.id = 'detective-ani-overlay';
                img.src = url;
                img.width = ANI_WIDTH;
                img.height = ANI_HEIGHT;
                img.style.cssText = `position:fixed!important;bottom:0!important;right:0!important;width:${ANI_WIDTH}px!important;height:${ANI_HEIGHT}px!important;z-index:2147483646!important;pointer-events:none!important;opacity:0;transition:opacity ${ANI_FADE_MS}ms cubic-bezier(.4,0,.2,1)!important;`;
                (document.body || document.documentElement).appendChild(img);
                void img.offsetWidth;
                requestAnimationFrame(() => img.classList.add('visible'));
                setTimeout(() => {
                    img.classList.remove('visible');
                    img.classList.add('fade-out');
                    setTimeout(() => img.remove(), ANI_FADE_MS + 50);
                }, ANI_DURATION_MS);
            });
        }

        window.forceDetectiveAni = () => {
            aniAlreadyShown = false;
            try { sessionStorage.removeItem(ANI_STORAGE_KEY); } catch {}
            showDetectiveAni();
        };

        function toggleIcons() {
            iconsVisible = !iconsVisible;
            document.querySelectorAll(`.${ICON_CLASS}, .${ICON_CLASS_X}`).forEach(i => i.classList.toggle('hidden', !iconsVisible));
        }

        document.addEventListener('keydown', e => {
            if (e.key === 'F4' && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault();
                toggleIcons();
            }
        }, true);

        function createIcon(uuid, cls = ICON_CLASS) {
            const icon = document.createElement('span');
            icon.className = cls;
            if (!iconsVisible) icon.classList.add('hidden');
            icon.textContent = '🔍';
            icon.title = `UUID: ${uuid}\nClique para abrir no Imagine\nF4 para mostrar/esconder`;
            icon.onclick = e => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                window.open(MAKE_IMAGINE_LINK(uuid), '_blank');
                navigator.clipboard?.writeText(uuid).catch(() => {});
            };
            return icon;
        }

        function ensureRelative(el) {
            if (!el) return null;
            if (getComputedStyle(el).position === 'static') {
                if (el.parentElement) {
                    const w = document.createElement('span');
                    w.style.cssText = 'position:relative;display:inline-block;max-width:100%;line-height:0;';
                    el.parentElement.insertBefore(w, el);
                    w.appendChild(el);
                    return w;
                }
                el.style.position = 'relative';
            }
            return el;
        }

        function addAniToMedia(media, uuid) {
            if (!uuid || media.dataset.titlexUuid === uuid) return;
            media.dataset.titlexUuid = uuid;
            media.parentElement?.querySelectorAll(`.${ICON_CLASS}`).forEach(e => e.remove());
            const container = ensureRelative(media.parentElement) || media.parentElement;
            if (container) {
                container.appendChild(createIcon(uuid));
                showDetectiveAni();
            }
        }

        function isRedgifsUrl(url) {
            return url && /redgifs\.com/i.test(String(url));
        }

        function isInsideRedgifs(el) {
            let n = el;
            while (n) {
                if (n.tagName === 'IFRAME') {
                    const src = n.src || n.getAttribute('src') || '';
                    if (isRedgifsUrl(src)) return true;
                }
                if (n.tagName === 'SHREDDIT-EMBED' || n.classList?.contains('redgifs')) return true;
                n = n.parentElement;
            }
            return false;
        }

        function extractUuidFromExif(buffer) {
            try {
                const view = new DataView(buffer);
                if (view.byteLength < 4 || view.getUint16(0) !== 0xFFD8) return null;
                let offset = 2;
                while (offset < view.byteLength - 4) {
                    if (view.getUint8(offset) !== 0xFF) break;
                    const marker = view.getUint8(offset + 1);
                    if (marker === 0xDA) break;
                    const size = view.getUint16(offset + 2);
                    if (marker === 0xE1 && view.getUint32(offset + 4) === 0x45786966 && view.getUint16(offset + 8) === 0) {
                        const tiff = offset + 10;
                        const little = view.getUint16(tiff) === 0x4949;
                        const r16 = o => view.getUint16(o, little);
                        const r32 = o => view.getUint32(o, little);
                        const ifd0 = tiff + r32(tiff + 4);
                        if (ifd0 >= view.byteLength) return null;
                        const entries = r16(ifd0);
                        for (let i = 0; i < entries; i++) {
                            const entry = ifd0 + 2 + i * 12;
                            if (entry + 12 > view.byteLength) break;
                            if (r16(entry) === 0x013B) {
                                const count = r32(entry + 4);
                                let vo = entry + 8;
                                if (count > 4) vo = tiff + r32(entry + 8);
                                if (vo + count > view.byteLength) return null;
                                let str = '';
                                for (let j = 0; j < count; j++) {
                                    const c = view.getUint8(vo + j);
                                    if (c === 0) break;
                                    str += String.fromCharCode(c);
                                }
                                const m = str.match(UUID_REGEX);
                                if (m) return m[0];
                            }
                        }
                    }
                    offset += 2 + size;
                }
            } catch {}
            return null;
        }

        function extractUuidFromFilename(url, isVideo = false) {
            if (!url) return null;
            let filename = '', fn = null;
            try {
                const u = new URL(url);
                filename = decodeURIComponent(u.pathname.split('/').pop() || '');
                fn = u.searchParams.get('fn');
                if (fn) { fn = decodeURIComponent(fn); filename += ' ' + fn; }
            } catch { filename = url; }

            const gen = filename.match(/_generated_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
            if (gen) return gen[1];

            if (isVideo) {
                if (fn) {
                    const m = fn.match(/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\.[a-z0-9]+)?$/i);
                    if (m) return m[1];
                }
                const m2 = filename.match(/(?:^|[\s\/])([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\.[a-z0-9]+)?(?:$|[\s?&#])/i);
                if (m2) return m2[1];
            }
            if (/grok/i.test(filename)) {
                const m = filename.match(UUID_REGEX);
                if (m) return m[0];
            }
            return null;
        }

        function findUUIDInBuffer(buf) {
            try {
                const text = new TextDecoder('latin1').decode(buf);
                const idx = text.indexOf(MARKER);
                if (idx === -1) return null;
                const after = text.slice(idx + MARKER.length, idx + MARKER.length + 60);
                const m = after.match(UUID_REGEX);
                return m ? m[0] : null;
            } catch { return null; }
        }

        function checkUrl(url, media) {
            if (!url || isRedgifsUrl(url) || (media && isInsideRedgifs(media))) return;
            const clean = url.split(/["'\s<>]/)[0];
            if (isRedgifsUrl(clean)) return;

            const isImg = media?.tagName === 'IMG' || /\.(jpe?g|png|webp|gif)(\?|$)/i.test(clean);
            const isVid = media?.tagName === 'VIDEO' || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(clean);
            if (!isImg && !isVid) return;

            const fromName = extractUuidFromFilename(clean, isVid);
            if (fromName && media) addAniToMedia(media, fromName);

            if (checkedUrls.has(clean)) return;
            checkedUrls.add(clean);

            GM_xmlhttpRequest({
                method: 'GET',
                url: clean,
                headers: { Range: `bytes=0-${BYTES_TO_FETCH - 1}` },
                responseType: 'arraybuffer',
                timeout: 10000,
                onload(res) {
                    if (res.status !== 200 && res.status !== 206) return;
                    let uuid = null;
                    if (isVid) uuid = findUUIDInBuffer(res.response);
                    else if (isImg) uuid = extractUuidFromExif(res.response);
                    if (uuid && media) addAniToMedia(media, uuid);
                }
            });
        }

        function processMedia(media) {
            if (!media || media.dataset.titlexUuid || isInsideRedgifs(media) || isRedgifsUrl(media.src) || isRedgifsUrl(media.currentSrc)) return;

            const state = mediaState.get(media) || { tries: 0, lastSrc: '' };
            const src = media.currentSrc || media.src || media.getAttribute('src') || '';
            if (src && src !== state.lastSrc) { state.tries = 0; state.lastSrc = src; }
            state.tries++;
            mediaState.set(media, state);
            if (state.tries > 10) return;

            const urls = new Set();
            if (media.src) urls.add(media.src);
            if (media.currentSrc) urls.add(media.currentSrc);
            if (media.tagName === 'VIDEO') media.querySelectorAll('source').forEach(s => s.src && urls.add(s.src));
            ['data-src', 'data-original', 'data-lazy-src', 'data-url'].forEach(a => {
                const v = media.getAttribute(a);
                if (v) urls.add(v);
            });
            if (media.tagName === 'IMG' && media.srcset) {
                media.srcset.split(',').forEach(p => {
                    const u = p.trim().split(/\s+/)[0];
                    if (u) urls.add(u);
                });
            }
            urls.forEach(u => checkUrl(u, media));
        }

        function scan() {
            document.querySelectorAll('video, img').forEach(processMedia);
            document.querySelectorAll('iframe').forEach(iframe => {
                try {
                    const src = (iframe.src || iframe.getAttribute('src') || '').toLowerCase();
                    if (src.includes('redgifs.com')) return;
                    if (iframe.closest('shreddit-embed') || iframe.closest('[class*="redgifs"]')) return;
                    const doc = iframe.contentDocument;
                    if (doc) doc.querySelectorAll('video, img').forEach(processMedia);
                } catch {}
            });
        }

        // Twitter / X
        const isX = location.hostname === 'x.com' || location.hostname === 'twitter.com' ||
                    location.hostname.endsWith('.x.com') || location.hostname.endsWith('.twitter.com');

        if (isX) {
            const processed = new WeakSet();
            let scanning = false, timer = null;

            function extractMediaObjects(article) {
                const results = [], seen = new Set();
                const candidates = [article, ...article.querySelectorAll('[data-testid="tweetPhoto"],[data-testid="videoComponent"],[data-testid="tweetText"],div[style*="position"]')];
                for (const el of candidates) {
                    const key = Object.keys(el).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
                    if (!key) continue;
                    let fiber = el[key], depth = 0;
                    while (fiber && depth < 35) {
                        try {
                            if (fiber.memoizedProps) {
                                const str = JSON.stringify(fiber.memoizedProps);
                                const re = /"grok_post_id"\s*:\s*"([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})"/gi;
                                let m;
                                while ((m = re.exec(str))) {
                                    const uuid = m[1];
                                    if (seen.has(uuid)) continue;
                                    const chunk = str.slice(Math.max(0, m.index - 250), Math.min(str.length, m.index + 420));
                                    const mediaKey = (chunk.match(/"media_key"\s*:\s*"([^"]+)"/) || [])[1];
                                    const type = (chunk.match(/"type"\s*:\s*"([^"]+)"/) || [])[1];
                                    const expanded = (chunk.match(/"expanded_url"\s*:\s*"([^"]+)"/) || [])[1];
                                    const idStr = (chunk.match(/"id_str"\s*:\s*"(\d+)"/) || [])[1];
                                    const isVideo = type === 'video' || (mediaKey && mediaKey.startsWith('13_')) ||
                                        (expanded && expanded.includes('/video/')) || (idStr && chunk.includes('amplify_video'));
                                    results.push({ uuid, isVideo });
                                    seen.add(uuid);
                                }
                            }
                        } catch {}
                        fiber = fiber.return;
                        depth++;
                    }
                }
                return results;
            }

            function addIconX(el, uuid) {
                if (!uuid || el.parentElement?.querySelector(`.${ICON_CLASS_X}`)) return;
                const container = el.closest('[data-testid="tweetPhoto"]') || el.closest('[data-testid="videoComponent"]') || el.parentElement;
                if (!container) return;
                if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
                const icon = createIcon(uuid, ICON_CLASS_X);
                icon.style.bottom = '6px';
                icon.style.right = '6px';
                container.appendChild(icon);
                showDetectiveAni();
            }

            function processTweet(article) {
                const medias = article.querySelectorAll('[data-testid="tweetPhoto"] img, [data-testid="videoComponent"] video');
                if (processed.has(article) && article.querySelectorAll(`.${ICON_CLASS_X}`).length >= medias.length && medias.length) return;

                const objs = extractMediaObjects(article);
                if (!objs.length) return;
                processed.add(article);

                const photos = [...article.querySelectorAll('[data-testid="tweetPhoto"] img')].filter(i => i.offsetWidth > 40);
                const uniqueP = [];
                const seenP = new Set();
                for (const img of photos) {
                    const k = img.src.split('?')[0];
                    if (!seenP.has(k)) { seenP.add(k); uniqueP.push(img); }
                }
                const photoUUIDs = objs.filter(o => !o.isVideo).map(o => o.uuid);
                uniqueP.forEach((img, i) => {
                    const u = photoUUIDs[i] || photoUUIDs[0];
                    if (u) addIconX(img, u);
                });

                const videos = [...article.querySelectorAll('[data-testid="videoComponent"] video')].filter(v => v.offsetWidth > 40);
                const uniqueV = [];
                const seenV = new Set();
                for (const v of videos) {
                    const k = v.poster || v.src || v.currentSrc;
                    if (!seenV.has(k)) { seenV.add(k); uniqueV.push(v); }
                }
                const videoUUIDs = objs.filter(o => o.isVideo).map(o => o.uuid);
                uniqueV.forEach((v, i) => {
                    const u = videoUUIDs[i] || videoUUIDs[0] || objs.find(o => o.isVideo)?.uuid;
                    if (u) addIconX(v, u);
                });
            }

            function scanX() {
                if (scanning) return;
                scanning = true;
                requestAnimationFrame(() => {
                    document.querySelectorAll('article[data-testid="tweet"]').forEach(processTweet);
                    scanning = false;
                });
            }

            function schedule() {
                if (timer) return;
                timer = setTimeout(() => { timer = null; scanX(); }, 140);
            }

            new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
            window.addEventListener('scroll', schedule, { passive: true });
            setInterval(scanX, 1800);
            setTimeout(scanX, 500);
            setTimeout(scanX, 1500);
            setTimeout(scanX, 3000);
        } else {
            // Sites genéricos
            new MutationObserver(muts => {
                let need = false;
                for (const m of muts) {
                    if (m.type === 'childList') {
                        for (const n of m.addedNodes) {
                            if (n.nodeType !== 1) continue;
                            if (n.tagName === 'IFRAME' && isRedgifsUrl(n.src || n.getAttribute('src'))) continue;
                            if (n.querySelector?.('iframe[src*="redgifs"]')) continue;
                            need = true;
                            break;
                        }
                    } else if (m.type === 'attributes' && (m.target.tagName === 'VIDEO' || m.target.tagName === 'IMG')) {
                        if (!isInsideRedgifs(m.target) && !isRedgifsUrl(m.target.src)) processMedia(m.target);
                    }
                }
                if (need) scan();
            }).observe(document.documentElement, {
                childList: true, subtree: true, attributes: true,
                attributeFilter: ['src', 'srcset', 'data-src', 'data-original']
            });

            ['loadstart', 'loadedmetadata', 'load', 'canplay'].forEach(evt => {
                document.addEventListener(evt, e => {
                    if ((e.target.tagName === 'VIDEO' || e.target.tagName === 'IMG') &&
                        !isInsideRedgifs(e.target) && !isRedgifsUrl(e.target.src || e.target.currentSrc)) {
                        processMedia(e.target);
                    }
                }, true);
            });

            scan();
            [600, 1500, 3000, 6000, 10000].forEach(t => setTimeout(scan, t));
            let ticks = 0;
            const keep = setInterval(() => {
                scan();
                if (++ticks > 5) clearInterval(keep);
            }, 5000);
        }

        console.log('%c[Detective Ani] Ativo', 'color:#00ff88;font-weight:bold');
    }

})();
