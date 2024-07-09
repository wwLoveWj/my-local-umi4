import React from "react";
import WjEditor from "@/components/wwEditor/index";
import { useLocation } from "umi";

const Index = () => {
  const detailsFromProps = (useLocation() as any).state;
  return (
    <div>
      <WjEditor detailsFromProps={detailsFromProps} />
    </div>
  );
};

export default Index;
