import { SendOutlined } from "@ant-design/icons";
import { Button, Input, List, Modal, Avatar } from "antd";
import React, { useEffect, useState } from "react";
import { useRequest } from "ahooks";
import { getModelInfoAPI } from "@/service/api/config";
import { getWebsocketUrl, getWebsocketParams } from "@/utils/index";

const ChatBot: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
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
  // 发送消息的接口
  const sendMsgAPI = async (params: string) => {
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
        socket.send(JSON.stringify(getWebsocketParams(APPID, params)));
      }
    });
    let result = "";
    socket.addEventListener("message", (event) => {
      let data = JSON.parse(event.data);
      console.log("收到消息！！", data);
      result += data.payload.choices.text[0].content;
      if (data.header.code === 0) {
        // 对话已经完成
        if (data.payload.choices.text && data.header.status === 2) {
          setMessages([
            ...messages,
            { text: params, sender: "user" },
            { text: result, sender: "bot" },
          ]);
          setLoading(false);
          setTimeout(() => {
            // "对话完成，手动关闭连接"
            socket.close();
          }, 1000);
        }
      } else {
        console.log("出错了", data.header.code, ":", data.header.message);
        setMessages([
          ...messages,
          { text: params, sender: "user" },
          {
            text: "出错啦！请稍后再试!",
            sender: "error",
          },
        ]);
        // 出错了"手动关闭连接"
        socket.close();
      }
    });
    socket.addEventListener("close", (event) => {
      console.log("连接关闭！！", event);
    });
    socket.addEventListener("error", (event) => {
      console.log("连接发送错误！！", event);
    });
  };
  // 发送按钮点击事件
  const handleSend = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);
    setMessages([...messages, { text: inputValue, sender: "user" }]);
    setInputValue("");
    sendMsgAPI(inputValue);
  };
  //  弹窗的取消事件
  const handleCancel = () => {
    onClose();
    setMessages([]);
    setInputValue("");
  };

  useEffect(() => {
    const listRef = document.getElementById("chat-list");
    if (listRef) {
      listRef.scrollTop = listRef.scrollHeight;
    }
  }, [messages]);
  return (
    <Modal
      title="智能助手"
      visible={visible}
      footer={null}
      onCancel={handleCancel}
      width={600}
    >
      <List
        id="chat-list"
        style={{ height: "400px", overflow: "auto" }}
        dataSource={messages}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                item.sender === "bot" || item.sender === "error" ? (
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                ) : (
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                )
              }
              title={
                <div style={{ display: "flex", flex: "flex-end" }}>
                  <span
                    style={{
                      color:
                        item.sender === "bot"
                          ? "#1890ff"
                          : item.sender === "error"
                          ? "red"
                          : "black",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <div style={{ display: "flex" }}>
        <Input
          placeholder="输入你的问题..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleSend}
        />
        <Button
          type="primary"
          onClick={handleSend}
          loading={loading}
          icon={<SendOutlined />}
        ></Button>
      </div>
    </Modal>
  );
};

export default ChatBot;
