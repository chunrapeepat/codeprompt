import React, { useState } from "react";
import { Button, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

interface CopyButtonProps {
  text: string;
}
function CopyButton(props: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  function handleCopyClick() {
    const el = document.createElement("textarea");
    el.value = props.text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    message.success("Text copied to clipboard");
  }

  return (
    <Button
      icon={<CopyOutlined />}
      style={{ marginTop: 15 }}
      onClick={handleCopyClick}
    >
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}

export default CopyButton;
