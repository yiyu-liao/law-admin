/* Footer 页面底部 */
import React from "react";
import { Layout } from "antd";
import "./index.less";

const { Footer } = Layout;

interface Props {
  className?: string;
}

export default function FooterCom(props: Props) {
  return (
    <Footer className={`footer ${props.className}`}>
      © 华容法律服务管理平台{" "}
      {/* <a
        href="https://blog.isluo.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        blog.isluo.com
      </a>
      , Inc. */}
    </Footer>
  );
}
