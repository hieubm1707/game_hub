import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  SUPPORTED_LOCALE_CODES,
  type CompactCatalogGame,
  type GameRecord,
  type SupportedLocale,
} from '@game-hub/contract';

export type { SupportedLocale };

export interface LocaleMeta {
  code: SupportedLocale;
  shortLabel: string;
  nativeLabel: string;
}

export const SUPPORTED_LOCALES: LocaleMeta[] = [
  { code: 'en', shortLabel: 'EN', nativeLabel: 'English' },
  { code: 'vi', shortLabel: 'VI', nativeLabel: 'Tiếng Việt' },
  { code: 'ja', shortLabel: 'JA', nativeLabel: '日本語' },
];

const STORAGE_KEY = 'game_hub_locale';

const MESSAGES = {
  en: {
    // Topbar & Header & Footer
    'topbar.tagline': 'FREE TO PLAY • OFFLINE-FIRST',
    'topbar.localSave': 'LOCAL SAVE ONLY // NO LOGIN',
    'header.searchPlaceholder': 'Search offline-first games...',
    'header.searchAria': 'Search games',
    'header.go': 'GO',
    'nav.games': 'Games',
    'nav.languageAria': 'Select language',
    'footer.copyright': '© {year} Game Hub. All rights reserved.',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',

    // Common & Cards
    'common.playNow': 'Play Now',
    'common.details': 'Details',
    'common.featured': 'Featured',
    'common.nowPlaying': 'Now Playing',
    'common.offlineFirst': 'Offline-First',
    'common.all': 'All',
    'common.allGames': 'All Games',
    'common.viewAll': 'View all →',
    'common.backToHome': 'Back to Home',
    'common.backToCatalog': 'Back to Catalog',
    'common.backToGames': 'Back to Games',
    'common.browseGames': 'Browse Games',
    'common.returnToGames': 'Return to Games',
    'common.loadingCatalog': 'Loading catalog...',
    'common.loadingGames': 'Loading games...',
    'common.loadingGameDetails': 'Loading game details...',
    'common.preparingGame': 'Preparing game...',
    'common.noGamesFound': 'No games found.',
    'common.refresh': 'Refresh',
    'common.refreshCatalog': 'Refresh catalog',
    'common.retry': 'Retry',
    'common.exit': 'Exit',
    'common.close': 'Close',
    'common.gameFallback': 'Game',

    // HomePage
    'home.docTitle': 'Discover Games',
    'home.docDesc': 'Play free, offline-first Flutter games directly in your browser.',
    'home.heroAria': 'Featured games banner',
    'home.prevSlide': 'Previous featured game',
    'home.nextSlide': 'Next featured game',
    'home.goToSlide': 'Go to slide {n}',
    'home.emptyHeroTitle': 'Play Offline-First Flutter Games Instantly',
    'home.emptyHeroDesc':
      'Browse and play directly in your browser with no account required, or install the native Android/iOS app for full offline play.',
    'home.browseAllGames': 'Browse All Games',
    'home.cachedNotice': 'Showing cached catalog while checking for updates...',
    'home.filterPlaceholder': 'Filter games...',
    'home.filterAria': 'Filter games',
    'home.noMatchingGames': 'No matching published games found.',
    'home.recentlyUpdated': 'Recently Updated',
    'home.scrollLeft': 'Scroll left',
    'home.scrollRight': 'Scroll right',
    'home.overviewTitle': 'Play Handcrafted Offline-First Games in Your Browser',
    'home.overviewLearnMore': 'Learn More →',
    'home.overviewBody':
      'Game Hub brings together original puzzle, deduction, and strategy games designed for instant play on desktop and mobile browsers—no downloads or accounts required. Each title saves your progress locally in your browser so you can pick up right where you left off, or install the companion Android and iOS apps when available for full offline play.',

    // GamesListPage
    'catalog.eyebrow': '// GAME CATALOG',
    'catalog.categoryHeading': 'Category: {category}',
    'catalog.searchHeading': 'Search: "{query}"',
    'catalog.filterLocalPlaceholder': 'Filter games locally...',
    'catalog.filterLocalAria': 'Filter games locally',
    'catalog.emptyCached': 'No matching games found in cached catalog.',

    // GameDetailPage
    'detail.notFoundTitle': 'Game not found',
    'detail.notFoundDesc': 'This game may be unpublished or archived.',
    'detail.aboutHeading': '// About',
    'detail.howToPlayHeading': '// How to Play',
    'detail.getGooglePlay': 'Get on Google Play',
    'detail.getAppStore': 'Get on App Store',
    'detail.orientation': 'ORIENTATION',
    'detail.relatedGames': 'Related Games',
    'detail.docTitleFallback': 'Game Details',

    // PlayPage & GamePlayer
    'player.gameUnavailable': 'Game unavailable',
    'player.webPlayer': 'Web Player',
    'player.score': 'Score',
    'player.pause': 'Pause',
    'player.resume': 'Resume',
    'player.mute': 'Mute',
    'player.unmute': 'Unmute',
    'player.reload': 'Reload game',
    'player.fullscreen': 'Fullscreen',
    'player.exitFullscreen': 'Exit fullscreen',
    'player.showControls': 'Show controls',
    'player.loadingGame': 'Loading {title}...',
    'player.systemError': 'SYSTEM ERROR',
    'player.untrustedOrigin': 'This game artifact URL is missing or not from a trusted origin.',
    'player.iframeFailed': 'Failed to load game iframe.',

    // InstallPromptModal
    'install.topbar': '// NATIVE APP AVAILABLE',
    'install.title': 'Play on the app',
    'install.desc': 'Enjoy offline gameplay and the native mobile app experience.',
    'install.continueWeb': 'Continue Playing on Web',

    // Legal / Info Pages
    'legal.notFoundBadge': '404 • Not Found',
    'legal.notFoundTitle': 'Page Not Found',
    'legal.notFoundDesc':
      'The page or game you are looking for may have been moved, renamed, or is no longer available.',
  },
  vi: {
    // Topbar & Header & Footer
    'topbar.tagline': 'CHƠI MIỄN PHÍ • HỖ TRỢ OFFLINE',
    'topbar.localSave': 'LƯU CỤC BỘ // KHÔNG CẦN ĐĂNG NHẬP',
    'header.searchPlaceholder': 'Tìm kiếm game offline-first...',
    'header.searchAria': 'Tìm kiếm game',
    'header.go': 'TÌM',
    'nav.games': 'Trò chơi',
    'nav.languageAria': 'Chọn ngôn ngữ',
    'footer.copyright': '© {year} Game Hub. Bảo lưu mọi quyền.',
    'footer.about': 'Giới thiệu',
    'footer.contact': 'Liên hệ',
    'footer.privacy': 'Quyền riêng tư',
    'footer.terms': 'Điều khoản',

    // Common & Cards
    'common.playNow': 'Chơi ngay',
    'common.details': 'Chi tiết',
    'common.featured': 'Nổi bật',
    'common.nowPlaying': 'Đang nổi bật',
    'common.offlineFirst': 'Chơi Offline',
    'common.all': 'Tất cả',
    'common.allGames': 'Tất cả game',
    'common.viewAll': 'Xem tất cả →',
    'common.backToHome': 'Về trang chủ',
    'common.backToCatalog': 'Về danh mục',
    'common.backToGames': 'Về danh sách game',
    'common.browseGames': 'Khám phá game',
    'common.returnToGames': 'Quay lại danh sách game',
    'common.loadingCatalog': 'Đang tải danh mục...',
    'common.loadingGames': 'Đang tải danh sách game...',
    'common.loadingGameDetails': 'Đang tải thông tin game...',
    'common.preparingGame': 'Đang chuẩn bị game...',
    'common.noGamesFound': 'Không tìm thấy game nào.',
    'common.refresh': 'Làm mới',
    'common.refreshCatalog': 'Làm mới danh mục',
    'common.retry': 'Thử lại',
    'common.exit': 'Thoát',
    'common.close': 'Đóng',
    'common.gameFallback': 'Trò chơi',

    // HomePage
    'home.docTitle': 'Khám phá Game',
    'home.docDesc': 'Chơi miễn phí các game Flutter offline-first ngay trên trình duyệt của bạn.',
    'home.heroAria': 'Banner game nổi bật',
    'home.prevSlide': 'Banner trước',
    'home.nextSlide': 'Banner tiếp theo',
    'home.goToSlide': 'Chuyển tới slide {n}',
    'home.emptyHeroTitle': 'Chơi Game Flutter Offline-First Ngay Lập Tức',
    'home.emptyHeroDesc':
      'Khám phá và chơi trực tiếp trên trình duyệt không cần tài khoản, hoặc cài ứng dụng Android/iOS để chơi offline trọn vẹn.',
    'home.browseAllGames': 'Xem tất cả game',
    'home.cachedNotice': 'Đang hiển thị danh mục đã lưu trong khi kiểm tra cập nhật...',
    'home.filterPlaceholder': 'Lọc game...',
    'home.filterAria': 'Lọc game',
    'home.noMatchingGames': 'Không tìm thấy game phù hợp.',
    'home.recentlyUpdated': 'Mới cập nhật',
    'home.scrollLeft': 'Cuộn trái',
    'home.scrollRight': 'Cuộn phải',
    'home.overviewTitle': 'Chơi Game Giải Đố & Chiến Thuật Ngay Trên Trình Duyệt',
    'home.overviewLearnMore': 'Tìm hiểu thêm →',
    'home.overviewBody':
      'Game Hub quy tụ các tựa game giải đố, suy luận và chiến thuật nguyên bản được thiết kế để chơi ngay trên trình duyệt máy tính lẫn điện thoại — không cần tải về hay tạo tài khoản. Mỗi trò chơi tự động lưu tiến trình cục bộ trên trình duyệt để bạn tiếp tục bất kỳ lúc nào, hoặc cài đặt ứng dụng Android và iOS đi kèm để chơi offline hoàn toàn.',

    // GamesListPage
    'catalog.eyebrow': '// DANH MỤC GAME',
    'catalog.categoryHeading': 'Thể loại: {category}',
    'catalog.searchHeading': 'Tìm kiếm: "{query}"',
    'catalog.filterLocalPlaceholder': 'Lọc nhanh danh sách game...',
    'catalog.filterLocalAria': 'Lọc nhanh danh sách game',
    'catalog.emptyCached': 'Không có game nào khớp với bộ lọc hiện tại.',

    // GameDetailPage
    'detail.notFoundTitle': 'Không tìm thấy game',
    'detail.notFoundDesc': 'Trò chơi này có thể chưa được phát hành hoặc đã lưu trữ.',
    'detail.aboutHeading': '// Giới thiệu',
    'detail.howToPlayHeading': '// Cách chơi',
    'detail.getGooglePlay': 'Tải trên Google Play',
    'detail.getAppStore': 'Tải trên App Store',
    'detail.orientation': 'HƯỚNG MÀN HÌNH',
    'detail.relatedGames': 'Game tương tự',
    'detail.docTitleFallback': 'Chi tiết game',

    // PlayPage & GamePlayer
    'player.gameUnavailable': 'Game không khả dụng',
    'player.webPlayer': 'Trình chơi Web',
    'player.score': 'Điểm',
    'player.pause': 'Tạm dừng',
    'player.resume': 'Tiếp tục',
    'player.mute': 'Tắt tiếng',
    'player.unmute': 'Bật tiếng',
    'player.reload': 'Tải lại game',
    'player.fullscreen': 'Toàn màn hình',
    'player.exitFullscreen': 'Thu nhỏ màn hình',
    'player.showControls': 'Hiện thanh điều khiển',
    'player.loadingGame': 'Đang tải {title}...',
    'player.systemError': 'LỖI HỆ THỐNG',
    'player.untrustedOrigin': 'Đường dẫn game bị thiếu hoặc không thuộc nguồn đáng tin cậy.',
    'player.iframeFailed': 'Không thể tải khung chơi game.',

    // InstallPromptModal
    'install.topbar': '// ĐÃ CÓ ỨNG DỤNG DI ĐỘNG',
    'install.title': 'Chơi trên ứng dụng',
    'install.desc': 'Trải nghiệm mượt mà hơn và chơi offline trọn vẹn trên ứng dụng di động.',
    'install.continueWeb': 'Tiếp tục chơi trên Web',

    // Legal / Info Pages
    'legal.notFoundBadge': '404 • Không tìm thấy',
    'legal.notFoundTitle': 'Không tìm thấy trang',
    'legal.notFoundDesc':
      'Trang hoặc trò chơi bạn đang tìm có thể đã được di chuyển, đổi tên hoặc không còn tồn tại.',
  },
  ja: {
    // Topbar & Header & Footer
    'topbar.tagline': '無料プレイ • オフライン対応',
    'topbar.localSave': 'ローカル保存のみ // ログイン不要',
    'header.searchPlaceholder': 'オフライン対応ゲームを検索...',
    'header.searchAria': 'ゲームを検索',
    'header.go': '検索',
    'nav.games': 'ゲーム一覧',
    'nav.languageAria': '言語を選択',
    'footer.copyright': '© {year} Game Hub. All rights reserved.',
    'footer.about': '概要',
    'footer.contact': 'お問い合わせ',
    'footer.privacy': 'プライバシー',
    'footer.terms': '利用規約',

    // Common & Cards
    'common.playNow': '今すぐプレイ',
    'common.details': '詳細',
    'common.featured': 'おすすめ',
    'common.nowPlaying': 'ピックアップ',
    'common.offlineFirst': 'オフライン対応',
    'common.all': 'すべて',
    'common.allGames': 'すべてのゲーム',
    'common.viewAll': 'すべて見る →',
    'common.backToHome': 'ホームへ戻る',
    'common.backToCatalog': 'カタログへ戻る',
    'common.backToGames': 'ゲーム一覧へ戻る',
    'common.browseGames': 'ゲームを探す',
    'common.returnToGames': 'ゲーム一覧へ戻る',
    'common.loadingCatalog': 'カタログを読み込み中...',
    'common.loadingGames': 'ゲームを読み込み中...',
    'common.loadingGameDetails': 'ゲーム詳細を読み込み中...',
    'common.preparingGame': 'ゲームを準備中...',
    'common.noGamesFound': 'ゲームが見つかりません。',
    'common.refresh': '更新',
    'common.refreshCatalog': 'カタログを更新',
    'common.retry': '再試行',
    'common.exit': '終了',
    'common.close': '閉じる',
    'common.gameFallback': 'ゲーム',

    // HomePage
    'home.docTitle': 'ゲームを探す',
    'home.docDesc': 'オフライン対応のFlutterゲームをブラウザで無料プレイ。',
    'home.heroAria': 'おすすめゲームバナー',
    'home.prevSlide': '前のスライド',
    'home.nextSlide': '次のスライド',
    'home.goToSlide': 'スライド {n} へ移動',
    'home.emptyHeroTitle': 'オフライン対応Flutterゲームをすぐプレイ',
    'home.emptyHeroDesc':
      'アカウント不要でブラウザからすぐ遊べます。Android/iOSアプリをインストールすれば完全オフラインでも楽しめます。',
    'home.browseAllGames': 'すべてのゲームを見る',
    'home.cachedNotice': '更新を確認中…キャッシュ済みのカタログを表示しています。',
    'home.filterPlaceholder': 'ゲームを絞り込む...',
    'home.filterAria': 'ゲームを絞り込む',
    'home.noMatchingGames': '条件に一致するゲームが見つかりませんでした。',
    'home.recentlyUpdated': '最近の更新',
    'home.scrollLeft': '左へスクロール',
    'home.scrollRight': '右へスクロール',
    'home.overviewTitle': 'ブラウザですぐ遊べるオリジナル・オフライン対応ゲーム',
    'home.overviewLearnMore': '詳しく見る →',
    'home.overviewBody':
      'Game Hubでは、ダウンロードや会員登録なしでPC・スマホのブラウザからすぐ遊べるオリジナルのパズル・推理・ストラテジーゲームをお届けします。プレイ記録はブラウザ内にローカル保存されるため、いつでも続きから再開でき、対応するAndroid/iOSアプリをインストールしてオフラインで遊ぶこともできます。',

    // GamesListPage
    'catalog.eyebrow': '// ゲームカタログ',
    'catalog.categoryHeading': 'カテゴリ: {category}',
    'catalog.searchHeading': '検索: "{query}"',
    'catalog.filterLocalPlaceholder': 'カタログ内を絞り込む...',
    'catalog.filterLocalAria': 'カタログ内を絞り込む',
    'catalog.emptyCached': '一致するゲームが見つかりませんでした。',

    // GameDetailPage
    'detail.notFoundTitle': 'ゲームが見つかりません',
    'detail.notFoundDesc': 'このゲームは非公開またはアーカイブされている可能性があります。',
    'detail.aboutHeading': '// ゲーム概要',
    'detail.howToPlayHeading': '// 遊び方',
    'detail.getGooglePlay': 'Google Play で入手',
    'detail.getAppStore': 'App Store で入手',
    'detail.orientation': '画面の向き',
    'detail.relatedGames': '関連ゲーム',
    'detail.docTitleFallback': 'ゲーム詳細',

    // PlayPage & GamePlayer
    'player.gameUnavailable': 'ゲームを利用できません',
    'player.webPlayer': 'Webプレイヤー',
    'player.score': 'スコア',
    'player.pause': '一時停止',
    'player.resume': '再開',
    'player.mute': 'ミュート',
    'player.unmute': 'ミュート解除',
    'player.reload': 'ゲームを再読み込み',
    'player.fullscreen': '全画面表示',
    'player.exitFullscreen': '全画面を終了',
    'player.showControls': 'コントロールを表示',
    'player.loadingGame': '{title} を読み込み中...',
    'player.systemError': 'システムエラー',
    'player.untrustedOrigin': 'ゲームのURLが未設定、または信頼されたオリジンではありません。',
    'player.iframeFailed': 'ゲーム画面の読み込みに失敗しました。',

    // InstallPromptModal
    'install.topbar': '// モバイルアプリ配信中',
    'install.title': 'アプリでプレイ',
    'install.desc': 'モバイルアプリならオフラインでも快適にプレイできます。',
    'install.continueWeb': 'Webでそのままプレイ',

    // Legal / Info Pages
    'legal.notFoundBadge': '404 • ページが見つかりません',
    'legal.notFoundTitle': 'ページが見つかりません',
    'legal.notFoundDesc':
      'お探しのページまたはゲームは移動・名称変更されたか、現在利用できません。',
  },
} as const;

export type TranslationKey = keyof typeof MESSAGES.en;

function isSupportedLocale(value: string | null): value is SupportedLocale {
  return value !== null && (SUPPORTED_LOCALE_CODES as readonly string[]).includes(value);
}

function detectInitialLocale(): SupportedLocale {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isSupportedLocale(saved)) {
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  const navLang = (typeof navigator !== 'undefined' ? navigator.language ?? '' : '').toLowerCase();
  if (navLang.startsWith('vi')) return 'vi';
  if (navLang.startsWith('ja')) return 'ja';
  return 'en';
}

interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (next: SupportedLocale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: SupportedLocale;
}) {
  const [locale, setLocaleState] = useState<SupportedLocale>(
    () => initialLocale ?? detectInitialLocale()
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore storage errors
    }
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      t: (key, params) => {
        let result: string = MESSAGES[locale][key] ?? MESSAGES.en[key] ?? key;
        if (!params) return result;
        for (const [k, v] of Object.entries(params)) {
          result = result.split(`{${k}}`).join(String(v));
        }
        return result;
      },
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}

export function getLocalizedGameText(
  game: Pick<CompactCatalogGame, 'title' | 'shortDescription' | 'translations'> &
    Partial<Pick<GameRecord, 'description' | 'howToPlay'>>,
  locale: SupportedLocale
) {
  const tr = game.translations?.[locale] as
    | { title?: string; shortDescription?: string; description?: string; howToPlay?: string }
    | undefined;
  return {
    title: tr?.title?.trim() || game.title,
    shortDescription: tr?.shortDescription?.trim() || game.shortDescription,
    description: tr?.description?.trim() || game.description || '',
    howToPlay: tr?.howToPlay?.trim() || game.howToPlay || '',
  };
}

/** Case-insensitive match across original and localized game text, categories, and tags. */
export function matchesGameQuery(
  game: Pick<
    CompactCatalogGame,
    'title' | 'shortDescription' | 'translations' | 'categories' | 'tags'
  >,
  query: string,
  locale: SupportedLocale
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const localized = getLocalizedGameText(game, locale);
  return (
    game.title.toLowerCase().includes(q) ||
    localized.title.toLowerCase().includes(q) ||
    game.shortDescription.toLowerCase().includes(q) ||
    localized.shortDescription.toLowerCase().includes(q) ||
    game.categories.some((c) => c.toLowerCase().includes(q)) ||
    (game.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
  );
}
