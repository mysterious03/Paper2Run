import React, { useState } from 'react';
import { ResearchGraph, GraphNode, GraphEdge } from '../types';
import { Network, Link2, HelpCircle, ArrowRight, BookOpen, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface ConnectionsSectionProps {
  graph: ResearchGraph;
  onLearnConcept: (conceptId: string) => void;
}

export const ConnectionsSection: React.FC<ConnectionsSectionProps> = ({ graph, onLearnConcept }) => {
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
        return '#10b981';
      case 'optimizer':
      case 'learning_rate_schedule':
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

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
          Research Connection Graph
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Typed relationships connecting research objectives, architectural components, training dynamics, and reproduction gaps.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Node Grid View */}
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: '10px'
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
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? `0 0 16px ${color}33` : 'none'
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

        {/* Selected Node Details & Connected Relationships */}
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
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  {selectedNode.label}
                </h3>
                {selectedNode.value && (
                  <p style={{ fontSize: '0.82rem', color: '#38bdf8', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    {selectedNode.value}
                  </p>
                )}
                <div style={{ marginTop: '10px' }}>
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

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Outgoing Connections ({outgoingEdges.length})
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

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Incoming Connections ({incomingEdges.length})
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
