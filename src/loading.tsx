import { useTimeout } from "ahooks";
import React, { useEffect, useState } from "react";

interface PageLoadingpropsType {
  /** 延时显示 */
  delay?: number;
}

const PageLoading: React.FC<PageLoadingpropsType> = (props) => {
  const { delay = 300 } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingList, setLoadingList] = useState<any[]>([]);

  useTimeout(() => {
    setLoading(true);
  }, delay);

  useEffect(() => {
    let list: any = [];
    for (let i = 0; i < 20; i++) {
      list.push(i);
    }
    setLoadingList(list);
  }, []);
  return loading ? (
    <div className="custom-page-loading-container">
      <div className="custom-page-loading">
        {loadingList.map((num) => {
          return <span key={num} style={{ "--i": num } as any} />;
        })}
      </div>
    </div>
  ) : null;
};

export default PageLoading;
