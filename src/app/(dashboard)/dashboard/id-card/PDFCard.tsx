// components/PDFCard.tsx
"use client";

import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export const PDFCard = ({ userData }: any) => {
  const verificationUrl = `https://amazeayurveda.in/verify/${userData?.username}`;

  return (
    <div style={{ width: "350px", fontFamily: "sans-serif" }}>
      
      {/* FRONT */}
      <div style={{
        width: "350px",
        height: "220px",
        background: "#0f172a",
        color: "white",
        display: "flex",
        padding: "12px",
        borderRadius: "12px",
        marginBottom: "10px"
      }}>

        {/* LEFT */}
        <div style={{
          width: "30%",
          background: "#059669",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <img src="/amaze-logo.png" width={40} />
          <p style={{ fontSize: "10px", fontWeight: "bold" }}>Amaze</p>
        </div>

        {/* RIGHT */}
        <div style={{ paddingLeft: "10px", flex: 1 }}>
          <h3 style={{ fontSize: "14px" }}>{userData?.name}</h3>
          <p style={{ fontSize: "10px" }}>ID: {userData?.username}</p>

          <img
            src={userData?.photoUrl || "/default-user.png"}
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              borderRadius: "6px",
              marginTop: "6px"
            }}
          />

          <p style={{ fontSize: "10px", marginTop: "6px" }}>
            +91 {userData?.mobile}
          </p>
        </div>
      </div>

      {/* BACK */}
      <div style={{
        width: "350px",
        height: "220px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        padding: "12px",
        borderRadius: "12px"
      }}>

        <div style={{ fontSize: "10px", width: "60%" }}>
          <p>{userData?.address}</p>
          <p>{userData?.district}, {userData?.state}</p>
        </div>

        <div style={{ textAlign: "center" }}>
          <QRCodeCanvas value={verificationUrl} size={90} />
          <p style={{ fontSize: "9px" }}>Scan to Verify</p>
        </div>
      </div>
    </div>
  );
};