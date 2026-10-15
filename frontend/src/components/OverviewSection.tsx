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
      icon: <Target size={18} color="#38bdf8" />,
      accentColor: '#38bdf8',
    },
    {
      title: 'Proposed Method & Motivation',
      content: overview.motivation_and_method,
      icon: <Lightbulb size={18} color="#818cf8" />,
      accentColor: '#818cf8',
    },
    {
      title: 'Main Model Architecture',
      content: overview.main_architecture,
      icon: <Cpu size={18} color="#a855f7" />,
      accentColor: '#a855f7',
    },
    {
      title: 'Experimental Findings',
      content: overview.main_results,
      icon: <Award size={18} color="#34d399" />,
      accentColor: '#34d399',
    },
    {
      title: 'Limitations & Reproduction Ambiguities',
      content: overview.limitations_and_questions,
      icon: <AlertCircle size={18} color="#fb7185" />,
      accentColor: '#fb7185',
    },
  ];

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
          Executive Research Overview
        </h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          (Grounded in extracted paper text)
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '14px'
      }}>
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '16px',
              borderTop: `3px solid ${card.accentColor}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {card.icon}
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f1f5f9' }}>
                {card.title}
              </h3>
            </div>
            <p style={{
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
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
