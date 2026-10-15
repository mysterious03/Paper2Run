import React from 'react';
import { PaperOverview } from '../types';
import { Target, Lightbulb, Cpu, Award, AlertCircle } from 'lucide-react';

interface OverviewSectionProps {
  overview: PaperOverview;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ overview }) => {
  const cards = [
    {
      title: 'Problem & Objective',
      content: overview.research_problem,
      icon: <Target size={16} color="#ffffff" />,
    },
    {
      title: 'Proposed Method & Motivation',
      content: overview.motivation_and_method,
      icon: <Lightbulb size={16} color="#ffffff" />,
    },
    {
      title: 'Main Model Architecture',
      content: overview.main_architecture,
      icon: <Cpu size={16} color="#ffffff" />,
    },
    {
      title: 'Experimental Findings',
      content: overview.main_results,
      icon: <Award size={16} color="#ffffff" />,
    },
    {
      title: 'Limitations & Uncertainties',
      content: overview.limitations_and_questions,
      icon: <AlertCircle size={16} color="#ffffff" />,
    },
  ];

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
          Executive Research Overview
        </h2>
        <span style={{ fontSize: '0.72rem', color: '#71717a' }}>
          (Grounded in extracted paper evidence)
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '12px'
      }}>
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '16px',
              borderTop: '2px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: '#0d0d0d'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                background: '#18181b',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                {card.title}
              </h3>
            </div>
            <p style={{
              fontSize: '0.8rem',
              color: '#a1a1aa',
              lineHeight: 1.55,
              flexGrow: 1
            }}>
              {card.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
