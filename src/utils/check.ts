export const validEmail = (rule: any, value: string) => {
  if (value) {
    const regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const valid = regx.test(value);
    if (valid) {
      return Promise.resolve();
    }
    return Promise.reject("邮箱格式不正确，如：xxx@msxf.com");
  }
  return Promise.reject("账户不能为空");
};
export const validUsername = (rule: any, value: string) => {
  if (value) {
    const regx = /^[a-z][a-z0-9-]*$/;
    const valid = regx.test(value);
    if (valid) {
      return Promise.resolve();
    }
    return Promise.reject(
      "用户名应为以小写字母开头的小写字母、中横线(—)、数字组合"
    );
  }
  return Promise.reject("账户不能为空");
};

// 非必填邮箱
export const validEmailNoRequire = (rule: any, value: string) => {
  if (value) {
    const regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const valid = regx.test(value);
    if (valid) {
      return Promise.resolve();
    }
    return Promise.reject("邮箱格式不正确，如：xxx@msxf.com");
  }
  return Promise.resolve();
};
export const verifyUserPassword = (rule: any, value: string) => {
  if (value) {
    // const regx = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![\W_]+$)\S{6,20}$/;
    const regx =
      /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,32}/;
    const valid = regx.test(value);
    if (valid) {
      return Promise.resolve();
    }
    return Promise.reject("须为字母大小写、数字、特殊符号8至32位组合");
  }
  return Promise.reject("密码不能为空");
};
export const verifyUserTel = (rule: any, value: string) => {
  if (value) {
    // const regx = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![\W_]+$)\S{6,20}$/;
    const regx = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
    const valid = regx.test(value);
    if (valid) {
      return Promise.resolve();
    }
    return Promise.reject("联系电话格式不对");
  }
  return Promise.resolve();
};

export const validatePhone = (rule: any, value: string, callback: any) => {
  const mobileReg =
    /^(([1][3,4,5,7,8,9]\d{9})|([0]\d{10,11})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8}))$/;
  const phoneReg = /^\d{3}-\d{8}|\d{4}-\d{7}$/;

  if (!value || value === "") return callback();
  if (value.length === 11) {
    if (!mobileReg.test(value))
      return callback(
        new Error("请输入正确的手机号码或者固话号码（固话格式：区号-号码）")
      );
    return callback();
  } else if (value.length === 12) {
    if (!phoneReg.test(value))
      return callback(
        new Error("请输入正确的手机号码或者固话号码（固话格式：区号-号码）")
      );
    return callback();
  }
  return callback(
    new Error("请输入正确的手机号码或者固话号码（固话格式：区号-号码）")
  );
};

export const verifyEnName = (rule: any, value: string) => {
  if (value) {
    const regx = /^[^\u4e00-\u9fa5]+$/;
    const valid = regx.test(value);
    if (valid) {
      return Promise.resolve();
    }
    return Promise.reject("不应包含中文");
  }
  return Promise.reject("英文名称不能为空");
};

export const validResourceCode = (rule: any, value: string) => {
  if (value) {
    const regx = /^([a-z|A-Z|\-]{1,32})$/;
    const valid = regx.test(value);
    if (valid) {
      return Promise.resolve();
    }
    return Promise.reject("限32字符，英文、中划线（-）组合");
  }
  return Promise.reject("应用编码不能为空");
};
