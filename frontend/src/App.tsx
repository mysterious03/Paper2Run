import React, { useState, useEffect } from 'react';
import { AnalysisResult, BlueprintField } from './types';
import { checkHealth, fetchSamplePaper } from './lib/api';
import { Navbar } from './components/Navbar';
import { PaperHeader } from './components/PaperHeader';
import { OverviewSection } from './components/OverviewSection';
import { BlueprintSection } from './components/BlueprintSection';
import { LearningPanel } from './components/LearningPanel';
import { ConnectionsSection } from './components/ConnectionsSection';
import { GapsSection } from './components/GapsSection';
import { ExportSection } from './components/ExportSection';
import { EvidenceModal } from './components/EvidenceModal';
import { UploadModal } from './components/UploadModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpCircle, ChevronDown, ChevronUp, FileText, CheckCircle2, AlertOctagon, Sparkles, Download } from 'lucide-react';

export const App: React.FC = () => {
  const [currentPaper, setCurrentPaper] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'learn' | 'connections' | 'verify' | 'export'>('blueprint');
  const [selectedFieldForLearn, setSelectedFieldForLearn] = useState<BlueprintField | null>(null);
  const [evidenceModalField, setEvidenceModalField] = useState<BlueprintField | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [llmProvider, setLLMProvider] = useState<string>('Checking...');
  const [isLLMConfigured, setIsLLMConfigured] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(true);

  // On mount: check health and load precomputed sample demo
  useEffect(() => {
    checkHealth()
      .then((health) => {
        setLLMProvider(health.llm_provider || 'Demo Mode');
        setIsLLMConfigured(Boolean(health.llm_configured));
      })
      .catch(() => {
        setLLMProvider('Backend Disconnected');
        setIsLLMConfigured(false);
      });

    loadSampleDemo('transformer');
  }, []);

  const loadSampleDemo = (paperType: 'transformer' | 'lora' = 'transformer') => {
    setLoading(true);
    fetchSamplePaper(paperType)
      .then((data) => {
        setCurrentPaper(data);
        if (data.blueprint && data.blueprint.length > 0) {
          setSelectedFieldForLearn(data.blueprint[0]);
        }
      })
      .catch((err) => {
        console.error('Failed to load sample paper:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelectFieldForLearn = (field: BlueprintField) => {
    setSelectedFieldForLearn(field);
    setActiveTab('learn');
  };

  const handleLearnFromNode = (conceptId: string) => {
    if (!currentPaper || !currentPaper.blueprint) return;
    const matched = currentPaper.blueprint.find(
      (f) => f.id === conceptId || (f.relationships && f.relationships.includes(conceptId))
    );
    if (matched) {
      setSelectedFieldForLearn(matched);
    }
    setActiveTab('learn');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Skip to Main Content Link for WCAG Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top Navigation */}
      <Navbar
        currentPaper={currentPaper}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLoadSample={loadSampleDemo}
        llmProvider={llmProvider}
        isLLMConfigured={isLLMConfigured}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Workspace Body */}
      <main id="main-content" role="main" tabIndex={-1} style={{ flex: 1, display: 'flex', flexDirection: 'column', outline: 'none' }}>
        {loading ? (
          <div role="status" aria-live="polite" style={{ padding: '80px', textAlign: 'center', color: '#71717a' }}>
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(255, 255, 255, 0.15)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spinSlow 0.9s linear infinite', marginBottom: '14px' }} />
            <p style={{ color: '#71717a', fontSize: '0.85rem' }}>Loading research workspace...</p>
          </div>
        ) : currentPaper ? (
          <div>
            {/* Paper Header & Reproduction Scorecard */}
            <PaperHeader
              metadata={currentPaper.metadata}
              onSelectSample={loadSampleDemo}
              onOpenUpload={() => setIsUploadOpen(true)}
            />

            {/* Container */}
            <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px 28px', width: '100%' }}>
              {/* Numbered Quickstart Stepper / User-Friendly Guide */}
              <section aria-labelledby="guide-heading" style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '14px 18px',
                marginBottom: '20px',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="#ffffff" aria-hidden="true" />
                    <h2 id="guide-heading" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                      How to Use Paper2Run in 3 Simple Steps
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGuide(!showGuide)}
                    className="btn-ghost"
                    style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                    aria-expanded={showGuide}
                    aria-controls="guide-steps-container"
                  >
                    <span>{showGuide ? 'Hide Guide' : 'Show Guide'}</span>
                    {showGuide ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
                  </button>
                </div>

                {showGuide && (
                  <div id="guide-steps-container" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '12px',
                    marginTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '12px'
                  }}>
                    <div style={{ background: '#050505', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ background: '#ffffff', color: '#000000', fontSize: '0.7rem', fontWeight: 800, padding: '1px 6px', borderRadius: '3px' }}>
                          STEP 1
                        </span>
                        <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>Choose or Upload Paper</h3>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#a1a1aa', lineHeight: 1.45 }}>
                        Select benchmark paper (Transformer or LoRA) above, or click <strong>Upload PDF</strong> to analyze any research document in real time.
                      </p>
                    </div>

                    <div style={{ background: '#050505', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ background: '#ffffff', color: '#000000', fontSize: '0.7rem', fontWeight: 800, padding: '1px 6px', borderRadius: '3px' }}>
                          STEP 2
                        </span>
                        <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>Inspect Evidence & Proof</h3>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#a1a1aa', lineHeight: 1.45 }}>
                        Check extracted hyperparameters. Click <strong>Proof</strong> to view verbatim quotes on original pages, or <strong>Learn</strong> for 3-tier intuitive explanations.
                      </p>
                    </div>

                    <div style={{ background: '#050505', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ background: '#ffffff', color: '#000000', fontSize: '0.7rem', fontWeight: 800, padding: '1px 6px', borderRadius: '3px' }}>
                          STEP 3
                        </span>
                        <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>Audit Gaps & Export Recipe</h3>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#a1a1aa', lineHeight: 1.45 }}>
                        Review unstated settings under <strong>Gaps & Fixes</strong>, then export ready-to-run configurations and checklists under <strong>Export & Run</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* Tab 1: Blueprint */}
              {activeTab === 'blueprint' && (
                <div role="tabpanel" id="panel-blueprint" aria-labelledby="tab-blueprint">
                  <OverviewSection overview={currentPaper.overview} />
                  <BlueprintSection
                    fields={currentPaper.blueprint || []}
                    onSelectFieldForLearn={handleSelectFieldForLearn}
                    onSelectFieldForEvidence={(f) => setEvidenceModalField(f)}
                  />
                  <GapsSection gaps={currentPaper.gaps || []} />
                </div>
              )}

              {/* Tab 2: Learn (Paper2Run Learn) */}
              {activeTab === 'learn' && (
                <div role="tabpanel" id="panel-learn" aria-labelledby="tab-learn">
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '2px' }}>
                      Step 3: Paper2Run Guided Learning
                    </h2>
                    <p style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
                      3-tier deep dive explanations (Beginner Analogy • Technical Convergence • Mathematical Rigor) and Prerequisites Roadmap.
                    </p>
                  </div>
                  <LearningPanel
                    paperId={currentPaper.paper_id}
                    selectedField={selectedFieldForLearn}
                    onSelectField={(f) => setSelectedFieldForLearn(f)}
                    allFields={currentPaper.blueprint || []}
                  />
                </div>
              )}

              {/* Tab 3: Topology Connections */}
              {activeTab === 'connections' && (
                <div role="tabpanel" id="panel-connections" aria-labelledby="tab-connections">
                  <ConnectionsSection
                    graph={currentPaper.graph || { document_id: currentPaper.paper_id, nodes: [], edges: [] }}
                    onLearnConcept={handleLearnFromNode}
                  />
                </div>
              )}

              {/* Tab 4: Verify & Gaps */}
              {activeTab === 'verify' && (
                <div role="tabpanel" id="panel-verify" aria-labelledby="tab-verify">
                  <GapsSection gaps={currentPaper.gaps || []} />
                  <div style={{ marginTop: '24px' }}>
                    <BlueprintSection
                      fields={currentPaper.blueprint || []}
                      onSelectFieldForLearn={handleSelectFieldForLearn}
                      onSelectFieldForEvidence={(f) => setEvidenceModalField(f)}
                    />
                  </div>
                </div>
              )}

              {/* Tab 5: Export & Run Recipe */}
              {activeTab === 'export' && (
                <div role="tabpanel" id="panel-export" aria-labelledby="tab-export">
                  <ExportSection paper={currentPaper} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div role="region" aria-label="No Paper State" style={{ padding: '80px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              No Paper Loaded
            </h2>
            <p style={{ color: '#71717a', marginBottom: '18px', fontSize: '0.85rem' }}>
              Upload an AI/ML PDF or explore the pre-loaded benchmark experiment.
            </p>
            <button
              type="button"
              onClick={() => loadSampleDemo('transformer')}
              className="btn-primary"
            >
              Load Transformer Benchmark
            </button>
          </div>
        )}
      </main>

      {/* Evidence Viewer Modal */}
      <EvidenceModal
        field={evidenceModalField}
        onClose={() => setEvidenceModalField(null)}
      />

      {/* Upload Paper Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onOpenSettings={() => {
          setIsUploadOpen(false);
          setIsSettingsOpen(true);
        }}
        onUploadSuccess={(res) => {
          if (res && res.blueprint) {
            setCurrentPaper(res);
            if (res.blueprint.length > 0) {
              setSelectedFieldForLearn(res.blueprint[0]);
            }
            setActiveTab('blueprint');
          }
        }}
      />

      {/* API Key Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigChanged={() => {
          checkHealth()
            .then((health) => {
              setLLMProvider(health.llm_provider || 'Configured');
              setIsLLMConfigured(Boolean(health.llm_configured));
            })
            .catch(() => {});
        }}
      />
    </div>
  );
};

export default App;
