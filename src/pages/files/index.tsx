import React, { useState } from "react";
import axios from "axios";
import { Progress } from "antd";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { uploadImage } from "@/utils/index";
import styles from "./style.less";

const Index = ({
  getImgUrl,
}: {
  getImgUrl: ({ data }: { data: any }) => void;
}) => {
  // TODO:还需要改造样式
  const [upLoadProgress, setUpLoadProgress] = useState(0); //处理进度条进度
  const [imgUrl, setImgUrl] = useState(""); //拿到图片的服务器地址
  const [displayClear, setDisplayClear] = useState(false); //是否清除图片，显示x
  // 进度条的显示进度对应的色号
  const getStrokeColor = () => {
    return upLoadProgress > 50 ? "green" : "red";
  };
  // 获取服务器图片url的接口请求方法
  const getUrl = (formData: any) => {
    let loginInfo = JSON.parse(localStorage.getItem("login-info") || `{}`);
    let token = loginInfo?.token;
    axios({
      url: "http://localhost:3007/file/upload",
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
      onUploadProgress: function (progressEvent) {
        //原生获取上传进度的事件
        if (progressEvent?.event?.lengthComputable) {
          //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
          //   setUpLoadProgress((progressEvent.loaded / progressEvent.total) * 100); //实时获取上传进度
          setUpLoadProgress(
            Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            )
          );
        }
      },
    }).then((res) => {
      getImgUrl && getImgUrl(res);
      if (res.status === 200) {
        setImgUrl(res.data.url);
        setDisplayClear(true);
        // 是否要提取图片文字ocr
        // axios({
        //   url: "http://localhost:3007/imgOCR",
        //   method: "post",
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        //   data: { imgUrl: res.data.url },
        // }).then((res) => {
        //   console.log(res, "识别的文字----------");
        // });
      }
    });
  };
  return (
    <div className={styles.fileUpload}>
      <div
        className={styles.fileUploadContent}
        onClick={() => {
          uploadImage(getUrl);
        }}
      >
        {!imgUrl ? <PlusOutlined /> : <img src={imgUrl} alt="文件上传图片" />}
        <span
          style={{ display: displayClear ? "block" : "none" }}
          className={styles.clearImg}
          onClick={(e) => {
            e.preventDefault();
            setImgUrl("");
            setDisplayClear(false);
            setUpLoadProgress(0);
          }}
        >
          <CloseCircleOutlined />
        </span>
      </div>
      <p>上传进度:{upLoadProgress}</p>
      <Progress
        percent={upLoadProgress}
        status="active"
        style={{ width: "300px" }}
        strokeColor={getStrokeColor()}
      />
    </div>
  );
};

export default Index;
