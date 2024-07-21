import React, { useCallback, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, TreeSelect } from "antd";
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
  name: string;
  label: string;
  type: "input" | "select" | "datePicker" | "treeSelect";
  initialValue?: string | number;
  options?: { value: string; label: string }[];
  rules?: FormItemProps["rules"];
  fieldProps: Record<string, any>;
  formItemProps: any;
  render?: any;
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
    visible && (
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
          {formFields.map((field) => (
            <Form.Item
              {...field?.formItemProps}
              key={field.name}
              name={field.name}
              label={field.label}
              initialValue={field.initialValue}
              style={{ width: "100%" }}
            >
              {(() => {
                switch (field.type) {
                  case "input":
                    return (
                      <Input
                        {...field?.fieldProps}
                        style={{ width: "100%" }}
                        placeholder={`请输入${field.label}`}
                        allowClear
                      />
                    );
                  case "select":
                    return (
                      <Select
                        {...field?.fieldProps}
                        style={{ width: "100%" }}
                        placeholder={`请选择${field.label}`}
                        options={field.options}
                      />
                    );
                  case "datePicker":
                    return (
                      <DatePicker
                        {...field?.fieldProps}
                        style={{ width: "100%" }}
                        allowClear
                      />
                    );
                  case "treeSelect":
                    return <TreeSelect {...field?.fieldProps} />;
                  default:
                    return field.render();
                }
              })()}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    )
  );
};
// 控制弹窗显示的函数
const useModalForm = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const openModal = useCallback(
    (action?: string, record?: any) => {
      setVisible(true);
      form.resetFields();
      if (action === "E") {
        form.setFieldsValue(record);
      }
    },
    [form]
  );

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
