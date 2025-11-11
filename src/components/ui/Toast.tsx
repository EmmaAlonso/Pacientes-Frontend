"use client";

import React from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
}

export function Toast({ message, type = "info" }: ToastProps) {
  const bg = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-gray-600";
  return (
    <div className={`${bg} text-white px-4 py-2 rounded-md shadow-md`}>{message}</div>
  );
}

let toastContainer: HTMLDivElement | null = null;

export function showToast(message: string, type: "success" | "error" | "info" = "info") {
  if (typeof window === "undefined") return;
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.style.position = "fixed";
    toastContainer.style.right = "20px";
    toastContainer.style.top = "20px";
    toastContainer.style.zIndex = "9999";
    document.body.appendChild(toastContainer);
  }

  const el = document.createElement("div");
  toastContainer.appendChild(el);

  const unmount = () => {
    if (el) {
      toastContainer?.removeChild(el);
    }
  };

  // render simple
  el.innerHTML = `<div style=\"padding:8px 12px;border-radius:8px;color:white;box-shadow:0 4px 12px rgba(0,0,0,0.1);margin-top:8px;background:${type==='success'? '#16a34a': type==='error' ? '#dc2626' : '#374151'}\">${message}</div>`;

  setTimeout(() => {
    try { unmount(); } catch (e) {}
  }, 3500);
}
