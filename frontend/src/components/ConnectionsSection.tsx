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

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'research_objective':
        return '#38bdf8';
      case 'method':
        return '#818cf8';
      case 'model_architecture':
        return '#a855f7';
      case 'dataset':
      case 'preprocessing_step':
        return '#10b981';
      case 'optimizer':
      case 'learning_rate_schedule':
      case 'training_procedure':
        return '#f59e0b';
      case 'loss_function':
        return '#ec4899';
      case 'evaluation_metric':
        return '#06b6d4';
      case 'reproduction_gap':
        return '#fb7185';
      default:
        return '#94a3b8';
    }
  };

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
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
            Research Connection Graph
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Grounded topological network linking research objectives, architecture, training dynamics, and reproduction gaps.
          </p>
        </div>

        {/* View Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(15, 23, 42, 0.9)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setViewMode('visual')}
            style={{
              background: viewMode === 'visual' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              color: viewMode === 'visual' ? '#fff' : 'var(--text-secondary)',
              border: viewMode === 'visual' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Network size={14} />
            <span>Interactive Canvas</span>
          </button>
          <button
            onClick={() => setViewMode('navigator')}
            style={{
              background: viewMode === 'navigator' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              color: viewMode === 'navigator' ? '#fff' : 'var(--text-secondary)',
              border: viewMode === 'navigator' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ListTree size={14} />
            <span>Entity Navigator</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: '20px' }}>
        {/* Left Column: Visual Canvas OR Entity Grid */}
        {viewMode === 'visual' ? (
          <div className="glass-panel" style={{ padding: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Topological Vector Graph ({graph.nodes.length} Nodes • {graph.edges.length} Edges)
              </span>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
                ● Click any node or vector to highlight
              </span>
            </div>

            {/* SVG Visual Canvas */}
            <svg
              viewBox="0 0 760 480"
              style={{
                width: '100%',
                height: '460px',
                background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.4) 0%, rgba(9, 13, 22, 0.95) 100%)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" opacity="0.8" />
                </marker>
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                </marker>
              </defs>

              {/* Render Connecting Edges */}
              {graph.edges.map((e) => {
                const src = nodePositions[e.source];
                const dst = nodePositions[e.target];
                if (!src || !dst) return null;

                const isConnected = e.source === selectedNodeId || e.target === selectedNodeId;
                const midX = (src.x + dst.x) / 2;
                const midY = (src.y + dst.y) / 2 - 20;

                return (
                  <g key={e.id}>
                    <path
                      d={`M ${src.x} ${src.y} Q ${midX} ${midY} ${dst.x} ${dst.y}`}
                      fill="none"
                      stroke={isConnected ? '#38bdf8' : 'rgba(148, 163, 184, 0.25)'}
                      strokeWidth={isConnected ? 2.5 : 1.2}
                      strokeDasharray={e.provenance_type === 'inferred' ? '4 3' : 'none'}
                      markerEnd={isConnected ? 'url(#arrow-active)' : 'url(#arrow)'}
                      style={{ transition: 'all 0.2s ease' }}
                    />
                    {isConnected && (
                      <text
                        x={midX}
                        y={midY}
                        fill="#c7d2fe"
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                        style={{ pointerEvents: 'none', background: '#090d16' }}
                      >
                        {e.type}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Render Nodes */}
              {graph.nodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                const isSelected = node.id === selectedNodeId;
                const color = getNodeColor(node.type);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Glowing Aura if selected */}
                    {isSelected && (
                      <circle
                        r="32"
                        fill={color}
                        opacity="0.25"
                        style={{ filter: 'blur(8px)' }}
                      />
                    )}

                    <rect
                      x="-65"
                      y="-22"
                      width="130"
                      height="44"
                      rx="8"
                      fill={isSelected ? '#1e293b' : '#0f172a'}
                      stroke={isSelected ? color : 'rgba(255, 255, 255, 0.15)'}
                      strokeWidth={isSelected ? 2 : 1}
                    />

                    {/* Small Status indicator pip */}
                    <circle
                      cx="-52"
                      cy="0"
                      r="4"
                      fill={color}
                    />

                    <text
                      x="-42"
                      y="-4"
                      fill="#fff"
                      fontSize="9.5"
                      fontWeight="700"
                      fontFamily="var(--font-sans)"
                    >
                      {node.label.length > 15 ? `${node.label.substring(0, 15)}...` : node.label}
                    </text>

                    <text
                      x="-42"
                      y="11"
                      fill={color}
                      fontSize="8"
                      fontFamily="var(--font-mono)"
                      style={{ textTransform: 'uppercase' }}
                    >
                      {node.type.length > 16 ? `${node.type.substring(0, 16)}..` : node.type.replace('_', ' ')}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          /* Entity Navigator Grid */
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Extracted Nodes ({graph.nodes.length})
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Click any node to trace relationships
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '10px',
              maxHeight: '440px',
              overflowY: 'auto'
            }}>
              {graph.nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                const color = getNodeColor(node.type);

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{
                      background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                      border: isSelected ? `2px solid ${color}` : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: color,
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {node.type.replace('_', ' ')}
                      </span>
                      <span className={`status-badge status-${node.status}`} style={{ fontSize: '0.6rem', padding: '1px 4px' }}>
                        {node.status}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff', marginBottom: '4px' }}>
                      {node.label}
                    </div>
                    {node.value && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {node.value}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Column: Node Provenance & Connected Edges */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {selectedNode ? (
            <>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: getNodeColor(selectedNode.type),
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {selectedNode.type.replace('_', ' ')}
                  </span>
                  <span className={`status-badge status-${selectedNode.status}`}>
                    {selectedNode.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  {selectedNode.label}
                </h3>
                {selectedNode.value && (
                  <p style={{ fontSize: '0.82rem', color: '#38bdf8', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    {selectedNode.value}
                  </p>
                )}
                <div style={{ marginTop: '12px' }}>
                  <button
                    onClick={() => onLearnConcept(selectedNode.id)}
                    className="btn-primary"
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  >
                    <BookOpen size={13} />
                    <span>Explain in Learn Tab</span>
                  </button>
                </div>
              </div>

              {/* Outgoing Edges */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Outgoing Relationships ({outgoingEdges.length})
                </h4>
                {outgoingEdges.length === 0 ? (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No outgoing relationships.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {outgoingEdges.map((e) => {
                      const targetNode = graph.nodes.find((n) => n.id === e.target);
                      return (
                        <div
                          key={e.id}
                          onClick={() => targetNode && setSelectedNodeId(targetNode.id)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            fontSize: '0.78rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                          }}
                        >
                          <div>
                            <span style={{ color: '#818cf8', fontWeight: 600, marginRight: '6px' }}>
                              --[{e.type}]--&gt;
                            </span>
                            <span style={{ color: '#fff', fontWeight: 700 }}>
                              {targetNode?.label || e.target}
                            </span>
                            {e.label && (
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {e.label}
                              </div>
                            )}
                          </div>
                          <span style={{
                            fontSize: '0.62rem',
                            background: e.provenance_type === 'explicit' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: e.provenance_type === 'explicit' ? '#34d399' : '#fbbf24',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 600
                          }}>
                            {e.provenance_type.toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Incoming Edges */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Incoming Relationships ({incomingEdges.length})
                </h4>
                {incomingEdges.length === 0 ? (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No incoming relationships.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {incomingEdges.map((e) => {
                      const sourceNode = graph.nodes.find((n) => n.id === e.source);
                      return (
                        <div
                          key={e.id}
                          onClick={() => sourceNode && setSelectedNodeId(sourceNode.id)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            fontSize: '0.78rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                          }}
                        >
                          <div>
                            <span style={{ color: '#38bdf8', fontWeight: 700, marginRight: '6px' }}>
                              {sourceNode?.label || e.source}
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>
                              --[{e.type}]--&gt;
                            </span>
                          </div>
                          <span style={{
                            fontSize: '0.62rem',
                            background: e.provenance_type === 'explicit' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: e.provenance_type === 'explicit' ? '#34d399' : '#fbbf24',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 600
                          }}>
                            {e.provenance_type.toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
              Select a node to inspect its incoming and outgoing relationships.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
