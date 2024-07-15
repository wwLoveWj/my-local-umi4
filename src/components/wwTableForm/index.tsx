import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Select, DatePicker, Button, Table, Col, Row } from "antd";
import { ColumnsType } from "antd/es/table";
import styles from "./style.less";

interface FormField {
  name: string;
  label: string;
  type: "input" | "select" | "datePicker";
  initialValue?: string;
  options?: { value: string; label: string }[];
}

interface QueryTableProps {
  formFields: FormField[];
  fetchData?: (params: Record<string, any>) => Promise<any[]>;
  dataSource?: any[];
  refresh?: boolean;
  columns: ColumnsType<any>;
  rowKey: string;
  children: any;
}

const QueryTable: React.FC<QueryTableProps> = ({
  formFields,
  fetchData,
  dataSource,
  refresh,
  columns,
  rowKey,
  children,
}) => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<any[]>([]);
  const queryRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (refresh && fetchData) {
      queryRef.current();
    }
  }, [refresh, fetchData]);
  // 外部请求接口
  useEffect(() => {
    if (fetchData) {
      queryRef.current = async () => {
        const params = await form.validateFields();
        const data = await fetchData(params);
        console.log(data, "用户数据--------------");
        setTableData(data);
      };
    }
  }, [fetchData, form]);
  //   外部直接传入表格数据
  useEffect(() => {
    if (dataSource) {
      setTableData(dataSource);
    }
  }, [dataSource]);

  const onSearch = async () => {
    if (fetchData) {
      await queryRef.current();
    }
  };

  return (
    <>
      <Form
        form={form}
        layout="inline"
        onFinish={onSearch}
        className={styles.searchForm}
      >
        <Row gutter={[16, 16]}>
          {formFields.map((field) => (
            <Col span={8}>
              <Form.Item
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
                          style={{ width: "100%" }}
                          placeholder={`请输入${field.label}`}
                        />
                      );
                    case "select":
                      return (
                        <Select
                          style={{ width: "100%" }}
                          placeholder={`请选择${field.label}`}
                        >
                          {field.options?.map((option) => (
                            <Select.Option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </Select.Option>
                          ))}
                        </Select>
                      );
                    case "datePicker":
                      return <DatePicker style={{ width: "100%" }} />;
                    default:
                      return null;
                  }
                })()}
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginLeft: "20px" }}
          >
            Search
          </Button>
        </Form.Item>
      </Form>
      <div className={styles.tableLayout}>
        <div style={{ marginBottom: "12px" }}>{children}</div>
        <Table rowKey={rowKey} columns={columns} dataSource={tableData} />
      </div>
    </>
  );
};

export default QueryTable;
export type { FormField, QueryTableProps, ColumnsType };
