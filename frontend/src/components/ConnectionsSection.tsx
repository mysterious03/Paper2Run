import React, { useState, useMemo } from 'react';
import { ResearchGraph, GraphNode, GraphEdge } from '../types';
import { Network, ListTree, ArrowRight, BookOpen, AlertOctagon, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ConnectionsSectionProps {
  graph: ResearchGraph;
  onLearnConcept: (conceptId: string) => void;
}

export const ConnectionsSection: React.FC<ConnectionsSectionProps> = ({ graph, onLearnConcept }) => {
  const [viewMode, setViewMode] = useState<'visual' | 'navigator'>('visual');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    graph.nodes.length > 0 ? graph.nodes[0].id : null
  );

  const selectedNode = graph.nodes.find((n) => n.id === selectedNodeId);

  // Incoming and Outgoing edges for selected node
  const outgoingEdges = graph.edges.filter((e) => e.source === selectedNodeId);
  const incomingEdges = graph.edges.filter((e) => e.target === selectedNodeId);

  // Compute visual 2D positions for SVG Topology Canvas
  const nodePositions = useMemo(() => {
    const total = graph.nodes.length;
    const positions: Record<string, { x: number; y: number }> = {};
    const width = 760;
    const height = 480;

    // Arrange in a balanced circular/force layout
    graph.nodes.forEach((node, index) => {
      if (node.type === 'research_objective') {
        positions[node.id] = { x: width * 0.18, y: height * 0.2 };
      } else if (node.type === 'method') {
        positions[node.id] = { x: width * 0.38, y: height * 0.2 };
      } else if (node.type === 'model_architecture') {
        positions[node.id] = { x: width * 0.58, y: height * 0.26 };
      } else if (node.type === 'dataset' || node.type === 'preprocessing_step') {
        positions[node.id] = { x: width * 0.18, y: height * 0.65 + (index % 2) * 50 };
      } else if (node.type === 'optimizer' || node.type === 'learning_rate_schedule') {
        positions[node.id] = { x: width * 0.44, y: height * 0.65 + (index % 2) * 45 };
      } else if (node.type === 'loss_function' || node.type === 'training_procedure') {
        positions[node.id] = { x: width * 0.65, y: height * 0.65 };
      } else if (node.type === 'evaluation_metric') {
        positions[node.id] = { x: width * 0.85, y: height * 0.32 };
      } else if (node.type === 'reproduction_gap') {
        positions[node.id] = { x: width * 0.82, y: height * 0.72 + (index % 2) * 45 };
      } else {
        const angle = (index / total) * 2 * Math.PI;
        positions[node.id] = {
          x: width / 2 + Math.cos(angle) * 240,
          y: height / 2 + Math.sin(angle) * 160,
        };
      }
    });

    return positions;
  }, [graph.nodes]);

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Section Header & View Mode Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Research Topology Graph
          </h2>
          <p style={{ fontSize: '0.76rem', color: '#71717a' }}>
            Topological network linking objectives, architecture, training dynamics, and reproduction gaps.
          </p>
        </div>

        {/* View Switcher */}
        <div style={{
          display: 'flex',
          background: '#0d0d0d',
          padding: '3px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            onClick={() => setViewMode('visual')}
            style={{
              background: viewMode === 'visual' ? '#ffffff' : 'transparent',
              color: viewMode === 'visual' ? '#000000' : '#a1a1aa',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 12px',
              fontSize: '0.76rem',
              fontWeight: viewMode === 'visual' ? 600 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Network size={13} />
            <span>Topology Canvas</span>
          </button>
          <button
            onClick={() => setViewMode('navigator')}
            style={{
              background: viewMode === 'navigator' ? '#ffffff' : 'transparent',
              color: viewMode === 'navigator' ? '#000000' : '#a1a1aa',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 12px',
              fontSize: '0.76rem',
              fontWeight: viewMode === 'navigator' ? 600 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <ListTree size={13} />
            <span>Entity Navigator</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) 1.2fr', gap: '16px' }}>
        {/* Left Side: Interactive Canvas or List */}
        {viewMode === 'visual' ? (
          <div className="glass-panel" style={{
            position: 'relative',
            height: '520px',
            overflow: 'hidden',
            background: '#050505',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg
              viewBox="0 0 760 480"
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <marker
                  id="arrow-white"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#ffffff" />
                </marker>
                <marker
                  id="arrow-dim"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="rgba(255, 255, 255, 0.25)" />
                </marker>
                <filter id="white-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Render Connecting Bezier Edges */}
              {graph.edges.map((edge) => {
                const srcPos = nodePositions[edge.source];
                const tgtPos = nodePositions[edge.target];
                if (!srcPos || !tgtPos) return null;

                const isConnectedToSelected =
                  edge.source === selectedNodeId || edge.target === selectedNodeId;

                // Curved cubic Bezier vector
                const dx = tgtPos.x - srcPos.x;
                const dy = tgtPos.y - srcPos.y;
                const cx1 = srcPos.x + dx * 0.4;
                const cy1 = srcPos.y - 20;
                const cx2 = srcPos.x + dx * 0.6;
                const cy2 = tgtPos.y + 20;
                const pathD = `M ${srcPos.x} ${srcPos.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tgtPos.x} ${tgtPos.y}`;

                return (
                  <g key={edge.id}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isConnectedToSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.12)'}
                      strokeWidth={isConnectedToSelected ? 2.2 : 1.2}
                      strokeDasharray={edge.provenance_type === 'inferred' ? '4 3' : 'none'}
                      markerEnd={isConnectedToSelected ? 'url(#arrow-white)' : 'url(#arrow-dim)'}
                      filter={isConnectedToSelected ? 'url(#white-glow)' : 'none'}
                      style={{ transition: 'all 0.25s ease' }}
                    />
                  </g>
                );
              })}

              {/* Render Interactive Nodes */}
              {graph.nodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                const isSelected = node.id === selectedNodeId;
                const isGap = node.type === 'reproduction_gap';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Outer Glow Halo on selected */}
                    {isSelected && (
                      <circle
                        r={26}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                        style={{ animation: 'spinSlow 10s linear infinite' }}
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      r={18}
                      fill={isSelected ? '#ffffff' : '#0d0d0d'}
                      stroke={isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.25)'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      filter={isSelected ? 'url(#white-glow)' : 'none'}
                      style={{ transition: 'all 0.2s ease' }}
                    />

                    {/* Node Core Indicator */}
                    <circle
                      r={6}
                      fill={isSelected ? '#000000' : '#ffffff'}
                    />

                    {/* Node Label Below */}
                    <text
                      y={32}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#a1a1aa'}
                      fontSize={11}
                      fontWeight={isSelected ? 700 : 500}
                      fontFamily="var(--font-sans)"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {node.label.length > 20 ? node.label.substring(0, 18) + '...' : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Canvas Hint */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '16px',
              fontSize: '0.7rem',
              color: '#71717a',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
              <span>Click any node to focus topology flow</span>
            </div>
          </div>
        ) : (
          /* Entity Navigator List */
          <div className="glass-panel" style={{ padding: '16px', maxHeight: '520px', overflowY: 'auto', background: '#0a0a0a' }}>
            <div style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, marginBottom: '10px' }}>
              All Extracted Entities ({graph.nodes.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {graph.nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '6px',
                      background: isSelected ? 'rgba(255, 255, 255, 0.08)' : '#0d0d0d',
                      border: isSelected ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.background = '#141414';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.background = '#0d0d0d';
                      }
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>
                        {node.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>
                        {node.type.replace('_', ' ')}
                      </div>
                    </div>
                    <ArrowRight size={14} color={isSelected ? '#ffffff' : '#71717a'} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Side: Selected Node Focus Inspector */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#0a0a0a' }}>
          {selectedNode ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '0.68rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase'
                }}>
                  {selectedNode.type.replace('_', ' ')}
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  color: '#71717a',
                  border: '1px solid #27272a',
                  padding: '1px 6px',
                  borderRadius: '3px'
                }}>
                  NODE ID: {selectedNode.id}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '10px' }}>
                {selectedNode.label}
              </h3>

              <p style={{ fontSize: '0.82rem', color: '#a1a1aa', lineHeight: 1.55, marginBottom: '18px' }}>
                {selectedNode.value ? `Value: ${selectedNode.value}` : `Extracted entity node for ${selectedNode.label}`}
              </p>

              {/* Direct Action: Jump to Learn */}
              <button
                onClick={() => onLearnConcept(selectedNode.id)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginBottom: '20px' }}
              >
                <BookOpen size={14} />
                <span>Deep Dive in Paper2Run Learn</span>
              </button>

              {/* Connected Relationships (Outbound & Inbound) */}
              <div>
                <div style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '8px' }}>
                  Connected Vectors ({outgoingEdges.length + incomingEdges.length})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {outgoingEdges.map((e) => {
                    const targetNode = graph.nodes.find((n) => n.id === e.target);
                    return (
                      <div
                        key={e.id}
                        onClick={() => setSelectedNodeId(e.target)}
                        style={{
                          padding: '8px 12px',
                          background: '#0d0d0d',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                          e.currentTarget.style.background = '#141414';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.background = '#0d0d0d';
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#ffffff', fontWeight: 600 }}>
                            → {(e.label || e.type).replace('_', ' ').toUpperCase()}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
                            {targetNode?.label || e.target}
                          </div>
                        </div>
                        <span style={{
                          fontSize: '0.62rem',
                          background: '#18181b',
                          color: '#71717a',
                          padding: '1px 5px',
                          borderRadius: '3px'
                        }}>
                          {e.provenance_type}
                        </span>
                      </div>
                    );
                  })}

                  {incomingEdges.map((e) => {
                    const srcNode = graph.nodes.find((n) => n.id === e.source);
                    return (
                      <div
                        key={e.id}
                        onClick={() => setSelectedNodeId(e.source)}
                        style={{
                          padding: '8px 12px',
                          background: '#0d0d0d',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                          e.currentTarget.style.background = '#141414';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.background = '#0d0d0d';
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#a1a1aa', fontWeight: 600 }}>
                            ← {(e.label || e.type).replace('_', ' ').toUpperCase()} (FROM)
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#ffffff' }}>
                            {srcNode?.label || e.source}
                          </div>
                        </div>
                        <span style={{
                          fontSize: '0.62rem',
                          background: '#18181b',
                          color: '#71717a',
                          padding: '1px 5px',
                          borderRadius: '3px'
                        }}>
                          {e.provenance_type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#71717a' }}>
              Select a node to inspect relationships.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
