export enum ChannelType {
    FACEBOOK = "FB_MESSAGE",
    ZALO = "ZL_MESSAGE"
}

export const TYPE = {
    IMAGE: 'image',
    FILE: 'file',
    STICKER: 'sticker',
    GIF: 'gif',
    LINK: 'link',
}

export const DEFAULT_SENDER_NAME = {
    NOT_FOLLOW: 'Liên hệ chưa follow OA',
    NOT_TOKEN: 'Not find token'
}

export const EVENT_ZALO = {
    FOLLOW: 'follow',
    UN_FOLLOW: 'unfollow'
}

export const ERROR_CODE_ZALO = {
    NOT_FOLLOW: '-213'
}