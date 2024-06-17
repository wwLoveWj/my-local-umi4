import React, { useState, useRef } from "react";
import { useRequest } from "ahooks";
import { getModelInfoAPI } from "@/service/api/config";
import { Row, Col, Button, Input } from "antd";
import { getWebsocketUrl, getWebsocketParams } from "@/utils/index";
import "./style.less";

let sparkResult = "";
const { TextArea } = Input;
const Index = () => {
  const chatContainer = useRef<any>();
  const [chatInput, setChatInput] = useState(""); //用户询问的问题
  const [sparkResultHtml, setSparkResultHtml] = useState("");
  //   const [sparkResult, setSparkResult] = useState(""); //chatgpt回答的答案
  const [disabledBtn, setDisabledBtn] = useState(false); //询问问题的按钮是否置灰
  //   存储星火大模型相关权限数据
  const [allXinghuoModelInfo, setAllXinghuoModelInfo] = useState<
    Partial<API.ApiInfoType>
  >({});

  //   请求星火大模型相关权限数据的接口
  useRequest(() => getModelInfoAPI({}), {
    debounceWait: 100,
    onSuccess: (res: any) => {
      setAllXinghuoModelInfo(res);
    },
  });
  // 发送消息
  const sendMsg = async () => {
    if (!chatInput) {
      return;
    }
    // 将问题添加到对话框中并设置按钮禁用
    addUserMessage(chatInput);
    setDisabledBtn(true);

    // 获取请求地址
    const url: any = await getWebsocketUrl(allXinghuoModelInfo);
    // 每次发送问题 都是一个新的websocket请求
    const socket = new WebSocket(url);
    const { APPID } = allXinghuoModelInfo;
    // 监听websocket的各阶段事件 并做相应处理
    socket.addEventListener("open", (event) => {
      console.log("开启连接！！", event);
      // 发送消息
      console.log("发送消息");
      if (APPID) {
        socket.send(JSON.stringify(getWebsocketParams(APPID, chatInput)));
      }
    });
    socket.addEventListener("message", (event) => {
      let data = JSON.parse(event.data);
      console.log("收到消息！！", data);
      sparkResult += data.payload.choices.text[0].content;
      if (data.header.code === 0) {
        // 对话已经完成
        if (data.payload.choices.text && data.header.status === 2) {
          sparkResult += data.payload.choices.text[0].content;
          addBotMessage(sparkResult);
          setDisabledBtn(false); // 成功接受消息后让提交按钮再次可以点击
          setTimeout(() => {
            // "对话完成，手动关闭连接"
            socket.close();
          }, 1000);
        }
      } else {
        console.log("出错了", data.header.code, ":", data.header.message);
        addBotMessage(
          '<span style="color:red;">' + "出错啦！请稍后再试!" + "</span>"
        );
        setDisabledBtn(false);
        // 出错了"手动关闭连接"
        socket.close();
      }
    });
    socket.addEventListener("close", (event) => {
      console.log("连接关闭！！", event);
      // 对话完成后socket会关闭，将聊天记录换行处理
      sparkResult = sparkResult + "\n";
      addBotMessage(sparkResult);
      // 清空输入框
      setChatInput("");
    });
    socket.addEventListener("error", (event) => {
      console.log("连接发送错误！！", event);
    });
  };

  //   =================================================================================================
  // 添加用户消息到窗口
  function addUserMessage(message: string) {
    var messageElement = `
      <div className="row message-bubble"><img className="chat-icon" src="
        "../../assets/yay.jpg"><p className="message-text">
        ${message}
        </p></div>
    `;
    setSparkResultHtml(messageElement);
    setChatInput("");
    chatContainer.current!.scrollTop = 500;
  }

  // 添加回复消息到窗口
  function addBotMessage(message: string) {
    var messageElement = `
      <div className="row message-bubble"><img className="chat-icon" src="
        ../../assets/yay.jpg"><p className="message-text">
        ${message}
        </p></div>
    `;
    setSparkResultHtml(sparkResultHtml + messageElement);
    setChatInput("");
    chatContainer.current!.scrollTop = 500;
  }

  return (
    <Row>
      <div>
        <h1 className="text-center m-b-lg">Chat with ChatGPT</h1>
      </div>
      <div className="answer">
        <div
          id="chatContainer"
          ref={chatContainer}
          dangerouslySetInnerHTML={{ __html: sparkResultHtml }}
        ></div>
        <Row className="ipt-btn">
          <Col span={22}>
            <TextArea
              value={chatInput}
              className="chatInpt"
              showCount
              onChange={(e) => {
                let val = e.target.value;
                setChatInput(val);
              }}
              maxLength={100}
              placeholder="请输入你想问的问题"
            />
          </Col>
          <Col span={2}>
            <Button
              className="chat-icon"
              type="primary"
              disabled={disabledBtn}
              onClick={sendMsg}
            >
              Go !
            </Button>
          </Col>
        </Row>
      </div>
    </Row>
  );
};

export default Index;
