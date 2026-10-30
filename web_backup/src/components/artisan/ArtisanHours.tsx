import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Calendar, AlertCircle, CheckCircle2, ChevronRight, PlusCircle, Check } from 'lucide-react';

export const ArtisanHours: React.FC = () => {
  const { currentUser, workingHours, logWorkingHours, orders, t, language, showToast } = useApp();

  const artisanId = currentUser.artisanId || 'art-1';
  const myHours = workingHours.filter((h) => h.artisanId === artisanId);
  const myOrders = orders.filter((o) => o.artisanId === artisanId);

  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(todayStr);
  const [startTime, setStartTime] = useState<string>('10:00');
  const [endTime, setEndTime] = useState<string>('15:30');
  const [breakMinutes, setBreakMinutes] = useState<number>(30);
  const [durationQuickPick, setDurationQuickPick] = useState<number | null>(null);
  const [associatedOrderId, setAssociatedOrderId] = useState<string>(myOrders[0]?.id || '');
  const [notes, setNotes] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Calculate duration
  const calculateDuration = (): number => {
    if (durationQuickPick !== null) {
      return durationQuickPick;
    }
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const totalStartMin = startH * 60 + startM;
    const totalEndMin = endH * 60 + endM;

    if (totalEndMin <= totalStartMin) return 0;
    const netMinutes = Math.max(0, totalEndMin - totalStartMin - breakMinutes);
    return Math.round((netMinutes / 60) * 10) / 10;
  };

  const calculatedHours = calculateDuration();

  // Quick duration selection
  const handleQuickDuration = (hrs: number) => {
    setDurationQuickPick(hrs);
    // Adjust start/end time display
    setStartTime('10:00');
    const endHour = 10 + Math.floor(hrs);
    const endMin = (hrs % 1) * 60 + (hrs > 3 ? 30 : 0);
    setEndTime(`${endHour < 10 ? '0' + endHour : endHour}:${endMin === 0 ? '00' : '30'}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (calculatedHours <= 0) {
      setErrorMessage(t.invalidTimeWarning);
      return;
    }

    const selectedOrder = myOrders.find((o) => o.id === associatedOrderId);

    const result = logWorkingHours({
      artisanId,
      artisanName: currentUser.name,
      date,
      startTime,
      endTime,
      durationHours: calculatedHours,
      breakMinutes,
      orderId: selectedOrder?.id,
      orderNumber: selectedOrder?.orderNumber,
      notes
    });

    if (!result.success) {
      setErrorMessage(result.error || t.duplicateHourWarning);
    } else {
      // Clear form
      setNotes('');
      setDurationQuickPick(null);
    }
  };

  // Summaries
  const totalHoursLogged = myHours.reduce((sum, h) => sum + h.durationHours, 0);
  const approvedHours = myHours.filter((h) => h.status === 'approved').reduce((sum, h) => sum + h.durationHours, 0);
  const pendingHours = myHours.filter((h) => h.status === 'submitted').reduce((sum, h) => sum + h.durationHours, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--deep-brown)' }}>
          {t.workingHoursTitle}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--muted-grey)', marginTop: '2px' }}>
          {t.workingHoursSubtitle}
        </p>
      </div>

      {/* Summary KPI Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        <div className="artisan-card" style={{ padding: '12px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
            {language === 'hi' ? 'कुल घंटे' : 'Total Hours'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--deep-brown)', marginTop: '2px' }}>
            {totalHoursLogged}
          </div>
        </div>

        <div className="artisan-card" style={{ padding: '12px 10px', textAlign: 'center', borderColor: 'var(--sage-green-border)' }}>
          <div style={{ fontSize: '11px', color: 'var(--sage-green-dark)' }}>
            {language === 'hi' ? 'स्वीकृत' : 'Approved'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--sage-green-dark)', marginTop: '2px' }}>
            {approvedHours}
          </div>
        </div>

        <div className="artisan-card" style={{ padding: '12px 10px', textAlign: 'center', borderColor: 'var(--soft-yellow-border)' }}>
          <div style={{ fontSize: '11px', color: 'var(--soft-yellow-dark)' }}>
            {language === 'hi' ? 'समीक्षाधीन' : 'Pending'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--soft-yellow-dark)', marginTop: '2px' }}>
            {pendingHours}
          </div>
        </div>
      </div>

      {/* Entry Form */}
      <div
        className="artisan-card border-stitched"
        style={{
          padding: '22px 18px',
          backgroundColor: 'var(--white)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--dusty-pink-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Clock size={18} color="var(--dusty-pink-dark)" />
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
            {language === 'hi' ? 'आज का समय दर्ज करें' : 'Log Today’s Hours'}
          </h2>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#FDF1EF',
              border: '1px solid #F6CEC7',
              color: '#B43828',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Date Picker */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--deep-brown)', display: 'block', marginBottom: '4px' }}>
              {t.dateLabel}
            </label>
            <input
              type="date"
              required
              value={date}
              max={todayStr}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--light-border)',
                backgroundColor: 'var(--warm-cream)'
              }}
            />
          </div>

          {/* Quick Duration Stepper Pills */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--deep-brown)', display: 'block', marginBottom: '6px' }}>
              {t.quickDuration}
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[2, 3, 4, 5, 6].map((hrs) => {
                const isSelected = durationQuickPick === hrs;
                return (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => handleQuickDuration(hrs)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: isSelected ? '2px solid var(--dusty-pink)' : '1px solid var(--light-border)',
                      backgroundColor: isSelected ? 'var(--dusty-pink)' : 'var(--white)',
                      color: isSelected ? 'var(--deep-brown-dark)' : 'var(--deep-brown)',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {hrs} {language === 'hi' ? 'घंटे' : 'hrs'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Start / End Time & Break Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted-grey)', display: 'block', marginBottom: '4px' }}>
                {t.startTimeLabel}
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setDurationQuickPick(null);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--light-border)'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted-grey)', display: 'block', marginBottom: '4px' }}>
                {t.endTimeLabel}
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setDurationQuickPick(null);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--light-border)'
                }}
              />
            </div>
          </div>

          {/* Break Duration */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted-grey)', display: 'block', marginBottom: '4px' }}>
              {t.breakDurationLabel}
            </label>
            <select
              value={breakMinutes}
              onChange={(e) => {
                setBreakMinutes(Number(e.target.value));
                setDurationQuickPick(null);
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--light-border)',
                backgroundColor: 'var(--white)'
              }}
            >
              <option value={0}>0 {language === 'hi' ? 'मिनट (कोई विश्राम नहीं)' : 'min (No break)'}</option>
              <option value={15}>15 {language === 'hi' ? 'मिनट' : 'min'}</option>
              <option value={30}>30 {language === 'hi' ? 'मिनट (दोपहर भोजन/चाय)' : 'min (Lunch/Tea)'}</option>
              <option value={45}>45 {language === 'hi' ? 'मिनट' : 'min'}</option>
              <option value={60}>60 {language === 'hi' ? 'मिनट' : 'min'}</option>
            </select>
          </div>

          {/* Associated Order */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--deep-brown)', display: 'block', marginBottom: '4px' }}>
              {t.associatedOrder}
            </label>
            <select
              value={associatedOrderId}
              onChange={(e) => setAssociatedOrderId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--light-border)',
                backgroundColor: 'var(--white)'
              }}
            >
              <option value="">{language === 'hi' ? '-- किसी भी ऑर्डर से संबंधित नहीं --' : '-- General workshop / no order --'}</option>
              {myOrders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.orderNumber} - {language === 'hi' ? o.productHindiName : o.productName}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--deep-brown)', display: 'block', marginBottom: '4px' }}>
              {t.workNotes}
            </label>
            <input
              type="text"
              placeholder={language === 'hi' ? 'उदा. 8 पाउच में ज़िप सिलाई और कटिंग' : 'e.g. stitched 8 pouches & ironed'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--light-border)'
              }}
            />
          </div>

          {/* Calculated Total Display */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--warm-cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--deep-brown)' }}>
              {t.calculatedTotalHours}:
            </span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dusty-pink-dark)' }}>
              {calculatedHours} {language === 'hi' ? 'घंटे' : 'hrs'}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '14px', fontSize: '15px', marginTop: '4px' }}
          >
            <span>{t.submitHoursBtn}</span>
          </button>
        </form>
      </div>

      {/* History List */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '12px' }}>
          {t.timesheetHistory}
        </h2>

        {myHours.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myHours.map((entry) => {
              const isApproved = entry.status === 'approved';
              const isRejected = entry.status === 'rejected';

              return (
                <div
                  key={entry.id}
                  className="artisan-card"
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isApproved ? 'var(--sage-green-light)' : 'var(--warm-cream)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <span style={{ fontSize: '15px', fontWeight: 800, color: isApproved ? 'var(--sage-green-dark)' : 'var(--deep-brown)' }}>
                        {entry.durationHours}
                      </span>
                      <span style={{ fontSize: '9px', color: 'var(--muted-grey)', lineHeight: 1 }}>
                        {language === 'hi' ? 'घंटे' : 'hrs'}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                        {entry.date} ({entry.startTime} - {entry.endTime})
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '2px' }}>
                        {entry.orderNumber ? `Order: ${entry.orderNumber}` : (language === 'hi' ? 'सामान्य कार्य' : 'General workshop')}
                        {entry.notes ? ` • ${entry.notes}` : ''}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`badge-status ${
                      isApproved ? 'badge-completed' : isRejected ? 'badge-urgent' : 'badge-in-progress'
                    }`}
                    style={{ fontSize: '11px' }}
                  >
                    {isApproved ? t.statusTimesheetApproved : isRejected ? t.statusTimesheetRejected : t.statusSubmitted}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted-grey)', fontSize: '13px' }}>
            {t.noHoursYet}
          </div>
        )}
      </div>
    </div>
  );
};
