export function FinalCTAKeyframes() {
  return (
    <style>{`
      @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
      @keyframes scan { from{transform:translateY(-100%)} to{transform:translateY(6000%)} }
    `}</style>
  );
}
