import React from 'react';

const ROMANS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export const RomanNumeral = ({ value }: { value: number }) => {
  return (
    <span className="caption text-leaf tabular-nums">
      {ROMANS[value - 1] || value}
    </span>
  );
};
