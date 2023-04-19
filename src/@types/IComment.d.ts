import { formattedComment } from "@/@types/format.formatted";
import type { commentLoc, formattedCommentWithSize } from "@/@types/types";

export interface IComment {
  comment: formattedCommentWithSize;
  invisible: boolean;
  loc: commentLoc;
  width: number;
  long: number;
  height: number;
  vpos: number;
  flash: boolean;
  posY: number;
  owner: boolean;
  layer: number;
  mail: string[];
  image?: HTMLCanvasElement | null;
  convertComment: (comment: formattedComment) => formattedCommentWithSize;
  getTextImage: () => void;
  draw: (vpos: number, showCollision: boolean, isDebug: boolean) => void;
}
