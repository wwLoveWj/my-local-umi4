import React, { useCallback, useState } from "react";
import { Modal, Form } from "antd";
import { FormItemProps } from "antd/lib/form";
import type {
  InputProps,
  SelectProps,
  CheckboxProps,
  RadioProps,
  FormInstance,
} from "antd";

type AntdFormComponentProps =
  | InputProps
  | SelectProps<any>
  | CheckboxProps
  | RadioProps;

interface FormFieldConfig<T extends AntdFormComponentProps = any> {
  name: string | string[]; //表单label名
  component: React.ComponentType<T>; //表单的类型select还是input
  props?: T;
  rules?: FormItemProps["rules"];
}
// modal的props及from的props
interface ModalFormConfig {
  title: string;
  visible: boolean;
  onOk: (values: Record<string, any>) => void;
  onCancel: () => void;
  formFields: FormFieldConfig[];
  form: FormInstance;
}

const ConfigurableModalForm: React.FC<ModalFormConfig> = ({
  title,
  visible,
  onOk,
  onCancel,
  formFields,
  form,
}) => {
  return (
    <Modal
      title={title}
      open={visible}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk(values);
          })
          .catch((errorInfo) => {
            console.log("Validate Failed:", errorInfo);
          });
      }}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        {formFields.map((field, index) => (
          <Form.Item key={index} name={field.name} rules={field.rules}>
            <field.component {...field.props} />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};
// 控制弹窗显示的函数
const useModalForm = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const openModal = useCallback(() => {
    setVisible(true);
    form.resetFields();
  }, [form]);

  const closeModal = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    visible,
    openModal,
    closeModal,
    form,
  };
};

export { ConfigurableModalForm, useModalForm };
