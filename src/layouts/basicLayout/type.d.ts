import React, {
  useState,
  useEffect,
  FunctionComponent,
  ComponentClass,
} from "react";

export interface RouterItem {
  title?: string;
  key?: string;
  path?: string;
  icon?: string | FunctionComponent<any> | ComponentClass<any, any>;
  routes?: RouterItem[];
  component?: any;
  exact?: boolean;
  redirect?: string;
  isHidden?: 0; //0是显示、1是隐藏
}
export type MenuType = "light" | "dark";
