import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const Conditions: React.FC = () => {
  const { user, addCondition, removeCondition, addAllergy, removeAllergy } = useAuth();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'condition' | 'allergy'>('condition');
  const [name, setName] = useState('');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');
  const [notes, setNotes] = useState('');

  if (!user) return null;

  const handleAddNew = (type: 'condition' | 'allergy') => {
    setModalType(type);
    setName('');
    setSeverity('Mild');
    setNotes('');
    setShowAddModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem = {
      name: name.trim(),
      severity,
      notes: notes.trim()
    };

    if (modalType === 'condition') {
      addCondition(newItem);
    } else {
      addAllergy(newItem);
    }
    setShowAddModal(false);
  };

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'Severe':
        return 'bg-error/10 text-error border-error/20';
      case 'Moderate':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'Mild':
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-label-caps text-xs text-on-surface-variant/70 tracking-widest block mb-1">Clinical Records</span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface font-bold">Conditions &amp; Allergies</h1>
          <p className="font-body-lg text-on-surface-variant mt-1">Manage your active clinical history.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => handleAddNew('condition')}
            icon="add_circle"
            iconPosition="left"
            className="flex-1 sm:flex-initial"
          >
            Add Condition
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleAddNew('allergy')}
            icon="add_circle"
            iconPosition="left"
            className="flex-1 sm:flex-initial"
          >
            Add Allergy
          </Button>
        </div>
      </div>

      {/* Active Conditions */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="material-symbols-outlined text-primary filled-icon">monitor_heart</span>
          <h2 className="font-title-md text-on-surface font-semibold">Active Conditions</h2>
          <div className="h-[1px] flex-grow bg-outline-variant/30 ml-2" />
        </div>

        {user.patientRecord.conditions.length === 0 ? (
          <GlassCard className="text-center py-8">
            <span className="material-symbols-outlined text-outline-variant text-4xl mb-2">ecg_heart</span>
            <p className="text-on-surface-variant font-medium">No active medical conditions documented.</p>
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-4">
            {user.patientRecord.conditions.map((condition, idx) => (
              <GlassCard
                key={idx}
                className="flex items-center justify-between p-4 hover:translate-y-[-2px] hover:bg-white/90"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">ecg_heart</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-title-md text-sm text-on-surface font-semibold">{condition.name}</h3>
                      <span className={`font-bold text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-wide ${getSeverityStyle(condition.severity)}`}>
                        {condition.severity}
                      </span>
                    </div>
                    {condition.notes ? (
                      <p className="text-xs text-on-surface-variant mt-1">{condition.notes}</p>
                    ) : (
                      <p className="text-xs text-on-surface-variant mt-0.5">Self-Reported • Clinical Record</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeCondition(condition.name)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-outline hover:text-error hover:bg-error/5 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      {/* Documented Allergies */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="material-symbols-outlined text-amber-500 filled-icon">coronavirus</span>
          <h2 className="font-title-md text-on-surface font-semibold">Documented Allergies</h2>
          <div className="h-[1px] flex-grow bg-outline-variant/30 ml-2" />
        </div>

        {user.patientRecord.allergies.length === 0 ? (
          <GlassCard className="text-center py-8">
            <span className="material-symbols-outlined text-outline-variant text-4xl mb-2">vaccines</span>
            <p className="text-on-surface-variant font-medium">No allergies documented.</p>
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-4">
            {user.patientRecord.allergies.map((allergy, idx) => (
              <GlassCard
                key={idx}
                className="flex items-center justify-between p-4 hover:translate-y-[-2px] hover:bg-white/90"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-error/10 border border-error/20 flex items-center justify-center text-error">
                    <span className="material-symbols-outlined">vaccines</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-title-md text-sm text-on-surface font-semibold">{allergy.name}</h3>
                      <span className={`font-bold text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-wide flex items-center gap-0.5 ${getSeverityStyle(allergy.severity)}`}>
                        <span className="material-symbols-outlined text-[10px]">warning</span> {allergy.severity}
                      </span>
                    </div>
                    {allergy.notes ? (
                      <p className="text-xs text-on-surface-variant mt-1">{allergy.notes}</p>
                    ) : (
                      <p className="text-xs text-on-surface-variant mt-0.5">Reaction: Anaphylaxis risk</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeAllergy(allergy.name)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-outline hover:text-error hover:bg-error/5 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <GlassCard className="w-full max-w-sm border border-white/80 shadow-2xl">
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <h3 className="font-title-md text-on-surface font-semibold">
                Add New {modalType === 'condition' ? 'Condition' : 'Allergy'}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="font-label-caps text-[10px] text-on-surface-variant pl-1">Name</label>
                  <Input
                    type="text"
                    placeholder={`Enter name...`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="font-label-caps text-[10px] text-on-surface-variant pl-1">Severity</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Mild', 'Moderate', 'Severe'] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`py-2 px-3 text-xs rounded-xl font-semibold border transition-all cursor-pointer ${
                          severity === sev
                            ? sev === 'Severe'
                              ? 'bg-error text-white border-error shadow-sm'
                              : sev === 'Moderate'
                              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                              : 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-white/40 border-outline-variant/30 text-on-surface hover:bg-white/60'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-label-caps text-[10px] text-on-surface-variant pl-1">Notes / Description</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Risk of anaphylaxis, managed with Metformin, etc."
                    className="w-full rounded-[16px] py-3 px-4 font-body-lg text-sm bg-surface-container-high border border-transparent focus:bg-white/90 focus:border-primary/50 focus:ring-0 outline-none transition-all shadow-inner text-on-surface resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                >
                  Add Item
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Continue Button */}
      <div className="pt-4 flex justify-between">
        <Button
          variant="secondary"
          onClick={() => navigate('/profile/setup')}
        >
          Back to Setup
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate('/profile/medications')}
          icon="arrow_forward"
        >
          Continue to Medications
        </Button>
      </div>
    </div>
  );
};
