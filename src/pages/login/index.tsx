import React, { useState, useEffect } from "react";
import { Login } from "@/service/api/user";

const Index = () => {
  useEffect(() => {
    // 演示mock中的请求
    Login().then((res) => {
      localStorage.setItem("token", JSON.stringify(res.token));
    });
  });
  return (
    <div>
      <p>login</p>
    </div>
  );
};

export default Index;
