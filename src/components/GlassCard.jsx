import { Card } from "antd";

function GlassCard({ title, children, width = "w-80", className = "" }) {
  return (
    <Card 
      className={`backdrop-blur-md bg-white/30 border border-white/50 shadow-lg ${width} ${className}`}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        borderRadius: "15px",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)"
      }}
    >
      {title && (
        <p className="text-center text-3xl font-bold my-2 text-white drop-shadow-lg">
          {title}
        </p>
      )}
      {children}
    </Card>
  );
}

export default GlassCard;
