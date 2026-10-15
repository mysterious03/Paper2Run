import React from 'react';
import { PaperOverview } from '../types';
import { Target, Lightbulb, Cpu, Award, AlertCircle } from 'lucide-react';

interface OverviewSectionProps {
  overview?: PaperOverview;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ overview }) => {
  const safeOverview = overview || {
    research_problem: 'Not explicitly identified in examined text.',
    motivation_and_method: 'Not explicitly identified in examined text.',
    main_architecture: 'Not explicitly identified in examined text.',
    main_results: 'Not explicitly identified in examined text.',
    limitations_and_questions: 'No explicit limitations reported.'
  };

  const cards = [
    {
      step: '1',
      title: 'Problem & Objective',
      content: safeOverview.research_problem,
      icon: <Target size={16} color="#ffffff" aria-hidden="true" />,
    },
    {
      step: '2',
      title: 'Proposed Method & Motivation',
      content: safeOverview.motivation_and_method,
      icon: <Lightbulb size={16} color="#ffffff" aria-hidden="true" />,
    },
    {
      step: '3',
      title: 'Main Model Architecture',
      content: safeOverview.main_architecture,
      icon: <Cpu size={16} color="#ffffff" aria-hidden="true" />,
    },
    {
      step: '4',
      title: 'Experimental Findings',
      content: safeOverview.main_results,
      icon: <Award size={16} color="#ffffff" aria-hidden="true" />,
    },
    {
      step: '5',
      title: 'Limitations & Uncertainties',
      content: safeOverview.limitations_and_questions,
      icon: <AlertCircle size={16} color="#ffffff" aria-hidden="true" />,
    },
  ];

  return (
    <section aria-labelledby="overview-heading" style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <h2 id="overview-heading" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
          Executive Research Overview
        </h2>
        <span style={{ fontSize: '0.72rem', color: '#71717a' }}>
          (5-point evidence synthesis grounded in paper text)
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '12px'
      }}>
        {cards.map((card) => (
          <article
            key={card.step}
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
                <span style={{ color: '#71717a', marginRight: '4px' }}>{card.step}.</span>
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
          </article>
        ))}
      </div>
    </section>
  );
};
