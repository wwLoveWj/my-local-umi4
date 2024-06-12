/**
 * 语言切换文件处理
 */
import { useIntl, setLocale } from "umi";
import { Select } from "antd";
import "./style.less";
import React from "react";

const Index = ({ themeColor }: { themeColor: string }) => {
  const intl = useIntl();
  const lang = intl.locale;
  const changeLocale = (value: any) => {
    setLocale(value, false); //第二个参数配置为true会刷新整个页面
  };
  const t = (id: string) => intl.formatMessage({ id }); // 写成传参方式
  return (
    <div id="language-container" style={{ color: themeColor }}>
      <Select
        defaultValue={lang}
        style={{ width: 90 }}
        onChange={(value) => changeLocale(value)}
        options={[
          { value: "zh-CN", label: "中文" },
          { value: "en-US", label: "English" },
        ]}
      />
      {/* {intl.formatMessage({ id: "chinese" })}/
      <div title={t("about.title")}>{t("about.title")}</div> */}
    </div>
  );
};
export default Index;
