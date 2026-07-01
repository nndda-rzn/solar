"use client";

import { X, Star, Clock, Globe } from "lucide-react";
import { Constellation } from "@/types/canvas/constellation";

interface ConstellationInfoProps {
  constellation: Constellation | null;
  onClose: () => void;
}

export function ConstellationInfo({
  constellation,
  onClose,
}: ConstellationInfoProps) {
  if (!constellation) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md z-50 pointer-events-auto">
      <div
        className="h-full overflow-y-auto"
        style={{
          background: "rgba(10, 10, 15, 0.95)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(0, 255, 255, 0.15)",
        }}
      >
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <Star size={16} className="text-cyan-400" />
            <span className="text-cyan-400 text-xs font-medium tracking-wider uppercase">
              Constellation
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">
            {constellation.name}
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            {constellation.indonesianName}
          </p>

          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            {constellation.description}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock size={14} className="text-cyan-400" />
              <span>{constellation.bestViewing}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Globe size={14} className="text-cyan-400" />
              <span>Seluruh Indonesia</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Bintang Utama</h3>
            <div className="space-y-2">
              {constellation.stars.map((star) => (
                <div
                  key={star.id}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{
                    background: "rgba(30, 41, 59, 0.5)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: star.color,
                      boxShadow: `0 0 8px ${star.color}`,
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      {star.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Magnitude {star.magnitude} - {star.type.replace("-", " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">Mitologi</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {constellation.mythology}
            </p>
          </div>

          <div
            className="p-4 rounded-lg"
            style={{
              background: "rgba(0, 255, 255, 0.05)",
              border: "1px solid rgba(0, 255, 255, 0.1)",
            }}
          >
            <h4 className="text-cyan-400 text-sm font-semibold mb-1">
              Tips Pengamatan
            </h4>
            <p className="text-gray-400 text-xs">
              Rasi {constellation.name} terlihat jelas pada malam hari saat
              musim {constellation.bestViewing}. Cari posisi gelap jauh dari
              polusi cahaya untuk pengalaman terbaik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
