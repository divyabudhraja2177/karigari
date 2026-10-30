import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Survey, SurveyQuestion } from '../../types';
import { ClipboardCheck, CheckCircle2, Star, ThumbsUp, ThumbsDown, ArrowRight, Check, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ArtisanSurveys: React.FC = () => {
  const { currentUser, surveys, surveyResponses, submitSurveyAnswers, t, language } = useApp();

  const artisanId = currentUser.artisanId || 'art-1';
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleStartSurvey = (survey: Survey) => {
    setActiveSurvey(survey);
    setAnswers({});
  };

  const handleAnswerChange = (questionId: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSurvey) return;

    const success = submitSurveyAnswers(activeSurvey.id, answers);
    if (success) {
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D8A7AD', '#A8B5A0', '#E9D99A', '#59473F']
        });
      } catch (e) { /* ignore */ }
      setActiveSurvey(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '24px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--deep-brown)' }}>
          {t.surveysTitle}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--muted-grey)', marginTop: '2px' }}>
          {t.surveysSubtitle}
        </p>
      </div>

      {/* Surveys List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {surveys.map((survey) => {
          const response = surveyResponses.find(
            (r) => r.surveyId === survey.id && r.artisanId === artisanId
          );
          const isCompleted = !!response;

          return (
            <div
              key={survey.id}
              className="artisan-card border-stitched-subtle"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backgroundColor: isCompleted ? 'var(--white)' : '#FFFCFA'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <div>
                  <span className="tag-textile" style={{ fontSize: '10px', marginBottom: '6px' }}>
                    {survey.type === 'followup'
                      ? (language === 'hi' ? '6-मासिक प्रभाव अध्ययन' : '6-Month Impact Assessment')
                      : (language === 'hi' ? 'मासिक समीक्षा' : 'Monthly Check-in')}
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                    {language === 'hi' ? survey.hindiTitle : survey.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--muted-grey)', marginTop: '4px' }}>
                    {language === 'hi' ? survey.hindiDescription : survey.description}
                  </p>
                </div>

                <span
                  className={`badge-status ${isCompleted ? 'badge-completed' : 'badge-in-progress'}`}
                  style={{ fontSize: '11px', flexShrink: 0 }}
                >
                  {isCompleted ? (language === 'hi' ? 'पूर्ण हुआ' : 'Completed') : (language === 'hi' ? 'भरने हेतु उपलब्ध' : 'Available')}
                </span>
              </div>

              {/* Status details & Start Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--light-border)' }}>
                {isCompleted ? (
                  <div style={{ fontSize: '12px', color: 'var(--sage-green-dark)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <CheckCircle2 size={16} />
                    <span>
                      {t.surveyAlreadyCompleted}{' '}
                      {new Date(response.submittedAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US')}
                    </span>
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: 'var(--muted-grey)' }}>
                    {survey.questions.length} {language === 'hi' ? 'सरल प्रश्न' : 'easy questions'}
                  </div>
                )}

                {!isCompleted && (
                  <button
                    onClick={() => handleStartSurvey(survey)}
                    className="btn-primary"
                    style={{ padding: '10px 16px', fontSize: '13px' }}
                  >
                    <span>{t.startSurveyBtn}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Survey Modal */}
      {activeSurvey && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(42, 37, 35, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 100
          }}
          onClick={() => setActiveSurvey(null)}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: 'var(--white)',
              borderTopLeftRadius: 'var(--radius-xl)',
              borderTopRightRadius: 'var(--radius-xl)',
              padding: '24px 20px 36px',
              maxWidth: '430px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <span className="tag-textile" style={{ fontSize: '10px' }}>
                  {language === 'hi' ? 'गोपनीय व सुरक्षित' : 'Confidential Impact Survey'}
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--deep-brown)', marginTop: '4px' }}>
                  {language === 'hi' ? activeSurvey.hindiTitle : activeSurvey.title}
                </h3>
              </div>
              <button onClick={() => setActiveSurvey(null)} style={{ color: 'var(--muted-grey)', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {activeSurvey.questions.map((q, idx) => (
                <div
                  key={q.id}
                  style={{
                    backgroundColor: 'var(--warm-cream)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dusty-pink-dark)', textTransform: 'uppercase' }}>
                    {t.questionProgress} {idx + 1} {t.of} {activeSurvey.questions.length}
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--deep-brown)', lineHeight: 1.4 }}>
                    {language === 'hi' ? q.hindiText : q.text}
                  </div>

                  {(q.helpText || q.hindiHelpText) && (
                    <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                      {language === 'hi' ? q.hindiHelpText : q.helpText}
                    </div>
                  )}

                  {/* Render based on Question Type */}
                  {/* Type 1: Star Rating */}
                  {q.type === 'stars' && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isFilled = (answers[q.id] || 0) >= starVal;
                        return (
                          <button
                            type="button"
                            key={starVal}
                            onClick={() => handleAnswerChange(q.id, starVal)}
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: isFilled ? 'var(--soft-yellow)' : 'var(--white)',
                              border: isFilled ? '1.5px solid var(--soft-yellow-dark)' : '1px solid var(--light-border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <Star
                              size={22}
                              color={isFilled ? 'var(--deep-brown)' : 'var(--muted-grey)'}
                              fill={isFilled ? '#E9D99A' : 'none'}
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Type 2: Yes/No Choice */}
                  {q.type === 'yes_no' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => handleAnswerChange(q.id, 'yes')}
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: answers[q.id] === 'yes' ? '2px solid var(--sage-green)' : '1px solid var(--light-border)',
                          backgroundColor: answers[q.id] === 'yes' ? 'var(--sage-green-light)' : 'var(--white)',
                          fontWeight: 700,
                          color: 'var(--deep-brown)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <ThumbsUp size={16} color="var(--sage-green-dark)" />
                        <span>{language === 'hi' ? 'हाँ' : 'Yes'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAnswerChange(q.id, 'no')}
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: answers[q.id] === 'no' ? '2px solid var(--dusty-pink)' : '1px solid var(--light-border)',
                          backgroundColor: answers[q.id] === 'no' ? 'var(--dusty-pink-light)' : 'var(--white)',
                          fontWeight: 700,
                          color: 'var(--deep-brown)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <ThumbsDown size={16} color="var(--dusty-pink-dark)" />
                        <span>{language === 'hi' ? 'नहीं' : 'No'}</span>
                      </button>
                    </div>
                  )}

                  {/* Type 3: Single Choice Options */}
                  {q.type === 'single_choice' && q.options && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                      {q.options.map((opt) => {
                        const isSelected = answers[q.id] === opt.value;
                        return (
                          <button
                            type="button"
                            key={opt.value}
                            onClick={() => handleAnswerChange(q.id, opt.value)}
                            style={{
                              padding: '12px 14px',
                              borderRadius: 'var(--radius-md)',
                              border: isSelected ? '2px solid var(--dusty-pink)' : '1px solid var(--light-border)',
                              backgroundColor: isSelected ? 'var(--dusty-pink-light)' : 'var(--white)',
                              textAlign: 'left',
                              fontSize: '13px',
                              fontWeight: isSelected ? 700 : 500,
                              color: 'var(--deep-brown)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span>{language === 'hi' ? opt.hindiLabel : opt.label}</span>
                            {isSelected && <Check size={16} color="var(--dusty-pink-dark)" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveSurvey(null)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 2, padding: '12px' }}
                >
                  <span>{t.submitSurveyBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
