declare enum HANDTYPE {
    Fake = -1,
    Single = 1,
    Double = 2, // 对子
    Five = 5, // 无意义，作为分界
    Flush, // 同花
    Straight, // 顺子
    House, // 富庶
    Four, // 福禄
    FS, // 同花顺
}

interface DynamicObj {
    [key: string]: any;
}

interface Hand {
    dominant: string,
    type: HANDTYPE,
}