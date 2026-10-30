import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal
} from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { Survey } from '../types';
import { ClipboardCheck, CheckCircle2, Star, X } from 'lucide-react-native';

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

  const handleSubmit = () => {
    if (!activeSurvey) return;
    submitSurveyAnswers(activeSurvey.id, answers);
    setActiveSurvey(null);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.pageTitle}>{t.surveysTitle}</Text>
      <Text style={styles.pageSub}>{t.surveysSubtitle}</Text>

      {/* Surveys List */}
      <View style={{ gap: 12 }}>
        {surveys.map((survey) => {
          const response = surveyResponses.find(
            (r) => r.surveyId === survey.id && r.artisanId === artisanId
          );
          const isCompleted = !!response;

          return (
            <View key={survey.id} style={styles.surveyCard}>
              <View style={styles.surveyHeader}>
                <View style={styles.surveyTag}>
                  <Text style={styles.surveyTagText}>
                    {survey.type === 'followup'
                      ? (language === 'hi' ? '6-मासिक प्रभाव अध्ययन' : '6-Month Impact')
                      : (language === 'hi' ? 'मासिक समीक्षा' : 'Monthly Check-in')}
                  </Text>
                </View>
                <View style={[styles.statusBadge, isCompleted ? styles.statusBadgeDone : styles.statusBadgeAvail]}>
                  <Text style={[styles.statusBadgeText, isCompleted ? { color: theme.colors.sageGreenDark } : { color: theme.colors.dustyPinkDark }]}>
                    {isCompleted ? (language === 'hi' ? 'पूर्ण हुआ' : 'Done') : (language === 'hi' ? 'भरें' : 'Available')}
                  </Text>
                </View>
              </View>

              <Text style={styles.surveyTitle}>
                {language === 'hi' ? survey.hindiTitle : survey.title}
              </Text>
              <Text style={styles.surveyDesc} numberOfLines={2}>
                {language === 'hi' ? survey.hindiDescription : survey.description}
              </Text>

              <View style={styles.surveyFooter}>
                {isCompleted ? (
                  <View style={styles.completedRow}>
                    <CheckCircle2 size={16} color={theme.colors.sageGreenDark} />
                    <Text style={styles.completedRowText}>
                      {language === 'hi' ? 'समीक्षा जमा हो चुकी है' : 'Responses recorded'}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleStartSurvey(survey)}
                    style={styles.startBtn}
                  >
                    <Text style={styles.startBtnText}>{t.startSurveyBtn}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* SURVEY QUESTIONS MODAL */}
      {activeSurvey && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setActiveSurvey(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {language === 'hi' ? activeSurvey.hindiTitle : activeSurvey.title}
                </Text>
                <TouchableOpacity onPress={() => setActiveSurvey(null)}>
                  <X size={20} color={theme.colors.mutedGrey} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 380 }} contentContainerStyle={{ gap: 14 }}>
                {activeSurvey.questions.map((q, idx) => (
                  <View key={q.id} style={styles.qBox}>
                    <Text style={styles.qText}>
                      {idx + 1}. {language === 'hi' ? q.hindiText : q.text}
                    </Text>

                    {/* Star Rating */}
                    {q.type === 'stars' && (
                      <View style={styles.starRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <TouchableOpacity
                            key={star}
                            onPress={() => handleAnswerChange(q.id, star)}
                            style={styles.starBtn}
                          >
                            <Star
                              size={28}
                              color={answers[q.id] >= star ? '#F59E0B' : theme.colors.cardBorder}
                              fill={answers[q.id] >= star ? '#F59E0B' : 'transparent'}
                            />
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {/* Yes / No Choices */}
                    {q.type === 'yes_no' && (
                      <View style={styles.choiceRow}>
                        <TouchableOpacity
                          onPress={() => handleAnswerChange(q.id, 'yes')}
                          style={[
                            styles.choiceChip,
                            answers[q.id] === 'yes' && styles.choiceChipSelected
                          ]}
                        >
                          <Text style={[styles.choiceText, answers[q.id] === 'yes' && styles.choiceTextSelected]}>
                            {language === 'hi' ? 'हाँ' : 'Yes'}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleAnswerChange(q.id, 'no')}
                          style={[
                            styles.choiceChip,
                            answers[q.id] === 'no' && styles.choiceChipSelected
                          ]}
                        >
                          <Text style={[styles.choiceText, answers[q.id] === 'no' && styles.choiceTextSelected]}>
                            {language === 'hi' ? 'नहीं' : 'No'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Single Choice Options */}
                    {q.type === 'single_choice' && q.options && (
                      <View style={{ gap: 6, marginTop: 4 }}>
                        {q.options.map((opt) => (
                          <TouchableOpacity
                            key={opt.value}
                            onPress={() => handleAnswerChange(q.id, opt.value)}
                            style={[
                              styles.optCard,
                              answers[q.id] === opt.value && styles.optCardSelected
                            ]}
                          >
                            <Text style={[styles.optCardText, answers[q.id] === opt.value && styles.optCardTextSelected]}>
                              {language === 'hi' ? opt.hindiLabel : opt.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSubmit}
                style={styles.submitSurveyBtn}
              >
                <Text style={styles.submitSurveyText}>{t.submitSurveyBtn}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.warmCream
  },
  container: {
    padding: 16,
    paddingBottom: 28,
    gap: 16
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  pageSub: {
    fontSize: 12,
    color: theme.colors.mutedGrey,
    marginTop: 2
  },
  surveyCard: {
    backgroundColor: theme.colors.white,
    padding: 16,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.lightBorder,
    gap: 8
  },
  surveyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  surveyTag: {
    backgroundColor: theme.colors.warmCream,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.sm
  },
  surveyTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.mutedGrey
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full
  },
  statusBadgeDone: {
    backgroundColor: theme.colors.sageGreenLight
  },
  statusBadgeAvail: {
    backgroundColor: theme.colors.dustyPinkLight
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700'
  },
  surveyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  surveyDesc: {
    fontSize: 12,
    color: theme.colors.mutedGrey,
    lineHeight: 16
  },
  surveyFooter: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightBorder
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  completedRowText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.sageGreenDark
  },
  startBtn: {
    backgroundColor: theme.colors.dustyPink,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    alignItems: 'center'
  },
  startBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrownDark
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 37, 35, 0.6)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: 20,
    paddingBottom: 32,
    gap: 12
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightBorder,
    paddingBottom: 10
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    flex: 1
  },
  qBox: {
    backgroundColor: theme.colors.warmCream,
    padding: 12,
    borderRadius: theme.radius.md,
    gap: 8
  },
  qText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.deepBrown,
    lineHeight: 18
  },
  starRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4
  },
  starBtn: {
    padding: 4
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4
  },
  choiceChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    alignItems: 'center'
  },
  choiceChipSelected: {
    backgroundColor: theme.colors.dustyPink,
    borderColor: theme.colors.dustyPinkDark
  },
  choiceText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  choiceTextSelected: {
    color: theme.colors.deepBrownDark,
    fontWeight: '800'
  },
  optCard: {
    padding: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  optCardSelected: {
    borderColor: theme.colors.sageGreenDark,
    backgroundColor: theme.colors.sageGreenLight
  },
  optCardText: {
    fontSize: 12,
    color: theme.colors.deepBrown
  },
  optCardTextSelected: {
    fontWeight: '700',
    color: theme.colors.sageGreenDark
  },
  submitSurveyBtn: {
    backgroundColor: theme.colors.dustyPink,
    paddingVertical: 14,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    marginTop: 10
  },
  submitSurveyText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.deepBrownDark
  }
});
