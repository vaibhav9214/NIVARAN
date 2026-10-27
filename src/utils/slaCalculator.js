const SLA_DURATIONS_HOURS = {
  Urgent: 24,
  High: 72,
  Medium: 168,
  Low: 336
};

const TERMINAL_STATUSES = ['Resolved', 'Rejected', 'Withdrawn', 'Closed'];

/**
 * Calculate the deadline date based on priority
 */
function calculateSlaDeadline(priority = 'Medium', fromDate = new Date()) {
  const hours = SLA_DURATIONS_HOURS[priority] || SLA_DURATIONS_HOURS.Medium;
  const deadline = new Date(new Date(fromDate).getTime() + hours * 60 * 60 * 1000);
  return { slaHours: hours, slaDeadline: deadline };
}

/**
 * Enriches a grievance object or document with dynamic SLA and deadline analytics
 */
function computeSlaMetrics(grievance) {
  const g = typeof grievance.toObject === 'function' ? grievance.toObject() : { ...grievance };

  const isTerminal = TERMINAL_STATUSES.includes(g.status);
  const now = new Date();

  // If slaDeadline is not explicitly stored, derive it from createdAt + priority
  let deadline = g.slaDeadline ? new Date(g.slaDeadline) : null;
  if (!deadline && g.createdAt) {
    const hours = SLA_DURATIONS_HOURS[g.priority] || 168;
    deadline = new Date(new Date(g.createdAt).getTime() + hours * 60 * 60 * 1000);
    g.slaDeadline = deadline;
  }

  if (!deadline) {
    g.isOverdue = false;
    g.remainingHours = null;
    g.slaStatus = 'not_applicable';
    g.timeRemainingFormatted = 'N/A';
    return g;
  }

  const remainingMs = deadline.getTime() - now.getTime();
  const remainingHours = Math.round((remainingMs / (1000 * 60 * 60)) * 10) / 10;
  const isOverdue = !isTerminal && remainingMs < 0;

  let slaStatus = 'within_sla';
  let timeRemainingFormatted = '';

  if (isTerminal) {
    slaStatus = 'completed';
    timeRemainingFormatted = 'Case completed';
  } else if (isOverdue) {
    slaStatus = 'breached';
    const overdueHours = Math.abs(remainingHours);
    if (overdueHours >= 24) {
      const days = Math.floor(overdueHours / 24);
      const rem = Math.round(overdueHours % 24);
      timeRemainingFormatted = `Overdue by ${days}d ${rem}h`;
    } else {
      timeRemainingFormatted = `Overdue by ${overdueHours}h`;
    }
  } else if (remainingHours <= 24) {
    slaStatus = 'nearing_deadline';
    timeRemainingFormatted = `${Math.max(1, Math.round(remainingHours))}h remaining (Urgent)`;
  } else {
    const days = Math.floor(remainingHours / 24);
    const rem = Math.round(remainingHours % 24);
    timeRemainingFormatted = `${days}d ${rem}h remaining`;
  }

  g.isOverdue = isOverdue;
  g.remainingHours = remainingHours;
  g.slaStatus = slaStatus;
  g.timeRemainingFormatted = timeRemainingFormatted;

  return g;
}

module.exports = {
  SLA_DURATIONS_HOURS,
  TERMINAL_STATUSES,
  calculateSlaDeadline,
  computeSlaMetrics
};

