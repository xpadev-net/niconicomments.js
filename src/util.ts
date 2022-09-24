import { config } from "@/definition/config";

let configMode: modeType = "default";

/**
 * 配列をフォントとサイズでグループ化する
 * @param {{}} array
 * @returns {{}}
 */
const groupBy = (array: formattedCommentWithFont[]): groupedComments => {
  const data = (["defont", "gothic", "mincho"] as commentFont[]).reduce(
    (pv, font) => {
      pv[font] = {};
      return pv;
    },
    {} as groupedComments
  );
  array.forEach((item, index) => {
    const value = data[item.font][item.fontSize] || [];
    value.push({ ...item, index });
    if (value.length === 1) {
      data[item.font][item.fontSize] = value;
    }
  });
  return data;
};
/**
 * 当たり判定からコメントを配置できる場所を探す
 */
const getPosY = (
  currentPos: number,
  targetComment: parsedComment,
  collision: number[] | undefined,
  data: parsedComment[]
): { currentPos: number; isChanged: boolean; isBreak: boolean } => {
  let isChanged = false,
    isBreak = false;
  if (!collision) return { currentPos, isChanged, isBreak };
  for (const index of collision) {
    const collisionItem = data[index];
    if (!collisionItem) continue;
    if (
      currentPos < collisionItem.posY + collisionItem.height &&
      currentPos + targetComment.height > collisionItem.posY &&
      collisionItem.owner === targetComment.owner &&
      collisionItem.layer === targetComment.layer
    ) {
      if (collisionItem.posY + collisionItem.height > currentPos) {
        currentPos = collisionItem.posY + collisionItem.height;
        isChanged = true;
      }
      if (currentPos + targetComment.height > config.canvasHeight) {
        if (config.canvasHeight < targetComment.height) {
          if (targetComment.mail.includes("naka")) {
            currentPos = (targetComment.height - config.canvasHeight) / -2;
          } else {
            currentPos = 0;
          }
        } else {
          currentPos = Math.floor(
            Math.random() * (config.canvasHeight - targetComment.height)
          );
        }
        isBreak = true;
        break;
      }
    }
  }
  return { currentPos, isChanged, isBreak };
};
const getPosX = (width: number, vpos: number, long: number): number => {
  return (
    getConfig(config.commentDrawRange) -
    ((((width + getConfig(config.commentDrawRange)) * ((vpos + 100) / 100)) /
      4) *
      300) /
      long +
    getConfig(config.commentDrawPadding)
  );
};
/**
 * フォント名とサイズをもとにcontextで使えるフォントを生成する
 * @param {string} font
 * @param {string|number} size
 * @param {modeType} mode
 * @returns {string}
 */
const parseFont = (
  font: commentFont,
  size: string | number,
  mode: modeType = "default"
): string => {
  switch (font) {
    case "gothic":
      return `normal 400 ${size}px "游ゴシック体", "游ゴシック", "Yu Gothic", YuGothic, yugothic, YuGo-Medium`;
    case "mincho":
      return `normal 400 ${size}px "游明朝体", "游明朝", "Yu Mincho", YuMincho, yumincho, YuMin-Medium`;
    default:
      if (mode === "html5") {
        return `normal 600 ${size}px Arial, "ＭＳ Ｐゴシック", "MS PGothic", MSPGothic, MS-PGothic`;
      } else {
        return `normal 600 ${size}px sans-serif, Arial, "ＭＳ Ｐゴシック", "MS PGothic", MSPGothic, MS-PGothic`;
      }
  }
};
/**
 * phpのarray_push的なあれ
 * @param array
 * @param {string|number} key
 * @param push
 */
const arrayPush = (
  array: { [key: number]: number[] },
  key: string | number,
  push: number
) => {
  if (!array) {
    array = {};
  }
  if (!array[Number(key)]) {
    array[Number(key)] = [];
  }
  array[Number(key)]?.push(push);
};
/**
 * Hexからrgbに変換する(_live用)
 * @param {string} hex
 * @return {array} RGB
 */
const hex2rgb = (hex: string) => {
  if (hex.slice(0, 1) === "#") hex = hex.slice(1);
  if (hex.length === 3)
    hex =
      hex.slice(0, 1) +
      hex.slice(0, 1) +
      hex.slice(1, 2) +
      hex.slice(1, 2) +
      hex.slice(2, 3) +
      hex.slice(2, 3);

  return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(function (
    str
  ) {
    return parseInt(str, 16);
  });
};
/**
 * replaceAll
 */
const replaceAll = (string: string, target: string, replace: string) => {
  while (string.indexOf(target) !== -1) {
    string = string.replace(target, replace);
  }
  return string;
};
/**
 * CAと思われるコメントのレイヤーを分離する
 * @param rawData
 */
const changeCALayer = (rawData: formattedComment[]): formattedComment[] => {
  const userList: { [key: number]: number } = {};
  const data: formattedComment[] = [],
    index: { [key: string]: formattedComment } = {};
  for (const value of rawData) {
    if (value.user_id === undefined || value.user_id === -1) continue;
    if (userList[value.user_id] === undefined) userList[value.user_id] = 0;
    if (
      value.mail.indexOf("ca") > -1 ||
      value.mail.indexOf("patissier") > -1 ||
      value.mail.indexOf("ender") > -1 ||
      value.mail.indexOf("full") > -1
    ) {
      userList[value.user_id] += 5;
    }
    if ((value.content.match(/\r\n|\n|\r/g) || []).length > 2) {
      userList[value.user_id] +=
        (value.content.match(/\r\n|\n|\r/g) || []).length / 2;
    }
    const key = `${value.content}@@${Array.from(new Set([...value.mail].sort()))
        .filter((e) => !e.match(/@[\d.]+|184|device:.+|patissier|ca/))
        .join("")}`,
      lastComment = index[key];
    if (lastComment !== undefined) {
      if (
        value.vpos - lastComment.vpos > config.sameCAGap ||
        Math.abs(value.date - lastComment.date) < config.sameCARange
      ) {
        data.push(value);
        index[key] = value;
      }
    } else {
      data.push(value);
      index[key] = value;
    }
  }
  for (const value of data) {
    if (userList[value.user_id] || 0 >= config.sameCAMinScore)
      value.layer = value.user_id;
  }
  return data;
};

const setConfigMode = (mode: modeType) => {
  configMode = mode;
};
const getConfig = <T>(input: configItem<T>, mode = configMode): T => {
  mode = configMode === "default" ? "html5" : configMode;
  if (
    Object.prototype.hasOwnProperty.call(input, "html5") &&
    Object.prototype.hasOwnProperty.call(input, "flash")
  ) {
    return (input as { [key in "html5" | "flash"]: T })[mode];
  } else {
    return input as T;
  }
};

export {
  groupBy,
  getPosY,
  getPosX,
  parseFont,
  arrayPush,
  hex2rgb,
  replaceAll,
  changeCALayer,
  getConfig,
  setConfigMode,
};
