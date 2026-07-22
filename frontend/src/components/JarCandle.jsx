import { T } from "../data/theme";
import { JAR_TYPES } from "../data/recipes";
import { rgbStr, lighten, darken } from "../utils/formatters";

function Flame({ cx, cy }) {
  return (
    <>
      <ellipse cx={cx} cy={cy} rx="6" ry="10.5" fill={T.flameCore} opacity="0.92" />
      <ellipse cx={cx} cy={cy + 3} rx="3.4" ry="6.2" fill={T.flameMid} />
      <ellipse cx={cx} cy={cy + 5} rx="1.7" ry="2.8" fill={T.flameTip} />
    </>
  );
}

function GlassHighlight({ x, y, h }) {
  return <rect x={x} y={y} width="4" height={h} rx="2" fill={T.glassHighlight} opacity="0.35" />;
}

/**
 * Renders one of 10 distinct jar/bottle shapes with the wax color visibly
 * filling the container. Shape + lid + wax color all change based on props.
 */
export function JarCandle({ jarTypeId, rgb, lit, size = 130, showFace = false }) {
  const jt = JAR_TYPES.find((j) => j.id === jarTypeId) ?? JAR_TYPES[0];
  const melt = lighten(rgb, 30);
  const shadow = <ellipse cx="60" cy="163" rx="30" ry="5" fill={T.goldLight} opacity="0.35" />;
  const strokeCol = T.cocoa;
  const wickCol = T.cocoa;

  let content;
  switch (jt.id) {
    case "square":
      content = (
        <>
          <rect x="30" y="46" width="60" height="98" rx="6" fill={rgbStr(rgb)} stroke={strokeCol} strokeWidth="2" strokeOpacity="0.4" />
          <GlassHighlight x="38" y="54" h="80" />
          {!lit && <ellipse cx="60" cy="40" rx="34" ry="8" fill={T.lidWood} stroke={strokeCol} strokeWidth="1.5" strokeOpacity="0.4" />}
          {lit && <ellipse cx="94" cy="34" rx="18" ry="6" fill={T.lidWood} opacity="0.85" transform="rotate(-18 94 34)" />}
          {lit && <ellipse cx="60" cy="54" rx="24" ry="7" fill={rgbStr(melt)} />}
          <line x1="60" y1={lit ? 54 : 60} x2="60" y2="38" stroke={wickCol} strokeWidth="2" strokeLinecap="round" />
          {lit && <Flame cx={60} cy={30} />}
        </>
      );
      break;
    case "cone":
      content = (
        <>
          <path d="M 28 40 L 92 40 L 78 148 L 42 148 Z" fill={rgbStr(rgb)} stroke={strokeCol} strokeWidth="2" strokeOpacity="0.4" />
          <GlassHighlight x="36" y="48" h="90" />
          {lit && <ellipse cx="60" cy="48" rx="28" ry="7" fill={rgbStr(melt)} />}
          <line x1="60" y1={lit ? 48 : 52} x2="60" y2="32" stroke={wickCol} strokeWidth="2" strokeLinecap="round" />
          {lit && <Flame cx={60} cy={24} />}
        </>
      );
      break;
    case "tall":
      content = (
        <>
          <rect x="40" y="30" width="40" height="122" rx="9" fill={rgbStr(rgb)} stroke={strokeCol} strokeWidth="2" strokeOpacity="0.4" />
          <GlassHighlight x="46" y="38" h="104" />
          {lit && <ellipse cx="60" cy="38" rx="17" ry="6" fill={rgbStr(melt)} />}
          <line x1="60" y1={lit ? 38 : 42} x2="60" y2="22" stroke={wickCol} strokeWidth="2" strokeLinecap="round" />
          {lit && <Flame cx={60} cy={14} />}
        </>
      );
      break;
    case "bottle":
      content = (
        <>
          <ellipse cx="60" cy="120" rx="34" ry="30" fill={rgbStr(rgb)} opacity="0.85" stroke={strokeCol} strokeWidth="2" strokeOpacity="0.4" />
          <path d="M 50 95 L 50 58 Q 50 50 58 48 L 62 48 Q 70 50 70 58 L 70 95 Z" fill={rgbStr(rgb)} opacity="0.7" stroke={strokeCol} strokeWidth="1.5" strokeOpacity="0.4" />
          <GlassHighlight x="42" y="98" h="42" />
          {lit && <ellipse cx="60" cy="55" rx="9" ry="4" fill={rgbStr(melt)} />}
          {!lit && <path d="M 55 40 L 65 40 L 63 30 L 57 30 Z" fill={T.lidCork} />}
          {lit && <path d="M 82 34 L 90 34 L 88 24 L 84 24 Z" fill={T.lidCork} transform="rotate(20 86 29)" />}
          <line x1="60" y1={lit ? 55 : 48} x2="60" y2="34" stroke={wickCol} strokeWidth="1.8" strokeLinecap="round" />
          {lit && <Flame cx={60} cy={26} />}
        </>
      );
      break;
    case "tin":
      content = (
        <>
          <ellipse cx="60" cy="132" rx="38" ry="10" fill={rgbStr(darken(rgb, 10))} stroke={strokeCol} strokeWidth="2" strokeOpacity="0.5" />
          <rect x="22" y="110" width="76" height="24" fill={rgbStr(rgb)} stroke={strokeCol} strokeWidth="2" strokeOpacity="0.5" />
          <ellipse cx="60" cy="110" rx="38" ry="10" fill={rgbStr(lighten(rgb, 8))} stroke={strokeCol} strokeWidth="2" strokeOpacity="0.5" />
          {lit && <ellipse cx="60" cy="110" rx="26" ry="6" fill={rgbStr(melt)} />}
          <ellipse cx="102" cy="98" rx="16" ry="5" fill={T.lidTin} stroke={strokeCol} strokeWidth="1.2" strokeOpacity="0.4" transform="rotate(-12 102 98)" />
          <line x1="60" y1={lit ? 110 : 104} x2="60" y2="92" stroke={wickCol} strokeWidth="2" strokeLinecap="round" />
          {lit && <Flame cx={60} cy={84} />}
        </>
      );
      break;
    case "bowl":
      content = (
        <>
          <path d="M 18 112 Q 18 145 60 148 Q 102 145 102 112 Q 102 100 60 100 Q 18 100 18 112 Z" fill={rgbStr(rgb)} stroke={strokeCol} strokeWidth="2" strokeOpacity="0.4" />
          <ellipse cx="60" cy="112" rx="42" ry="12" fill={rgbStr(lighten(rgb, 10))} stroke={strokeCol} strokeWidth="1.5" strokeOpacity="0.35" />
          {lit && <ellipse cx="60" cy="112" rx="30" ry="7" fill={rgbStr(melt)} />}
          <line x1="60" y1={lit ? 112 : 112} x2="60" y2="96" stroke={wickCol} strokeWidth="2" strokeLinecap="round" />
          {lit && <Flame cx={60} cy={88} />}
        </>
      );
      break;
    case "heart": {
      const heart = "M 60 66 C 46 40 14 44 14 74 C 14 100 42 118 60 138 C 78 118 106 100 106 74 C 106 44 74 40 60 66 Z";
      content = (
        <>
          <path d={heart} fill={rgbStr(rgb)} stroke={strokeCol} strokeWidth="2.5" strokeOpacity="0.45" />
          <ellipse cx="42" cy="66" rx="7" ry="12" fill={T.glassHighlight} opacity="0.3" transform="rotate(-18 42 66)" />
          {lit && <ellipse cx="60" cy="78" rx="17" ry="7" fill={rgbStr(melt)} />}
          <line x1="60" y1={lit ? 78 : 80} x2="60" y2="62" stroke={wickCol} strokeWidth="2" strokeLinecap="round" />
          {lit && <Flame cx={60} cy={54} />}
        </>
      );
      break;
    }
    case "hexagon":
      content = (
        <>
          <path d="M 60 36 L 92 54 L 92 130 L 60 148 L 28 130 L 28 54 Z" fill={rgbStr(rgb)} stroke={strokeCol} strokeWidth="2" strokeOpacity="0.4" />
          <GlassHighlight x="36" y="62" h="70" />
          {lit && <ellipse cx="60" cy="54" rx="24" ry="7" fill={rgbStr(melt)} />}
          <line x1="60" y1={lit ? 54 : 58} x2="60" y2="38" stroke={wickCol} strokeWidth="2" strokeLinecap="round" />
          {lit && <Flame cx={60} cy={30} />}
        </>
      );
      break;
    case "mason":
      content = (
        <>
          <path d="M 32 60 Q 32 46 44 44 L 76 44 Q 88 46 88 60 L 88 146 L 32 146 Z" fill={rgbStr(rgb)} stroke={strokeCol} strokeWidth="2" strokeOpacity="0.4" />
          <GlassHighlight x="40" y="66" h="72" />
          <rect x="42" y="30" width="36" height="16" rx="3" fill={T.lidMasonBand} stroke={strokeCol} strokeWidth="1.5" strokeOpacity="0.5" />
          <line x1="42" y1="35" x2="78" y2="35" stroke={strokeCol} strokeWidth="1" strokeOpacity="0.4" />
          <line x1="42" y1="40" x2="78" y2="40" stroke={strokeCol} strokeWidth="1" strokeOpacity="0.4" />
          <path d="M 26 70 Q 14 90 26 112" fill="none" stroke={T.lidMasonWire} strokeWidth="2.4" opacity="0.7" />
          {lit && <ellipse cx="60" cy="62" rx="24" ry="6" fill={rgbStr(melt)} />}
          <line x1="60" y1={lit ? 62 : 50} x2="60" y2="48" stroke={wickCol} strokeWidth="2" strokeLinecap="round" />
          {lit && <Flame cx={60} cy={40} />}
        </>
      );
      break;
    default: // round
      content = (
        <>
          <rect x="28" y="42" width="64" height="104" rx="14" fill={rgbStr(rgb)} stroke={strokeCol} strokeWidth="2" strokeOpacity="0.4" />
          <GlassHighlight x="36" y="50" h="88" />
          {lit && <ellipse cx="60" cy="52" rx="24" ry="7" fill={rgbStr(melt)} />}
          <line x1="60" y1={lit ? 52 : 56} x2="60" y2="36" stroke={wickCol} strokeWidth="2" strokeLinecap="round" />
          {lit && <Flame cx={60} cy={28} />}
        </>
      );
  }

  return (
    <svg viewBox="0 0 120 170" style={{ width: size }}>
      {shadow}
      {content}
      {showFace && (
        <g opacity="0.55">
          <circle cx="50" cy="95" r="2.2" fill={T.text} />
          <circle cx="70" cy="95" r="2.2" fill={T.text} />
          <path d="M 54 101 Q 60 105 66 101" fill="none" stroke={T.text} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
