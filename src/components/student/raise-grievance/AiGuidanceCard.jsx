import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Lightbulb } from 'lucide-react';

export default function AiGuidanceCard({
  aiResult,
  loading,
  onRunAnalysis,
  onApplySuggestions,
  hasDraftContent,
}) {
  return (
    <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-nivaran-divider">
        <div className="flex items-center gap-2 text-nivaran-forest font-bold text-sm">
          <div className="p-1.5 rounded-lg bg-nivaran-paleGreen text-nivaran-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>AI Pre-Submission Assistant</span>
        </div>
        <span className="text-[10px] font-semibold text-nivaran-primary uppercase tracking-wider bg-nivaran-softGreen px-2 py-0.5 rounded-full">
          Gemini 3.5 Flash
        </span>
      </div>

      {!aiResult && !loading && (
        <div className="py-4 text-center">
          <p className="text-xs text-nivaran-textSecondary mb-3 leading-relaxed">
            Type your grievance title and description, then click below to let NIVARAN AI analyze completeness and suggest the appropriate department.
          </p>
          <button
            type="button"
            disabled={!hasDraftContent || loading}
            onClick={onRunAnalysis}
            className="w-full py-2.5 px-4 rounded-xl bg-nivaran-paleGreen border border-nivaran-softGreen hover:bg-nivaran-softGreen text-nivaran-forest text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-nivaran-primary" />
            <span>{hasDraftContent ? 'Analyze Draft Completeness' : 'Enter Title & Details to Analyze'}</span>
          </button>
        </div>
      )}

      {loading && (
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-nivaran-textSecondary">
          <div className="w-6 h-6 border-2 border-nivaran-primary/30 border-t-nivaran-primary rounded-full animate-spin"></div>
          <span>Gemini analyzing draft clarity and departmental rules...</span>
        </div>
      )}

      {aiResult && !loading && (
        <div className="space-y-4 animate-in fade-in text-xs">
          {/* Completeness Score */}
          <div className="p-3 rounded-xl bg-nivaran-paleGreen/70 border border-nivaran-softGreen">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-nivaran-forest text-[11px] uppercase tracking-wider">
                Completeness Score
              </span>
              <span className="font-bold text-nivaran-primary text-sm">
                {aiResult.completenessAudit?.completenessScore || 85}%
              </span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-nivaran-softGreen/60">
              <div
                className="bg-nivaran-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${aiResult.completenessAudit?.completenessScore || 85}%` }}
              ></div>
            </div>
          </div>

          {/* Classification & Department Suggestion */}
          {aiResult.classificationSuggestion && (
            <div className="p-3 bg-white rounded-xl border border-nivaran-border">
              <span className="text-[10px] font-semibold text-nivaran-textMuted uppercase tracking-wider block mb-1">
                Suggested Routing
              </span>
              <p className="font-bold text-nivaran-forest text-xs">
                {aiResult.classificationSuggestion.suggestedDepartment || 'General Department'}
              </p>
              <p className="text-[11px] text-nivaran-textSecondary mt-0.5">
                Category: <span className="font-semibold">{aiResult.classificationSuggestion.suggestedCategory}</span>
                {aiResult.classificationSuggestion.confidence && (
                  <span className="ml-1 text-nivaran-primary font-medium">
                    ({Math.round(aiResult.classificationSuggestion.confidence * 100)}% match)
                  </span>
                )}
              </p>
              {aiResult.classificationSuggestion.reasoning && (
                <p className="text-[10px] text-nivaran-textMuted mt-1 italic">
                  "{aiResult.classificationSuggestion.reasoning}"
                </p>
              )}
              {onApplySuggestions && (
                <button
                  type="button"
                  onClick={onApplySuggestions}
                  className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-nivaran-paleGreen text-nivaran-forest hover:bg-nivaran-softGreen font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Apply Category &amp; Department</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Missing Information / Questions to consider */}
          {aiResult.completenessAudit?.suggestedQuestions && aiResult.completenessAudit.suggestedQuestions.length > 0 && (
            <div className="p-3 rounded-xl bg-nivaran-warningBg/60 border border-nivaran-warning/20">
              <span className="text-[11px] font-semibold text-nivaran-warning flex items-center gap-1 mb-1">
                <HelpCircle className="w-3.5 h-3.5" />
                Recommended Information to Add:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-nivaran-text">
                {aiResult.completenessAudit.suggestedQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary Preview */}
          {aiResult.draftPreview?.summary && (
            <div className="p-3 bg-nivaran-ivory rounded-xl border border-nivaran-border">
              <span className="text-[10px] font-semibold text-nivaran-textMuted uppercase tracking-wider block mb-1">
                Summary Preview (Officer View)
              </span>
              <p className="text-[11px] text-nivaran-text leading-relaxed">
                {aiResult.draftPreview.summary}
              </p>
            </div>
          )}

          {/* Re-analyze Action */}
          <button
            type="button"
            onClick={onRunAnalysis}
            className="w-full py-2 text-center text-xs font-semibold text-nivaran-primary hover:text-nivaran-forest underline transition-colors cursor-pointer"
          >
            Re-analyze Draft
          </button>
        </div>
      )}
    </div>
  );
}
