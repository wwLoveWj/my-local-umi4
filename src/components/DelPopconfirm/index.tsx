/**
 * 删除的确认弹窗
 */
import React from "react";
import { Popconfirm, Button } from "antd";

const Index = ({
  title,
  onConfirm,
  disabled,
  btnTxt = "删除",
}: {
  title: string;
  onConfirm: () => void;
  disabled?: boolean;
  btnTxt?: string;
}) => {
  return (
    <Popconfirm
      title={title}
      onConfirm={onConfirm}
      okText="确定"
      cancelText="取消"
      placement="topLeft"
      disabled={disabled}
    >
      <Button type="link" danger disabled={disabled}>
        {btnTxt}
      </Button>
    </Popconfirm>
  );
};

export default Index;
