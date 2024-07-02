import React, { useState } from "react";
import { Outlet } from "umi";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";

interface Iprops {
  title: string;
  isOpenModel: boolean;
  hideModal: () => void;
  submitModal?: () => void;
  children: any;
  footer?: React.ReactNode;
}
const LocalizedModal: React.FC<Iprops> = ({
  title,
  isOpenModel,
  hideModal,
  submitModal,
  children,
  footer,
}) => {
  return (
    <>
      <Modal
        title={title}
        open={isOpenModel}
        onOk={submitModal}
        onCancel={hideModal}
        okText="确认"
        cancelText="取消"
        footer={footer}
        // footer={(_, { CancelBtn }) => (
        //   <>
        //     <CancelBtn />
        //     <Button htmlType="submit" type="primary">
        //       Send
        //     </Button>
        //   </>
        // )}
      >
        {children}
      </Modal>
    </>
  );
};

const Index: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal();

  const confirm = () => {
    modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Bla bla ...",
      okText: "确认",
      cancelText: "取消",
    });
  };

  return (
    <>
      <Space>
        {/* <LocalizedModal /> */}
        <Button onClick={confirm}>Confirm</Button>
      </Space>
      {contextHolder}
    </>
  );
};

export { LocalizedModal, Index };
