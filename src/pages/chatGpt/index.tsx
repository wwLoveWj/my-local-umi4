import React from "react";
import { Input, Select, Button } from "antd";
import { ConfigurableModalForm, useModalForm } from "@/components/wwModalForm";

const App: React.FC = () => {
  const formModalfields: any[] = [
    {
      name: "username",
      label: "登录用户",
      type: "input",
      formItemProps: {
        rules: [{ required: true, message: "请输入登录用户姓名" }],
      },
    },
    {
      name: "password",
      label: "登录密码",
      type: "input",
      formItemProps: {
        rules: [{ required: true, message: "请输入登录密码" }],
      },
      fieldProps: {
        type: "password",
      },
    },
    {
      name: "roleId",
      label: "选择角色",
      type: "select",
      options: [],
      formItemProps: {
        rules: [{ required: true, message: "请选择一个角色" }],
      },
      fieldProps: {
        fieldNames: { label: "rolename", value: "roleId" },
      },
    },
    {
      name: "roleId",
      label: "选择角色",
      render: () => <div>33333333333</div>,
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
        formFields={formModalfields}
        form={form}
      />
    </div>
  );
};

export default App;

// ============================useDrawerForm============================
// import React from "react";
// import {
//   ConfigurableDrawerForm,
//   useDrawerForm,
// } from "@/components/wwDrawerForm";

// const App: React.FC = () => {
//   const fields = [
//     {
//       name: "name",
//       component: Input,
//       props: {
//         placeholder: "Enter your name",
//       },
//       rules: [{ required: true, message: "Please input your name!" }],
//     },
//     {
//       name: "gender",
//       component: Select,
//       props: {
//         options: [
//           { value: "male", label: "Male" },
//           { value: "female", label: "Female" },
//         ],
//       },
//       rules: [{ required: true, message: "Please select your gender!" }],
//     },
//   ];

//   const { visibleDrawer, openDrawer, closeDrawer, formDrawer } =
//     useDrawerForm();

//   const handleOk = (values: Record<string, any>) => {
//     console.log("Received values of form: ", values);
//     closeDrawer(); // 关闭抽屉
//   };

//   return (
//     <div>
//       <Button type="primary" onClick={openDrawer}>
//         Open Drawer
//       </Button>
//       <ConfigurableDrawerForm
//         title="User Information"
//         visible={visibleDrawer}
//         onOk={handleOk}
//         onCancel={closeDrawer}
//         formFields={fields}
//         form={formDrawer}
//       />
//     </div>
//   );
// };

// export default App;

// =================================QueryTable=======================================
// import React, { useState } from "react";
// import type { FormField } from "@/components/wwTableForm";
// import QueryTable from "@/components/wwTableForm";

// const Index: React.FC = () => {
//   const [refresh, setRefresh] = useState(false);

//   const formFields: FormField[] = [
//     {
//       name: "username",
//       label: "姓名",
//       type: "input",
//     },
//     {
//       name: "category",
//       label: "Category",
//       type: "select",
//       options: [
//         { value: "A", label: "Category A" },
//         { value: "B", label: "Category B" },
//       ],
//     },
//     {
//       name: "date",
//       label: "Date",
//       type: "datePicker",
//     },
//   ];

//   const fetchData = async (params: Record<string, any>) => {
//     // Simulate an API call with a delay
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     return [
//       {
//         id: 1,
//         username: "Item 1",
//         inspectionReport: "A",
//         createTime: "2021-01-01",
//       },
//       {
//         id: 2,
//         username: "Item 2",
//         inspectionReport: "B",
//         createTime: "2021-01-02",
//       },
//     ];
//   };

//   const handleRefresh = () => {
//     setRefresh(!refresh);
//   };

//   return (
//     <div>
//       {/* <Button onClick={handleRefresh}>Refresh</Button> */}
//       <QueryTable
//         columns={[
//           {
//             dataIndex: "username",
//             title: "姓名",
//           },
//           {
//             dataIndex: "inspectionReport",
//             title: "检查报告",
//           },
//           {
//             dataIndex: "createTime",
//             title: "创建时间",
//           },
//         ]}
//         formFields={formFields}
//         fetchData={fetchData}
//         refresh={refresh}
//       />
//     </div>
//   );
// };

// export default Index;
