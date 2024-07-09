import type { CatalogueType } from "./type";

// 获取所有的h1-h6节点集合
export const getAllHtagList = () => {
  let content = document.querySelector(".content") as HTMLElement;
  return content?.querySelectorAll("h1,h2,h3,h4,h5,h6");
};

// 添加锚点
export const addAnchorLinks = () => {
  const headings = getAllHtagList();
  headings?.forEach((heading, index) => {
    const anchorLink = document.createElement("a");
    anchorLink.setAttribute("href", `#section-${index + 1}`);
    // anchorLink.textContent = heading.textContent; // 设置锚点文本为标题文本
    anchorLink.style.pointerEvents = "none"; // 设置 pointer-events 为 none，使链接不可点击
    // 设置标题的id属性
    heading.setAttribute("id", `section-${index + 1}`);
    // 将锚点链接插入到标题内
    heading.innerHTML = anchorLink.outerHTML + heading.innerHTML;
  });
};
// 生成目录
export const generateTableOfContents = () => {
  const headings = getAllHtagList();
  const toc: CatalogueType[] = [];
  headings?.forEach((heading, index) => {
    const id = `section-${index + 1}`;
    const level =
      heading.tagName === "H1" ? 1 : heading.tagName === "H2" ? 2 : 3; // 根据标题等级设置目录项的缩进
    heading.setAttribute("id", id); // 设置标题的id属性
    toc.push({
      id: id,
      text: heading.textContent,
      level: level,
      index: index,
    }); // 将标题文本、id和等级添加到目录项中
  });
  return toc;
};

// 更新目录项点击事件处理函数
export const handleItemClick = (index: number) => {
  // 获取目标目录项的锚点链接 href 属性值
  const targetItem = document.querySelector(
    `.table-of-contents a[href="#section-${index + 1}"]`
  ) as HTMLElement;
  // 滚动目录以确保当前点击的目录项可见
  if (targetItem) {
    const container = document.querySelector(
      ".table-of-contents"
    ) as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const scrollTop = targetItem.offsetTop - containerRect.height / 2;
    container.scrollTop = scrollTop;
  }
};
