import React, { useState, useEffect } from "react";
// import QRCode from "qrcode.react";
import { scanCodeAPI } from "@/service/api/login";
import { useRequest } from "ahooks";
// import { history } from "umi";
// import {
//   createWebSocket,
//   closeWebSocket,
//   websocket,
// } from "@/components/wwEditor/websocket";

const ScanLogin = () => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  // 扫码登陆接口
  useRequest(scanCodeAPI, {
    debounceWait: 100,
    onSuccess: (res: string) => {
      setQrCodeDataUrl(res);
    },
  });

  //   useEffect(() => {
  //     createWebSocket("ws://localhost:8080");
  //     return () => {
  //       closeWebSocket();
  //     };
  //   }, []);

  //   useEffect(() => {
  //     websocket.onmessage = (event: any) => {
  //       console.log(`Received-----------------: ${event.data}`);
  //       history.push(event.data);
  //     };
  //   }, [qrCodeDataUrl]);

  return (
    <div>
      {/* <h1>Scan to Login</h1> */}
      {/* {qrCodeDataUrl && <QRCode value={qrCodeDataUrl} />} */}
      <img src={qrCodeDataUrl} alt="登录二维码" />
    </div>
  );
};

export default ScanLogin;
