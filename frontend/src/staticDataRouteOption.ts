export interface CustomStaticDataRouteOption {
  /**
   * @see https://ogp.me/
   */
  openGraph: {
    /** Raw text or EJS */
    title: string;
    type: OpenGraphProtocolType;
    /** Raw text or EJS */
    description: string;
    /** Raw text or EJS */
    imageUrl?: string;
  };
}

/**
 * backend から EJS レンダリング時に置換される変数のキー
 *
 * @todo backend のパッケージから提供したいがとりあえずここで定義
 */
export const BACKEND_EJS_VARIABLE_KEYS = {
  /**
   * サイトがホストされている URL の origin 部
   *
   * 末尾スラッシュなし
   * @example https://frost.example.com
   */
  origin: "origin",
  /** サイト名 */
  siteName: "siteName",
  /**
   * リクエストのパス
   *
   * `/` で始まる
   */
  path: "path",
} as const;

/**
 * @see https://ogp.me/
 */
export const OPEN_GRAPH_PROTOCOL = {
  type: {
    // Music
    musicSong: "music.song",
    musicAlbum: "music.album",
    musicPlaylist: "music.playlist",
    musicRadioStation: "music.radio_station",
    // Video
    videoMovie: "video.movie",
    videoEpisode: "video.episode",
    videoTvShow: "video.tv_show",
    videoOther: "video.other",
    // No Vertical
    article: "article",
    book: "book",
    profile: "profile",
    website: "website",
  },
} as const;
export type OpenGraphProtocolType =
  (typeof OPEN_GRAPH_PROTOCOL.type)[keyof typeof OPEN_GRAPH_PROTOCOL.type];

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption extends CustomStaticDataRouteOption {}
}
