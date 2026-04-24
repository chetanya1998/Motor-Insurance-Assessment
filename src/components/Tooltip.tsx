"use client";
import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function Tooltip({ text }: { text: string }) {
  return (
    <span className="tooltip-trigger">
      <HelpCircle size={10} />
      <span className="tooltip-content">{text}</span>
    </span>
  );
}
