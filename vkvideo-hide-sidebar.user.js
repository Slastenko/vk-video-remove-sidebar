// ==UserScript==
// @name         VK Video - Remove Sidebar
// @namespace    Slastenko
// @version      1.1
// @description  Убирает правый столбец с плейлистами для расширения видео на vkvideo.ru и vk.com
// @author       Slastenko
// @match        *://vkvideo.ru/*
// @match        *://*.vkvideo.ru/*
// @match        *://vk.com/*
// @match        *://*.vk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vkvideo.ru
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Внедряем CSS стили
    GM_addStyle(`
        /* Жестко скрываем правую колонку */
        div[class*="vkitTwoColumnLayoutNarrow__root"],
        [data-testid="video_page_playlist_videos"] {
            display: none !important;
            width: 0 !important;
            min-width: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* Принудительно заставляем левую колонку (с видео) занять 100% ширины */
        div[class*="vkitTwoColumnLayoutMain__root"] {
            max-width: 100% !important;
            width: 100% !important;
            flex-basis: 100% !important;
        }
    `);

    // Логика удаления элементов
    function destroySidebar() {
        const narrowCol = document.querySelector('div[class*="vkitTwoColumnLayoutNarrow__root"]');
        if (narrowCol) {
            narrowCol.remove();
        }

        const playlist = document.querySelector('[data-testid="video_page_playlist_videos"]');
        if (playlist) {
            const splitCol = playlist.closest('.vkuiSplitCol__host');
            if (splitCol) {
                splitCol.remove();
            } else {
                playlist.remove();
            }
        }
    }

    // Запускаем сразу
    destroySidebar();

    // Отслеживаем любые изменения на странице (SPA-навигация)
    const observer = new MutationObserver(() => {
        destroySidebar();
    });

    function startObserver() {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            setTimeout(startObserver, 100);
        }
    }
    startObserver();

    // Запасной план: добиваем колонку каждую секунду, если React её восстановил
    setInterval(destroySidebar, 1000);
})();
