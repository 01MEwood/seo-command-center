import { useState } from "react";

export default function ContentStudio() {
  return (
    <div>
      <div style={{ 
        background: "#13132A", border: "1px solid #22224A", borderRadius: 14, 
        padding: 40, textAlign: "center" 
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
        <h2 style={{ color: "#EDEDF5", fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>
          Content Studio
        </h2>
        <p style={{ color: "#6B6B9A", fontSize: 14, lineHeight: 1.6, maxWidth: 500, margin: "0 auto" }}>
          Artikel-Editor mit Texten, Expert-Briefings und SEO-Metadaten.
          Wird im nächsten Update freigeschaltet.
        </p>
        <div style={{ 
          marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" 
        }}>
          {[
            { id: 1, title: "Einbauschrank Kosten", status: "live", color: "#10B981" },
            { id: 10, title: "Aufmaß-Termin", status: "prio", color: "#EF4444" },
            { id: 7, title: "Dachschräge", status: "prio", color: "#EF4444" },
            { id: 2, title: "Ankleide planen", status: "geplant", color: "#3B82F6" },
            { id: 6, title: "Schreiner vs. IKEA", status: "geplant", color: "#3B82F6" },
            { id: 3, title: "Region Stuttgart", status: "geplant", color: "#3B82F6" },
            { id: 102, title: "Innenausbau B2B", status: "prio", color: "#EF4444" },
            { id: 104, title: "Schreinerei Murrhardt", status: "prio", color: "#EF4444" },
          ].map(art => (
            <div key={art.id} style={{
              padding: "8px 16px", borderRadius: 8,
              background: art.color + "12", border: `1px solid ${art.color}25`,
              color: art.color, fontSize: 12, fontWeight: 700,
            }}>
              #{art.id} {art.title} — {art.status.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
