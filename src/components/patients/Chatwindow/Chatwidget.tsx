"use client";
import { styles } from "@/constants/styles";
import { useEffect, useRef, useState } from "react";
import ModalWindow from "./ModalWindow";

function ChatWidget() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const widgetRef: any = useRef(null);
  // use effect listener to check if the mouse was cliked outside the window
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [widgetRef]);
  return (
    <div ref={widgetRef}>
      <ModalWindow visible={visible} /> {/* Chat Button Component */}
      <div
        onClick={() => setVisible(!visible)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          ...styles.chatWidget,
          ...{ border: hovered ? "1px solid black" : "" },
        }}
      >
        {/* Inner Container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Button Text */}
          <span style={styles.chatWidgetText}>Chat Now!!</span>
        </div>
      </div>
    </div>
  );
}

export default ChatWidget;
