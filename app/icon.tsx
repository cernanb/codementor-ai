import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#161b22",
          borderRadius: "20%",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Greater than symbol (>) - Terminal prompt */}
          <path
            d="M12 16L22 24L12 32"
            stroke="#58a6ff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Underscore/cursor (_) */}
          <rect x="26" y="28" width="12" height="4" rx="1" fill="#3fb950" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
