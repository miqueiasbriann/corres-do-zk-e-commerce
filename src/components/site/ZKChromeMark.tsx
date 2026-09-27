import { useEffect, useState } from "react";

export function ZKChromeMark() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`zk-chrome-mark-shell ${ready ? "is-ready" : ""}`}
      aria-hidden="true"
    >
      <span className="zk-chrome-fallback">ZK</span>
      <span className="zk-chrome-mark" role="presentation">
        <span className="zk-chrome-face">ZK</span>
        <span className="zk-chrome-extrusion zk-chrome-extrusion-1">ZK</span>
        <span className="zk-chrome-extrusion zk-chrome-extrusion-2">ZK</span>
        <span className="zk-chrome-extrusion zk-chrome-extrusion-3">ZK</span>
      </span>
    </div>
  );
}
