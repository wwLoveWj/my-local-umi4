import React, { useState } from "react";
import { Input, Modal } from "antd";

const { TextArea } = Input;
const Index: React.FC<{
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}> = ({ isModalOpen, handleOk, handleCancel }) => {
  return (
    <>
      <Modal
        title="申诉"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TextArea showCount maxLength={100} placeholder="申诉理由" />
      </Modal>
    </>
  );
};

export default Index;
