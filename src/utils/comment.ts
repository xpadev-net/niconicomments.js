import type {
  commentLoc,
  commentSize,
  formattedComment,
  formattedCommentWithFont,
  measureTextInput,
  nicoScriptReplace,
  parsedCommand,
} from "@/@types/";
import { nicoScripts } from "@/contexts/";
import { colors } from "@/definition/colors";
import { config, options } from "@/definition/config";
import typeGuard from "@/typeGuard";
import { getConfig } from "@/util";

const isLineBreakResize = (comment: measureTextInput) => {
  return (
    !comment.resized &&
    !comment.ender &&
    comment.lineCount >= config.lineBreakCount[comment.size]
  );
};

const getDefaultCommand = (vpos: number) => {
  nicoScripts.default = nicoScripts.default.filter(
    (item) => !item.long || item.start + item.long >= vpos
  );
  let color = undefined,
    size: commentSize | undefined = undefined,
    font = undefined,
    loc: commentLoc | undefined = undefined;
  for (const item of nicoScripts.default) {
    if (item.loc) {
      loc = item.loc;
    }
    if (item.color) {
      color = item.color;
    }
    if (item.size) {
      size = item.size;
    }
    if (item.font) {
      font = item.font;
    }
    if (loc && color && size && font) break;
  }
  return { color, size, font, loc };
};

const nicoscriptReplaceIgnoreable = (
  comment: formattedComment,
  item: nicoScriptReplace
) =>
  ((item.target === "\u30b3\u30e1" ||
    item.target === "\u542b\u307e\u306a\u3044") &&
    comment.owner) ||
  (item.target === "\u6295\u30b3\u30e1" && !comment.owner) ||
  (item.target === "\u542b\u307e\u306a\u3044" && comment.owner) ||
  (item.condition === "\u5b8c\u5168\u4e00\u81f4" &&
    comment.content !== item.keyword) ||
  (item.condition === "\u90e8\u5206\u4e00\u81f4" &&
    comment.content.indexOf(item.keyword) === -1);

const applyNicoScriptReplace = (
  comment: formattedComment,
  commands: parsedCommand
) => {
  nicoScripts.replace = nicoScripts.replace.filter(
    (item) => !item.long || item.start + item.long >= comment.vpos
  );
  for (const item of nicoScripts.replace) {
    if (nicoscriptReplaceIgnoreable(comment, item)) continue;
    if (item.range === "\u5358") {
      comment.content = comment.content.replaceAll(item.keyword, item.replace);
    } else {
      comment.content = item.replace;
    }
    item.loc && (commands.loc = item.loc);
    item.color && (commands.color = item.color);
    item.size && (commands.size = item.size);
    item.font && (commands.font = item.font);
  }
};

const parseCommandAndNicoScript = (
  comment: formattedComment
): formattedCommentWithFont => {
  const isFlash = isFlashComment(comment);
  const commands = parseCommands(comment);
  processNicoscript(comment, commands);
  const defaultCommand = getDefaultCommand(comment.vpos);
  applyNicoScriptReplace(comment, commands);
  commands.size ||= defaultCommand.size || "medium";
  commands.loc ||= defaultCommand.loc || "naka";
  commands.color ||= defaultCommand.color || "#FFFFFF";
  commands.font ||= defaultCommand.font || "defont";
  commands.fontSize = getConfig(config.fontSize, isFlash)[
    commands.size
  ].default;
  if (!commands.long) {
    commands.long = 300;
  } else {
    commands.long = Math.floor(Number(commands.long) * 100);
  }
  return {
    ...comment,
    content: [],
    lineCount: 0,
    lineOffset: 0,
    ...commands,
    flash: isFlash,
  } as formattedCommentWithFont;
};

const parseBrackets = (input: string) => {
  const content = input.split(""),
    result = [];
  let quote = "",
    last_i = "",
    string = "";
  for (const i of content.slice(4)) {
    if (i.match(/["'\u300c]/) && quote === "") {
      //["'「]
      quote = i;
    } else if (i.match(/["']/) && quote === i && last_i !== "\\") {
      result.push(string.replaceAll("\\n", "\n"));
      quote = "";
      string = "";
    } else if (i.match(/\u300d/) && quote === "\u300c") {
      //」
      result.push(string);
      quote = "";
      string = "";
    } else if (quote === "" && i.match(/\s+/)) {
      if (string) {
        result.push(string);
        string = "";
      }
    } else {
      string += i;
    }

    last_i = i;
  }
  result.push(string);
  return result;
};

const addNicoscriptReplace = (
  comment: formattedComment,
  commands: parsedCommand
) => {
  //@置換
  const result = parseBrackets(comment.content);
  if (
    result[0] === undefined ||
    (result[2] !== undefined &&
      !typeGuard.nicoScript.replace.range(result[2])) ||
    (result[3] !== undefined &&
      !typeGuard.nicoScript.replace.target(result[3])) ||
    (result[4] !== undefined &&
      !typeGuard.nicoScript.replace.condition(result[4]))
  )
    return;
  nicoScripts.replace.unshift({
    start: comment.vpos,
    long:
      commands.long === undefined ? undefined : Math.floor(commands.long * 100),
    keyword: result[0],
    replace: result[1] || "",
    range: result[2] || "\u5358", //単
    target: result[3] || "\u30b3\u30e1", //コメ
    condition: result[4] || "\u90e8\u5206\u4e00\u81f4", //部分一致
    color: commands.color,
    size: commands.size,
    font: commands.font,
    loc: commands.loc,
    no: comment.id,
  });
  sortNicoscriptReplace();
};

const sortNicoscriptReplace = () => {
  nicoScripts.replace.sort((a, b) => {
    if (a.start < b.start) return -1;
    if (a.start > b.start) return 1;
    if (a.no < b.no) return -1;
    if (a.no > b.no) return 1;
    return 0;
  });
};

const processNicoscript = (
  comment: formattedComment,
  commands: parsedCommand
) => {
  const nicoscript = comment.content.match(
    /^(?:@|\uff20)(\u30c7\u30d5\u30a9\u30eb\u30c8|\u7f6e\u63db|\u9006|\u30b3\u30e1\u30f3\u30c8\u7981\u6b62|\u30b7\u30fc\u30af\u7981\u6b62|\u30b8\u30e3\u30f3\u30d7)(.*)/
    //^(?:@|＠)(デフォルト|置換|逆|コメント禁止|シーク禁止|ジャンプ)(.*)
  );
  if (!nicoscript || !comment.owner) return;
  commands.invisible = true;
  if (nicoscript[1] === "\u30c7\u30d5\u30a9\u30eb\u30c8") {
    //＠デフォルト
    nicoScripts.default.unshift({
      start: comment.vpos,
      long:
        commands.long === undefined
          ? undefined
          : Math.floor(commands.long * 100),
      color: commands.color,
      size: commands.size,
      font: commands.font,
      loc: commands.loc,
    });
    return;
  }
  if (nicoscript[1] === "\u9006") {
    //＠逆
    const reverse = comment.content.match(
      /^(?:@|\uff20)\u9006(?:\s+)?(\u5168|\u30b3\u30e1|\u6295\u30b3\u30e1)?/
      //^(?:@|＠)逆(?:\s+)?(全|コメ|投コメ)?
    );
    if (
      !reverse ||
      !reverse[1] ||
      !typeGuard.nicoScript.range.target(reverse[1])
    )
      return;
    if (commands.long === undefined) {
      commands.long = 30;
    }
    nicoScripts.reverse.unshift({
      start: comment.vpos,
      end: comment.vpos + commands.long * 100,
      target: reverse[1],
    });
    return;
  }
  if (nicoscript[1] === "\u30b3\u30e1\u30f3\u30c8\u7981\u6b62") {
    //@コメント禁止
    if (commands.long === undefined) {
      commands.long = 30;
    }
    nicoScripts.ban.unshift({
      start: comment.vpos,
      end: comment.vpos + commands.long * 100,
    });
    return;
  }
  if (nicoscript[1] === "\u30b7\u30fc\u30af\u7981\u6b62") {
    //@シーク禁止
    if (commands.long === undefined) {
      commands.long = 30;
    }
    nicoScripts.seekDisable.unshift({
      start: comment.vpos,
      end: comment.vpos + commands.long * 100,
    });
    return;
  }
  if (nicoscript[1] === "\u30b8\u30e3\u30f3\u30d7" && nicoscript[2]) {
    //@ジャンプ
    const to = nicoscript[2].match(
      /\s*((?:sm|so|nm|\uff53\uff4d|\uff53\uff4f|\uff4e\uff4d)?[1-9\uff11-\uff19][0-9\uff11-\uff19]*|#[0-9]+:[0-9]+(?:\.[0-9]+)?)\s+(.*)/
      //\s*((?:sm|so|nm|ｓｍ|ｓｏ|ｎｍ)?[1-9１-９][0-9１-９]*|#[0-9]+:[0-9]+(?:\.[0-9]+)?)\s+(.*)
    );
    if (!to || !to[1]) return;
    nicoScripts.jump.unshift({
      start: comment.vpos,
      end: commands.long === undefined ? undefined : commands.long * 100,
      to: to[1],
      message: to[2],
    });
    return;
  }
  if (nicoscript[1] === "\u7f6e\u63db") {
    addNicoscriptReplace(comment, commands);
  }
};

const parseCommands = (comment: formattedComment): parsedCommand => {
  const commands = comment.mail,
    isFlash = isFlashComment(comment);
  const result: parsedCommand = {
    loc: undefined,
    size: undefined,
    fontSize: undefined,
    color: undefined,
    strokeColor: undefined,
    wakuColor: undefined,
    font: undefined,
    full: false,
    ender: false,
    _live: false,
    invisible: false,
    long: undefined,
  };
  for (const command of commands) {
    parseCommand(comment, command, result, isFlash);
  }
  if (comment.content.startsWith("/")) {
    result.invisible = true;
  }
  return result;
};

const parseCommand = (
  comment: formattedComment,
  _command: string,
  result: parsedCommand,
  isFlash: boolean
) => {
  const command = _command.toLowerCase();
  let match = command.match(/^(?:@|\uff20)([0-9.]+)/);
  if (match && match[1]) {
    result.long = Number(match[1]);
    return;
  }
  match = command.match(/^nico:stroke:(.+)$/);
  if (result.strokeColor === undefined && match) {
    if (typeGuard.comment.color(match[1])) {
      result.strokeColor = colors[match[1]];
    } else if (typeGuard.comment.colorCodeAllowAlpha(match[1])) {
      result.strokeColor = match[1].slice(1);
    }
    return;
  }
  match = command.match(/^nico:waku:(.+)$/);
  if (result.wakuColor === undefined && match) {
    if (typeGuard.comment.color(match[1])) {
      result.wakuColor = colors[match[1]];
    } else if (typeGuard.comment.colorCodeAllowAlpha(match[1])) {
      result.wakuColor = match[1].slice(1);
    }
    return;
  }
  if (result.loc === undefined && typeGuard.comment.loc(command)) {
    result.loc = command;
    return;
  }
  if (result.size === undefined && typeGuard.comment.size(command)) {
    result.size = command;
    result.fontSize = getConfig(config.fontSize, isFlash)[command].default;
    return;
  }
  if (result.color === undefined && config.colors[command]) {
    result.color = config.colors[command];
    return;
  }
  match = command.match(/#(?:[0-9a-z]{3}|[0-9a-z]{6})/);
  if (result.color === undefined && match && match[0] && comment.premium) {
    result.color = match[0].toUpperCase();
    return;
  }
  if (result.font === undefined && typeGuard.comment.font(command)) {
    result.font = command;
  } else if (typeGuard.comment.command.key(command)) {
    result[command] = true;
  }
};

/**
 * コメントがFlash適用対象化判定返す
 * @param {formattedComment} comment
 */
const isFlashComment = (comment: formattedComment): boolean =>
  options.mode === "flash" ||
  (options.mode === "default" &&
    !(
      comment.mail.includes("gothic") ||
      comment.mail.includes("defont") ||
      comment.mail.includes("mincho")
    ) &&
    (comment.date < config.flashThreshold ||
      comment.mail.includes("nico:flash")));

const isReverseActive = (vpos: number, isOwner: boolean): boolean => {
  for (const range of nicoScripts.reverse) {
    if (
      (range.target === "コメ" && isOwner) ||
      (range.target === "投コメ" && !isOwner)
    )
      continue;
    if (range.start < vpos && vpos < range.end) {
      return true;
    }
  }
  return false;
};

const isBanActive = (vpos: number): boolean => {
  for (const range of nicoScripts.ban) {
    if (range.start < vpos && vpos < range.end) return true;
  }
  return false;
};

export {
  isBanActive,
  isFlashComment,
  isLineBreakResize,
  isReverseActive,
  parseCommandAndNicoScript,
};
