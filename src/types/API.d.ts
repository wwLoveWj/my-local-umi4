declare namespace API {
  interface CardLinkList {
    name: string;
    link: string;
    avatar: string;
    description: string;
    id: number;
    linkId: string;
  }
  interface ApiInfoType {
    APIKey: string;
    APISecret: string;
    APPID: string;
  }
  interface MailSendParamsType {
    to: string;
    subject: string;
    text: string;
    attachments: any;
    currentUser: string;
  }
  interface taskListType {
    task: string;
    taskId: string;
    createTime: string;
    reminderTime: string;
    status: string;
  }
}
