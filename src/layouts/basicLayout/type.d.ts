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
  hidden?: boolean;
}
export type MenuType = "light" | "dark";
