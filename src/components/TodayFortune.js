import { useState, useEffect } from "react";
import useProgressiveImg from "./useProgressiveImg";

export default function TodayFortune({ doc, url }) {
  const [src, { blur }] = useProgressiveImg("../images/todayFortune.png", url);

  return (
    <div
      className="startFadeIn"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <p
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "white",
          padding: 10,
          margin: 10,
        }}
      >
        {doc.data().uploader}
      </p>
      <img
        style={{
          width: 200,
          filter: blur ? "blur(20px)" : "none",
          transition: blur ? "none" : "filter 0.3s ease-out",
        }}
        // style={{
        //   width: "90%",
        //   maxWidth: 500,
        //   borderRadius: 10,
        //   overflow: "hidden",
        // }}
        src={src}
      />
      <p
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "white",
          padding: 10,
          margin: 10,
        }}
      >
        {doc.data().fortune}
      </p>
      {/* <button
        style={{
          background: "rgba(0,0,0,0)",
          borderRadius: 100,
          border: "2px solid white",

          boxShadow: "0px 10px 10px grey",
          padding: 5,
        }}
        className="mainButton"
        onClick={() => window.location.reload()}
      >
        <img
          style={{ borderRadius: 100, transform: "scaleX(-1)" }}
          src="./images/pepe_return.png"
          width="80"
          height="80"
        />
      </button> */}
      <button
        style={{
          backgroundColor: "white",
          border: "2px solid white",

          borderRadius: 5,
          padding: 10,
          marginTop: 10,
          boxShadow: "0px 5px 5px grey",
        }}
        onClick={() => {
          window.location.reload();
        }}
      >
        돌아가기
      </button>
    </div>
  );
}
