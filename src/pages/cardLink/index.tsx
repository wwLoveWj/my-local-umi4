import React, { useState, useRef } from "react";
import { Card, Button, Flex, Row, Col, Avatar } from "antd";
import BasicLinkInfoModal from "./components/BasicLinkInfoModal";
import { LocalizedModal as WwModel } from "@/components/wwModel/index";
import {
  queryLinkCardListAPI,
  createLinkCardListAPI,
} from "@/service/api/link";
import { useRequest } from "ahooks";
import styles from "./style.less";

const Index = () => {
  const [openModel, setOpenModel] = useState(false);
  const [cardList, setCardList] = useState<API.CardLinkList[]>([]);
  const childRef = useRef(null);
  const hideModal = () => {
    setOpenModel(false);
  };
  const showModal = () => {
    setOpenModel(true);
  };
  // 请求卡片列表信息
  const queryLinkCardList = useRequest(() => queryLinkCardListAPI({}), {
    debounceWait: 100,
    onSuccess: (res: API.CardLinkList[]) => {
      setCardList(res);
    },
  });
  // 新增网址卡片
  const createLinkCardList = useRequest(
    (params: API.CardLinkList) => createLinkCardListAPI(params),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: () => {
        setOpenModel(false);
        queryLinkCardList.run();
      },
    }
  );

  const submitCardListFn = () => {
    // 在父组件中通过ref访问子组件的方法和属性
    (childRef.current as any)?.onFinish().then((res: API.CardLinkList) => {
      createLinkCardList.run(res);
    });
  };
  return (
    <>
      <Button style={{ marginBottom: "12px" }} onClick={showModal}>
        增加资源
      </Button>
      <Row gutter={[16, 12]}>
        {cardList.map((item) => {
          return (
            <Col span={6} key={item.id}>
              <a href={item.link} target="_blank">
                {/* window.location.href = "https://www.baidu.com";//当前页面跳转到指定链接(不打开新页面)
                window.open("https://www.baidu.com");//在新的窗口打开指定链接 */}
                <Card
                  className={styles.animateCard}
                  bodyStyle={{ padding: "18px 20px" }}
                >
                  <Flex wrap gap="small" align="center">
                    <Avatar
                      style={{
                        backgroundColor: "#f56a00",
                        verticalAlign: "middle",
                      }}
                      size={52}
                      gap={8}
                      src={item.avatar}
                    ></Avatar>
                    <div style={{ marginLeft: "6px" }}>
                      <h3>{item.name}</h3>
                      <p className={styles.desc}>{item.description}</p>
                    </div>
                  </Flex>
                </Card>
              </a>
            </Col>
          );
        })}
      </Row>
      {openModel && (
        <WwModel
          title="添加网址"
          isOpenModel={openModel}
          hideModal={hideModal}
          submitModal={submitCardListFn}
        >
          <BasicLinkInfoModal ref={childRef} />
        </WwModel>
      )}
    </>
  );
};

export default Index;
