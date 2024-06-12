import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";
import SendMails from "./components/SendMails";
import { LocalizedModal as WwModel } from "@/components/wwModel/index";

const Index = () => {
  const [openModel, setOpenModel] = useState(false);
  // 创建一个ref
  const childRef = useRef(null);
  const hideModal = () => {
    setOpenModel(false);
  };
  const showModal = () => {
    setOpenModel(true);
  };
  const sendMailsFn = () => {
    // 在父组件中通过ref访问子组件的方法和属性
    (childRef.current as any)?.onFinish().then(() => {
      setOpenModel(false);
    });
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        发送邮件
      </Button>
      {openModel && (
        <WwModel
          title="邮件发送"
          isOpenModel={openModel}
          hideModal={hideModal}
          submitModal={sendMailsFn}
        >
          <SendMails ref={childRef} />
        </WwModel>
      )}
    </div>
  );
};

export default Index;
