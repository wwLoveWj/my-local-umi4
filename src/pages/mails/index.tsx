import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";
import SendMails from "./components/SendMails";
import SettingsMails from "./components/settings/index";
import { LocalizedModal as WwModel } from "@/components/wwModel/index";

const Index = () => {
  const [openModel, setOpenModel] = useState(false);
  const [openSettingsModel, setOpenSettingsModel] = useState(false);
  // 创建一个ref
  const childRef = useRef(null);
  const settingsRef = useRef(null);
  const hideModal = () => {
    setOpenModel(false);
    setOpenSettingsModel(false);
  };
  const showModal = () => {
    setOpenModel(true);
  };
  const showSettingsModal = () => {
    setOpenSettingsModel(true);
  };
  const sendMailsFn = () => {
    // 在父组件中通过ref访问子组件的方法和属性
    (childRef.current as any)?.onFinish().then(() => {
      setOpenModel(false);
    });
  };
  /**
   * 邮箱设置提交
   */
  const settingsMailsFn = () => {
    (settingsRef.current as any)?.onFinish().then(() => {
      setOpenSettingsModel(false);
    });
  };
  return (
    <div>
      <Button type="primary" onClick={showModal}>
        发送邮件
      </Button>
      <Button style={{ marginLeft: "12px" }} onClick={showSettingsModal}>
        设置邮箱
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
      {openSettingsModel && (
        <WwModel
          title="邮箱设置"
          isOpenModel={openSettingsModel}
          hideModal={hideModal}
          submitModal={settingsMailsFn}
        >
          <SettingsMails ref={settingsRef} />
        </WwModel>
      )}
    </div>
  );
};

export default Index;
