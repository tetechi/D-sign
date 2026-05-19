"use client";

import { useRef, useEffect, useState, useCallback } from "react";

const CANVAS_SIZE = 400;
const CENTER = CANVAS_SIZE / 2;

type FontOption = {
  label: string;
  value: string;
  cssFamily: string;
};

type FontGroup = {
  group: string;
  fonts: FontOption[];
};

const FONT_GROUPS: FontGroup[] = [
  {
    group: "定番・明朝系",
    fonts: [
      { label: "Noto Serif JP", value: "noto", cssFamily: "'Noto Serif JP', serif" },
      { label: "Shippori Mincho", value: "shippori", cssFamily: "'Shippori Mincho', serif" },
      { label: "Zen Antique — 古風な明朝", value: "zen-antique", cssFamily: "'Zen Antique', serif" },
      { label: "Kaisei Decol — 装飾明朝", value: "kaisei", cssFamily: "'Kaisei Decol', serif" },
      { label: "New Tegomin — レトロ明朝", value: "tegomin", cssFamily: "'New Tegomin', serif" },
    ],
  },
  {
    group: "ゴシック・モダン系",
    fonts: [
      { label: "M PLUS 1p", value: "mplus", cssFamily: "'M PLUS 1p', sans-serif" },
      { label: "Zen Kaku Gothic New", value: "zen-kaku", cssFamily: "'Zen Kaku Gothic New', sans-serif" },
      { label: "BIZ UDGothic", value: "biz-ud", cssFamily: "'BIZ UDGothic', sans-serif" },
    ],
  },
  {
    group: "個性派・奇抜系 🔥（日本語対応）",
    fonts: [
      { label: "RocknRoll One 🤘 — 太くポップ", value: "rocknroll", cssFamily: "'RocknRoll One', sans-serif" },
      { label: "Hachi Maru Pop 🍡 — まるまる可愛い", value: "hachi", cssFamily: "'Hachi Maru Pop', cursive" },
      { label: "DotGothic16 👾 — ドット・ピクセル", value: "dotgothic", cssFamily: "'DotGothic16', sans-serif" },
      { label: "Stick 🥢 — 超極細・棒体", value: "stick", cssFamily: "'Stick', sans-serif" },
      { label: "Zen Kurenaido 🌸 — 手書き筆文字", value: "kurenaido", cssFamily: "'Zen Kurenaido', sans-serif" },
      { label: "Rampart One 🏰 — 中抜き・輪郭体", value: "rampart", cssFamily: "'Rampart One', sans-serif" },
      { label: "Dela Gothic One 💪 — 超極太ゴシック", value: "dela", cssFamily: "'Dela Gothic One', sans-serif" },
      { label: "Train One 🚃 — メカニカル", value: "train", cssFamily: "'Train One', sans-serif" },
      { label: "Yuji Syuku 📜 — 毛筆・古典", value: "yuji", cssFamily: "'Yuji Syuku', serif" },
      { label: "Klee One ✏️ — 手書き教科書体", value: "klee", cssFamily: "'Klee One', cursive" },
    ],
  },
];

const FONT_OPTIONS: FontOption[] = FONT_GROUPS.flatMap((g) => g.fonts);

const FONT_WEIGHT_OPTIONS = [
  { label: "細字 (Light)", value: "300" },
  { label: "標準 (Regular)", value: "400" },
  { label: "中太 (Medium)", value: "500" },
  { label: "太字 (Bold)", value: "700" },
];

export default function HankoPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("山田太郎");
  const [layout, setLayout] = useState<"vertical" | "horizontal">("vertical");
  const [fontKey, setFontKey] = useState("noto");
  const [fontWeight, setFontWeight] = useState("400");
  const [color, setColor] = useState("#CC0000");
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [doubleRing, setDoubleRing] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load Google Fonts dynamically
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;700&family=Shippori+Mincho:wght@400;500;700&family=Zen+Antique&family=New+Tegomin&family=Kaisei+Decol:wght@400;700&family=M+PLUS+1p:wght@300;400;700&family=Zen+Kaku+Gothic+New:wght@300;400;700&family=BIZ+UDGothic:wght@400;700&family=RocknRoll+One&family=Hachi+Maru+Pop&family=DotGothic16&family=Stick&family=Zen+Kurenaido&family=Rampart+One&family=Dela+Gothic+One&family=Train+One&family=Yuji+Syuku&family=Klee+One:wght@400;600&display=swap";
    document.head.appendChild(link);
    link.onload = () => setFontsLoaded(true);
    // Fallback in case onload doesn't fire
    const timer = setTimeout(() => setFontsLoaded(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const selectedFont = FONT_OPTIONS.find((f) => f.value === fontKey) ?? FONT_OPTIONS[0];

  const drawStamp = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ensure the selected font is loaded before drawing
    try {
      await document.fonts.load(`${fontWeight} 40px ${selectedFont.cssFamily}`);
    } catch (_) { /* fallback to system font */ }

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const outerRadius = CENTER - strokeWidth / 2 - 4;
    const innerRingRadius = outerRadius - strokeWidth - 6;

    // Draw outer ring
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, outerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    // Draw inner ring if double ring is enabled
    if (doubleRing) {
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, innerRingRadius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(2, strokeWidth * 0.5);
      ctx.stroke();
    }

    if (!text) return;

    const chars = text.split("");
    const fontFamily = selectedFont.cssFamily;

    if (layout === "horizontal") {
      // Horizontal layout — center text in circle
      const textRadius = doubleRing
        ? innerRingRadius - strokeWidth * 0.5 - 8
        : outerRadius - strokeWidth - 12;
      const maxWidth = textRadius * 1.6;

      // Determine font size to fit
      let fontSize = Math.floor(textRadius * 1.0);
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      let measured = ctx.measureText(text).width;
      while (measured > maxWidth && fontSize > 10) {
        fontSize -= 2;
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        measured = ctx.measureText(text).width;
      }

      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, CENTER, CENTER, maxWidth);
    } else {
      // Vertical layout — stack characters in a column, centered in the circle
      const innerClearance = doubleRing
        ? innerRingRadius - Math.max(2, strokeWidth * 0.5) - 8
        : outerRadius - strokeWidth - 10;
      const n = chars.length;

      // Available height = diameter of the inner clear area
      const availableHeight = innerClearance * 2;
      // Font size: fill the available height evenly, with a small gap
      let fontSize = Math.floor(availableHeight / (n + 0.3));
      // Also constrain by width (stamp is circular, so narrower near top/bottom)
      const maxFontByWidth = Math.floor(innerClearance * 1.1);
      fontSize = Math.min(fontSize, maxFontByWidth);
      fontSize = Math.max(fontSize, 12);

      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;

      // Total block height with small line spacing
      const lineHeight = fontSize * 1.05;
      const totalHeight = lineHeight * n;
      const startY = CENTER - totalHeight / 2 + lineHeight / 2;

      chars.forEach((char, i) => {
        ctx.fillText(char, CENTER, startY + i * lineHeight);
      });
    }
  }, [text, layout, selectedFont, fontWeight, color, strokeWidth, doubleRing]);

  useEffect(() => {
    drawStamp();
  }, [drawStamp, fontsLoaded]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "hanko.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">
          デジタル印鑑メーカー
          <span className="ml-2 text-sm font-normal text-gray-500">D-sign</span>
        </h1>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Controls Panel */}
          <div className="lg:w-80 flex-shrink-0 space-y-6">
            {/* Text Input */}
            <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                印鑑テキスト
              </h2>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 8))}
                maxLength={8}
                placeholder="文字を入力（最大8文字）"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <p className="text-xs text-gray-400 mt-1">{text.length} / 8 文字</p>
            </section>

            {/* Layout Toggle */}
            <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                文字配置
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setLayout("vertical")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                    layout === "vertical"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-red-400"
                  }`}
                >
                  縦書き
                </button>
                <button
                  onClick={() => setLayout("horizontal")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                    layout === "horizontal"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-red-400"
                  }`}
                >
                  横書き
                </button>
              </div>
            </section>

            {/* Font Selection */}
            <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                フォント
              </h2>
              <div className="space-y-4">
                {FONT_GROUPS.map((group) => (
                  <div key={group.group}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                      {group.group}
                    </p>
                    <div className="space-y-1">
                      {group.fonts.map((f) => (
                        <label
                          key={f.value}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition ${
                            fontKey === f.value
                              ? "border-red-400 bg-red-50"
                              : "border-transparent hover:border-gray-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="font"
                            value={f.value}
                            checked={fontKey === f.value}
                            onChange={() => setFontKey(f.value)}
                            className="accent-red-600 shrink-0"
                          />
                          <span className="text-sm text-gray-700" style={{ fontFamily: f.cssFamily }}>
                            {f.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Font Weight */}
            <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                フォントウェイト
              </h2>
              <select
                value={fontWeight}
                onChange={(e) => setFontWeight(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {FONT_WEIGHT_OPTIONS.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>
            </section>

            {/* Color Picker */}
            <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                カラー
              </h2>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer border border-gray-300"
                />
                <span className="text-sm font-mono text-gray-600">{color.toUpperCase()}</span>
              </div>
              {/* Preset colors */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {["#CC0000", "#8B0000", "#000080", "#1a1a1a", "#006400", "#4B0082"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    title={c}
                    className={`w-7 h-7 rounded-full border-2 transition ${
                      color === c ? "border-gray-800 scale-110" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </section>

            {/* Stroke Width */}
            <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                リング太さ: {strokeWidth}px
              </h2>
              <input
                type="range"
                min={2}
                max={20}
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full accent-red-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>細い</span>
                <span>太い</span>
              </div>
            </section>

            {/* Double Ring Toggle */}
            <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={doubleRing}
                  onChange={(e) => setDoubleRing(e.target.checked)}
                  className="w-4 h-4 accent-red-600"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">二重丸（内枠）</span>
                  <p className="text-xs text-gray-400">外枠に加えて内側にも円を追加</p>
                </div>
              </label>
            </section>
          </div>

          {/* Preview + Download */}
          <div className="flex-1 flex flex-col items-center gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-4 w-full">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide self-start">
                プレビュー
              </h2>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_SIZE}
                  height={CANVAS_SIZE}
                  className="max-w-full"
                  style={{ maxWidth: "360px", imageRendering: "crisp-edges" }}
                />
              </div>
              {!fontsLoaded && (
                <p className="text-xs text-gray-400">フォントを読み込み中...</p>
              )}
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full max-w-xs bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3 px-8 rounded-xl shadow transition text-base"
            >
              PNG ダウンロード
            </button>
            <p className="text-xs text-gray-400">透明背景の PNG として保存されます</p>
          </div>
        </div>
      </main>
    </div>
  );
}
