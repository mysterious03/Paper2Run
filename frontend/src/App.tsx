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
import { EvidenceModal } from './components/EvidenceModal';
import { UploadModal } from './components/UploadModal';

export const App: React.FC = () => {
  const [currentPaper, setCurrentPaper] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'learn' | 'connections' | 'verify'>('blueprint');
  const [selectedFieldForLearn, setSelectedFieldForLearn] = useState<BlueprintField | null>(null);
  const [evidenceModalField, setEvidenceModalField] = useState<BlueprintField | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [llmProvider, setLLMProvider] = useState<string>('Checking...');
  const [isLLMConfigured, setIsLLMConfigured] = useState<boolean>(false);

  // On mount: check health and load precomputed sample demo
  useEffect(() => {
    checkHealth()
      .then((health) => {
        setLLMProvider(health.llm_provider);
        setIsLLMConfigured(health.llm_configured);
      })
      .catch(() => {
        setLLMProvider('Backend Disconnected');
        setIsLLMConfigured(false);
      });

    loadSampleDemo();
  }, []);

  const loadSampleDemo = () => {
    setLoading(true);
    fetchSamplePaper()
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
    if (!currentPaper) return;
    const matched = currentPaper.blueprint.find(
      (f) => f.id === conceptId || f.relationships.includes(conceptId)
    );
    if (matched) {
      setSelectedFieldForLearn(matched);
    }
    setActiveTab('learn');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        currentPaper={currentPaper}
        onOpenUpload={() => setIsUploadOpen(true)}
        onLoadSample={loadSampleDemo}
        llmProvider={llmProvider}
        isLLMConfigured={isLLMConfigured}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Workspace Body */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '14px' }} />
            <p>Loading research workspace...</p>
          </div>
        ) : currentPaper ? (
          <div>
            {/* Paper Header & Honest Boundary Banner */}
            <PaperHeader metadata={currentPaper.metadata} />

            {/* Container */}
            <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 28px', width: '100%' }}>
              {/* Tab: Blueprint */}
              {activeTab === 'blueprint' && (
                <div>
                  <OverviewSection overview={currentPaper.overview} />
                  <BlueprintSection
                    fields={currentPaper.blueprint}
                    onSelectFieldForLearn={handleSelectFieldForLearn}
                    onSelectFieldForEvidence={(f) => setEvidenceModalField(f)}
                  />
                  <GapsSection gaps={currentPaper.gaps} />
                </div>
              )}

              {/* Tab: Learn (Paper2Run Learn) */}
              {activeTab === 'learn' && (
                <div>
                  <div style={{ marginBottom: '18px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                      Paper2Run Learn: Blueprint-Grounded Knowledge
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Multi-tier explanations tied directly to extracted experiment parameters and reproduction requirements.
                    </p>
                  </div>
                  <LearningPanel
                    paperId={currentPaper.paper_id}
                    selectedField={selectedFieldForLearn}
                    onSelectField={(f) => setSelectedFieldForLearn(f)}
                    allFields={currentPaper.blueprint}
                  />
                </div>
              )}

              {/* Tab: Connections */}
              {activeTab === 'connections' && (
                <ConnectionsSection
                  graph={currentPaper.graph}
                  onLearnConcept={handleLearnFromNode}
                />
              )}

              {/* Tab: Verify & Gaps */}
              {activeTab === 'verify' && (
                <div>
                  <GapsSection gaps={currentPaper.gaps} />
                  <div style={{ marginTop: '24px' }}>
                    <BlueprintSection
                      fields={currentPaper.blueprint}
                      onSelectFieldForLearn={handleSelectFieldForLearn}
                      onSelectFieldForEvidence={(f) => setEvidenceModalField(f)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '80px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              No Paper Loaded
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '18px' }}>
              Upload an AI/ML PDF or explore the pre-loaded sample experiment.
            </p>
            <button onClick={loadSampleDemo} className="btn-primary">
              Load Sample Demo
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
        onUploadSuccess={(res) => {
          setCurrentPaper(res);
          if (res.blueprint && res.blueprint.length > 0) {
            setSelectedFieldForLearn(res.blueprint[0]);
          }
          setActiveTab('blueprint');
        }}
      />
    </div>
  );
};

export default App;
