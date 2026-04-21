"use client";

import Image from "next/image";

export default function Logo() {

  const logoStyle: React.CSSProperties = {
    position: "fixed",
    top: "10px",
    left: "10px",
    zIndex: 1000,
    cursor: "default"
  };

  return (
    <div style={logoStyle}>
      <Image
        src="/logo.png"
        alt="Hobby Japan"
        width={120}
        height={120}
        priority
      />
    </div>
  );
}