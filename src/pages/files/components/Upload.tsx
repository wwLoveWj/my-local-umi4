import React, { useState, useEffect } from "react";
import axios from "axios";
import { Progress } from "antd";
import { uploadImage } from "@/utils/index";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import styles from "./style.less";

const Index = ({
  getImgUrl,
}: {
  getImgUrl: ({ data }: { data: { filename: string; path: string } }) => void;
}) => {
  const [upLoadProgress, setupLoadProgress] = useState(0);
  const [imageUrl, setImgUrl] = useState("");
  const [displayClear, setDisplayClear] = useState(false);
  const getStrokeColor = () => {
    return upLoadProgress > 50 ? "green" : "red";
  };
  const getUrl = (formData: any) => {
    let loginInfo = JSON.parse(localStorage.getItem("login-info") || `{}`);
    let token = loginInfo?.token;
    let srcList: any[] = [];
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
          //   setupLoadProgress((progressEvent.loaded / progressEvent.total) * 100); //实时获取上传进度
          setupLoadProgress(
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
        srcList = [].concat(res.data.url);
        setDisplayClear(true);
        axios({
          url: "http://localhost:3007/imgOCR",
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { imgUrl: res.data.url },
        }).then((res) => {
          console.log(res, "识别的文字----------");
        });
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
        {!imageUrl ? (
          <PlusOutlined />
        ) : (
          <img src={imageUrl} alt="文件上传图片" />
        )}
        <span
          style={{ display: displayClear ? "block" : "none" }}
          className={styles.clearImg}
          onClick={(e) => {
            e.preventDefault();
            setImgUrl("");
            setDisplayClear(false);
            setupLoadProgress(0);
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
