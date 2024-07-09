/**
 * 删除的确认弹窗
 */
import React from "react";
import { Popconfirm, Button } from "antd";

const Index = ({ title, onConfirm, btnTxt = "删除" }: { title: string; onConfirm: () => void; btnTxt?: string }) => {
    return (
        <Popconfirm
            title={title}
            onConfirm={onConfirm}
            okText="确定"
            cancelText="取消"
            placement="topLeft"
        >
            <Button type="link" danger>
                {btnTxt}
            </Button>
        </Popconfirm>
    );
};

export default Index;
