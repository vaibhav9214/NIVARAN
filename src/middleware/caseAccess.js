/**
 * Case Access Control Helper
 * Evaluates whether an officer is authorized to access a given case
 * according to their configured caseAccessConfig and department association.
 */
function evaluateCaseAccess(officer, caseItem) {
  if (!officer) {
    return { allowed: false, reason: 'Unauthenticated user.' };
  }

  if (officer.role === 'admin') {
    return { allowed: true, reason: 'Admin has global case access.' };
  }

  if (officer.role !== 'officer') {
    return { allowed: false, reason: 'Only grievance officers or administrators can access cases.' };
  }

  if (officer.status !== 'active') {
    return { allowed: false, reason: 'Officer account is not active.' };
  }

  const config = officer.caseAccessConfig || { accessScope: 'department' };

  // Check escalation restriction
  if (caseItem.isEscalated && !config.canHandleEscalated) {
    return {
      allowed: false,
      reason: 'Officer is not authorized to handle escalated cases.'
    };
  }

  // Scope: 'all' -> Allowed
  if (config.accessScope === 'all') {
    return { allowed: true, reason: 'Officer has universal access scope.' };
  }

  // Scope: 'department' -> Must match officer's assigned department
  if (config.accessScope === 'department') {
    const officerDept = officer.department ? officer.department.toString() : null;
    const caseDept = caseItem.department ? caseItem.department.toString() : null;

    if (!officerDept) {
      return { allowed: false, reason: 'Officer is not assigned to any department.' };
    }
    if (officerDept !== caseDept) {
      return {
        allowed: false,
        reason: 'Case does not belong to officer assigned department.'
      };
    }
    return { allowed: true, reason: 'Case matches officer assigned department.' };
  }

  // Scope: 'custom' -> Must match assignedCategories
  if (config.accessScope === 'custom') {
    const categories = config.assignedCategories || [];
    if (!caseItem.category || !categories.includes(caseItem.category)) {
      return {
        allowed: false,
        reason: `Case category '${caseItem.category}' is not in officer assigned categories: [${categories.join(', ')}].`
      };
    }
    return { allowed: true, reason: 'Case category is authorized for this officer.' };
  }

  return { allowed: false, reason: 'Access denied under current case access configuration.' };
}

module.exports = { evaluateCaseAccess };

