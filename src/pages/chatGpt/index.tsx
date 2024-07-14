import React from "react";
import { Input, Select, Button } from "antd";
import { ConfigurableModalForm, useModalForm } from "@/components/wwModalForm";

const App: React.FC = () => {
  const fields = [
    {
      name: "name",
      component: Input,
      props: {
        placeholder: "Enter your name",
      },
      rules: [{ required: true, message: "Please input your name!" }],
    },
    {
      name: "gender",
      component: Select,
      props: {
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ],
      },
      rules: [{ required: true, message: "Please select your gender!" }],
    },
  ];

  const { visible, openModal, closeModal, form } = useModalForm();

  const handleOk = (values: Record<string, any>) => {
    console.log("Received values of form: ", values);
    closeModal(); // 关闭弹窗
  };

  return (
    <div>
      <Button type="primary" onClick={openModal}>
        Open Modal
      </Button>
      <ConfigurableModalForm
        title="User Information"
        visible={visible}
        onOk={handleOk}
        onCancel={closeModal}
        formFields={fields}
        form={form}
      />
    </div>
  );
};

export default App;
