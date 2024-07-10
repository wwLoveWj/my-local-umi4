import { FunctionComponent, ComponentClass } from "react";
import * as base64 from "base-64";
import CryptoJs from "crypto-js";

export const guid = () => {
  return "xxxxxxxx-xxxx-6xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// 日期选择器时间的禁用
export const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
// 只有一位数字时添加“0”
const checkTime = function (i: number) {
  if (i < 10) {
    if (i < 0) {
      i = "00";
    } else {
      i = "0" + i;
    }
  }

  return i;
};
export const countDownTime = (reminderTime: string) => {
  //获取当前时间距离截止时间的倒计时
  //参数为截止时间
  const remainingTime = new Date(reminderTime) - new Date(); //计算剩余毫秒数
  let days = parseInt(remainingTime / 1000 / 60 / 60 / 24, 10); //计算剩余天数
  let hours = parseInt((remainingTime / 1000 / 60 / 60) % 24, 10); //计算剩余小时数
  let minutes = parseInt((remainingTime / 1000 / 60) % 60, 10); //计算剩分钟数
  let seconds = parseInt((remainingTime / 1000) % 60, 10); //计算剩余秒数
  days = checkTime(days).toString();
  hours = checkTime(hours).toString();
  minutes = checkTime(minutes).toString();
  seconds = checkTime(seconds).toString();
  return days + " : " + hours + " : " + minutes + " : " + seconds;
};
let timer: any = null;
// 获取倒计时时间
export const countDown = (
  dom: string,
  reminderTime: string,
  status: number
) => {
  clearInterval(timer);
  timer = setInterval(function () {
    if (document.getElementById(dom)) {
      (document.getElementById(dom) as HTMLDivElement).innerHTML = reminderTime
        ? countDownTime(reminderTime)
        : "";
    }
  }, 1000);
  // if (status === 1) {
  //   // clearInterval(timer);
  // }
  return countDownTime(reminderTime);
};
//毫秒数转换成时间
export const getCurrentTime = function (milliseconds?: string) {
  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1;
  var day = myDate.getDate();
  var hour = myDate.getHours();
  var minute = myDate.getMinutes();
  var second = myDate.getSeconds();

  month = checkTime(month).toString();
  day = checkTime(day).toString();
  hour = checkTime(hour).toString();
  minute = checkTime(minute).toString();
  second = checkTime(second).toString();

  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
  );
};
/**
 * @desc
 * @param { File } 文件file
 * @return { Boolean } 是图片 true 不是 false
 */
export function isImage(file: any) {
  // 检查文件MIME类型
  return file.type.startsWith("image/");
}

/**
 * 文件上传的方法
 * @param uploadApi 上传文件的api
 */
export const uploadImage = (uploadApi: (params: any) => any) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("multiple", "multiple");
  input.setAttribute("accept", "image/*");
  input.click();
  input.onchange = async function (event: any) {
    // 判断是否是图片格式文件
    const file = event.target.files[0];
    if (!isImage(file)) {
      return;
    }
    // TODO:判断文件大小
    const formData = new FormData();
    formData.append("file", file);
    uploadApi(formData);
  };
  input.remove();
};
// TODO:
export interface TagTypes {
  title?: string;
  key?: string;
  path?: string;
  icon?: string | FunctionComponent<any> | ComponentClass<any, any>;
  routes?: TagTypes[];
  component?: any;
  exact?: boolean;
  redirect?: string;
  hidden?: boolean;
}
// 获取所有路由节点
export const getAllNodes = (data: any) => {
  const nodes: TagTypes[] = [];
  function traverseTree(node: TagTypes | TagTypes[]) {
    if (Array.isArray(node)) {
      node.forEach(traverseTree);
    } else {
      nodes.push(node);
      if (node?.routes) {
        traverseTree(node.routes);
      }
    }
  }
  traverseTree(data); // 从根节点开始遍历整个树形结构
  return nodes;
};

// 获取path路由的title
export const getTagTitle = (path: string, routes: TagTypes[]) => {
  let newTitle: string = "";
  const newAllRoutes = getAllNodes(routes);
  newAllRoutes?.map((routeItem: TagTypes) => {
    if (routeItem?.path === path) {
      newTitle = routeItem?.title || "";
    }
  });
  return newTitle;
};

// 星火大模型的鉴权url地址
export const getWebsocketUrl = (params: Partial<API.ApiInfoType>) => {
  return new Promise((resovle, reject) => {
    const { APISecret, APIKey } = params;
    let url = "wss://spark-api.xf-yun.com/v1.1/chat";
    let host = "spark-api.xf-yun.com";
    let apiKeyName = "api_key";
    let date = (new Date() as any).toGMTString();
    let algorithm = "hmac-sha256";
    let headers = "host date request-line";
    let signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`;
    let signatureSha = CryptoJs.HmacSHA256(signatureOrigin, APISecret);
    let signature = CryptoJs.enc.Base64.stringify(signatureSha);
    let authorizationOrigin = `${apiKeyName}="${APIKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    let authorization = base64.encode(authorizationOrigin);
    // 将空格编码
    url = `${url}?authorization=${authorization}&date=${encodeURI(
      date
    )}&host=${host}`;
    resovle(url);
  });
};

export const getWebsocketParams = (APPID: string, chatInput: string) => {
  return {
    header: {
      app_id: APPID,
      uid: "test",
    },
    parameter: {
      chat: {
        domain: "general",
        temperature: 0.5,
        max_tokens: 4096,
      },
    },
    payload: {
      message: {
        // 如果想获取结合上下文的回答，需要开发者每次将历史问答信息一起传给服务端，如下示例
        // 注意：text里面的所有content内容加一起的tokens需要控制在8192以内，开发者如有较长对话需求，需要适当裁剪历史信息
        text: [
          { role: "user", content: "你是谁" }, //# 用户的历史问题
          { role: "assistant", content: "我是AI助手" }, //# AI的历史回答结果
          // ....... 省略的历史对话
          { role: "user", content: chatInput }, //# 最新的一条问题，如无需上下文，可只传最新一条问题
        ],
      },
    },
  };
};

/**
 * 想要将扁平化数组转成树结构，首先必须知道顶级的pid是啥（0）
 * 第一步，假设我们只需要找顶级的这一项，
 * 只需要对比一下那一项的pid是这个pid即可
 * 而后递归即可
 * */
// 通过pid将扁平化的数组转成树结构。给树结构添加level字段（数据库中没存，当然存也可以）
export function transformRoutes(arr: any, pid: number, level: number) {
  const treeArr: any = [];
  level = level + 1; // 添加层级字段
  arr.forEach((item) => {
    if (item.pid === pid) {
      // 把不是这一项的剩余几项，都丢到这个children数组里面，再进行递归（这一项已经确定了，是父级，没必要再递归了）
      const restArr = arr.filter((item) => {
        return item.pid !== pid;
      });
      item["children"] = transformRoutes(restArr, item.id, level); // 这里需要进行传id当做pid（因为自己的id就是子节点的pid）
      if (item.children.length === 0) {
        delete item.children;
      } // 加一个判断，若是children: [] 即没有内容就删除，不返回给前端children字段
      item["level"] = level; // 添加层级字段
      // 操作完以后，把一整个的都追加到数组中去
      treeArr.push(item);
    }
  });
  return treeArr;
}
