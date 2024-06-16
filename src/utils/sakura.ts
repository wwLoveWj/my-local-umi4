import { imgSource } from "./imgSource";
//全屏樱花飘落
let stop: any, x: number, y: number, s: number, r: number, fn: any, list: any[]; // eslint-disable-line no-unused-vars
let img = new Image();
img.src = imgSource;

class Sakura {
  x: number;
  y: number;
  s: number;
  r: number;
  fn: any;

  constructor(x0: any, y0: any, s0: any, r0: any, fn0: any) {
    this.x = x0;
    this.y = y0;
    this.s = s0;
    this.r = r0;
    this.fn = fn0;
  }

  draw(cxt: CanvasRenderingContext2D | null) {
    if (cxt) {
      cxt.save();
      //这个数值是花瓣大小,电脑端网页 40 效果最好
      let xc = 25 * this.s;
      cxt.translate(this.x, this.y);
      cxt.rotate(this.r);
      cxt.drawImage(img, 0, 0, xc, xc);
      cxt.restore();
    }
  }

  update() {
    this.x = this.fn.x(this.x, this.y);
    this.y = this.fn.y(this.y, this.y);
    this.r = this.fn.r(this.r);
    if (
      this.x > window.innerWidth ||
      this.x < 0 ||
      this.y > window.innerHeight ||
      this.y < 0
    ) {
      this.r = getRandom("fnr");
      if (Math.random() > 0.4) {
        this.x = getRandom("x");
        this.y = 0;
        this.s = getRandom("s");
        this.r = getRandom("r");
      } else {
        this.x = window.innerWidth;
        this.y = getRandom("y");
        this.s = getRandom("s");
        this.r = getRandom("r");
      }
    }
  }
}

let SakuraList: any;
SakuraList = function () {
  list = [];
};
SakuraList.prototype.push = function (sakura: any) {
  list.push(sakura);
};
SakuraList.prototype.update = function () {
  let i = 0,
    len = list.length;
  for (; i < len; i++) {
    list[i].update();
  }
};
SakuraList.prototype.draw = function (cxt: CanvasRenderingContext2D | null) {
  let i = 0,
    len = list.length;
  for (; i < len; i++) {
    list[i].draw(cxt);
  }
};
SakuraList.prototype.get = function (i: number) {
  return list[i];
};
SakuraList.prototype.size = function () {
  return list.length;
};

function getRandom(option: string) {
  let ret: any, random: number;
  switch (option) {
    case "x":
      ret = Math.random() * window.innerWidth;
      break;
    case "y":
      ret = Math.random() * window.innerHeight;
      break;
    case "s":
      ret = Math.random();
      break;
    case "r":
      ret = Math.random() * 6;
      break;
    case "fnx":
      random = -0.5 + Math.random();
      ret = function (x: number) {
        return x + 0.5 * random - 1.7;
      };
      break;
    case "fny":
      random = 1.5 + Math.random() * 0.7;
      ret = function (x: number, y: number) {
        return y + random;
      };
      break;
    case "fnr":
      random = Math.random() * 0.03;
      ret = function (r: number) {
        return r + random;
      };
      break;
  }
  return ret;
}

export function startSakura() {
  stopp();
  let requestAnimationFrame =
    window.requestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).msRequestAnimationFrame ||
    (window as any).oRequestAnimationFrame;
  let canvas = document.createElement("canvas"),
    cxt: CanvasRenderingContext2D | null;
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.setAttribute(
    "style",
    "position: fixed;left: 0;top: 0;pointer-events: none;"
  );
  canvas.setAttribute("id", "canvas_sakura");
  document.getElementsByTagName("body")[0].appendChild(canvas);
  cxt = canvas.getContext("2d");
  let sakuraList = new SakuraList();
  for (let i = 0; i < 50; i++) {
    let sakura: any,
      randomX: any,
      randomY: any,
      randomS: any,
      randomR: any,
      randomFnx: any,
      randomFny: any,
      randomFnR: any;
    randomX = getRandom("x");
    randomY = getRandom("y");
    randomR = getRandom("r");
    randomS = getRandom("s");
    randomFnx = getRandom("fnx");
    randomFny = getRandom("fny");
    randomFnR = getRandom("fnr");
    sakura = new Sakura(randomX, randomY, randomS, randomR, {
      x: randomFnx,
      y: randomFny,
      r: randomFnR,
    });
    sakura.draw(cxt);
    sakuraList.push(sakura);
  }
  stop = requestAnimationFrame(function reverse() {
    if (cxt) {
      cxt.clearRect(0, 0, canvas.width, canvas.height);
      sakuraList.update();
      sakuraList.draw(cxt);
      stop = requestAnimationFrame(reverse);
    }
  });
}

window.onresize = function () {
  let canvasSnow = <HTMLCanvasElement>document.getElementById("canvas_sakura");
  if (canvasSnow) {
    canvasSnow.width = window.innerWidth;
    canvasSnow.height = window.innerHeight;
  }
};

img.onload = function () {
  startSakura();
};

export function stopp() {
  let child = document.getElementById("canvas_sakura");
  if (child) {
    child.parentNode?.removeChild(child);
    window.cancelAnimationFrame(stop);
  }
}
