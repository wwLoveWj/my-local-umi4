import React, { useState, useCallback } from "react";
import { Drawer, Form, Button, Input, Select, Checkbox, Radio } from "antd";
import { FormItemProps } from "antd/lib/form";
import type {
  InputProps,
  SelectProps,
  CheckboxProps,
  RadioProps,
  FormInstance,
} from "antd";

// 定义表单字段配置接口
type AntdFormComponentProps =
  | InputProps
  | SelectProps<any>
  | CheckboxProps
  | RadioProps;

interface FieldConfig<T extends AntdFormComponentProps = any> {
  name: string | string[];
  component: React.ComponentType<T>;
  props?: T;
  rules?: FormItemProps["rules"];
}

// 定义抽屉配置接口
interface DrawerConfig {
  title: string;
  visible: boolean;
  onOk: (values: Record<string, any>) => void;
  onCancel: () => void;
  formFields: FieldConfig[];
  form: FormInstance;
}

// 封装的配置化抽屉和表单组件
const ConfigurableDrawerForm: React.FC<DrawerConfig> = ({
  title,
  visible,
  onOk,
  onCancel,
  formFields,
  form,
}) => {
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values);
      })
      .catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
      });
  };

  return (
    <Drawer
      title={title}
      width={720}
      onClose={onCancel}
      open={visible}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {formFields.map((field, index) => (
          <Form.Item key={index} name={field.name} rules={field.rules}>
            <field.component {...field.props} />
          </Form.Item>
        ))}
      </Form>
    </Drawer>
  );
};

// 控制抽屉显示的函数
const useDrawerForm = () => {
  const [visibleDrawer, setVisible] = useState(false);
  const [form] = Form.useForm();

  const openDrawer = useCallback(() => {
    setVisible(true);
    form.resetFields();
  }, [form]);

  const closeDrawer = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    visibleDrawer,
    openDrawer,
    closeDrawer,
    formDrawer: form,
  };
};

export { ConfigurableDrawerForm, useDrawerForm };
