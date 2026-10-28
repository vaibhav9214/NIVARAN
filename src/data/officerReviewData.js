export const OFFICER_REVIEW_DETAILS = {
  'GRV-2026-0138': {
    id: 'GRV-2026-0138',
    title: 'Laboratory Equipment Issue in Physics Department (Physics Lab 2)',
    category: 'Infrastructure & Facilities',
    categoryIcon: 'domain',
    subcategory: 'Laboratory Apparatus',
    submittedOn: '13 Oct 2026, 02:40 PM',
    department: 'Infrastructure Liaison',
    priority: 'Medium',
    statutoryPriority: 'Medium (72h Triage)',
    priorityDot: 'bg-amber-500',
    priorityText: 'text-amber-800',
    status: 'Awaiting Review',
    statusPillClass: 'bg-amber-100 text-amber-900',
    statusDotClass: 'bg-amber-600 animate-pulse',
    shaChecksum: 'e9b5f488c93b6e788ad9c02f06b12a',
    narrative:
      'The equipment in Physics Laboratory 2 has been malfunctioning during practical sessions. Specifically, the digital oscilloscope units (Bench 04 and Bench 07) fail calibration and freeze mid-reading, and the optical spectrometer diffraction grating clamp is damaged. Several students have been unable to complete experiments for PH-201 because the apparatus does not operate consistently, risking coursework deadlines.',
    location: 'Physics Laboratory 2, Ramanujan Science Block',
    incidentDate: '11 October 2026 (During Morning Lab Batch)',
    impactScope: 'Coursework Practicals Disrupted (PH-201 cohort - 48 students)',
    scholarIdentity: 'Rahul Sengupta • #IITD-2024-PH019',
    attachments: [
      {
        id: 'att-1',
        type: 'pdf',
        name: 'oscilloscope_error_log.pdf',
        size: '1.4 MB',
        date: 'Uploaded 13 Oct',
        tag: 'Clean Scan',
      },
      {
        id: 'att-2',
        type: 'image',
        name: 'spectrometer_grating_crack.jpg',
        size: '3.2 MB',
        date: 'Uploaded 13 Oct',
        tag: 'High-res',
        previewUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC-p8nkhtB8K2dtjUnL3Spm6KDAZw7uTrtqiGuZYPcV-dVS5Jy1OBVZClreHOEToKCioQFF2C9sfd5F4aQ8dQwhGEkZWNdeq-0YORZ7NfG7y_NlZzMIYCPrlx5StkhdpvP5BWL79bMDUncL6V2h5Lex27PrJpHnuOFSNZyXgCHEefCtdU1mRtg4pcVA1I3IxBKTrNgeBa6UaWqmZqws0JxdDkwVDz7qKyTpZ_B89_yyrLeeXwJnYd-X',
        caption: 'Ramanujan Hall Lab 2 • Optical Bench 03 • Reticle Alignment Fracture',
        exif: 'EXIF verified: Timestamp matches incident filing date (11 Oct 2026, 11:22 AM).',
      },
    ],
    messages: [
      {
        id: 'msg-1',
        sender: 'Rahul Sengupta',
        role: 'Student',
        initials: 'RS',
        time: '13 Oct, 02:40 PM',
        avatarBg: 'bg-primary-fixed-dim text-on-primary',
        text: 'We notified the lab attendant Mr. Verma on Friday, but replacements were not available in the store room. The entire batch cannot proceed with PH-201 practical coursework.',
        isStudent: true,
      },
      {
        id: 'msg-2',
        sender: 'Ananya Sharma',
        role: 'Officer',
        initials: 'AS',
        time: '14 Oct, 09:30 AM',
        avatarBg: 'bg-primary text-on-primary',
        text: 'Received docket. Central Workshop and Lab Equipment Coordinator have been tagged for an on-site equipment inventory inspection today.',
        isStudent: false,
      },
    ],
    internalNotes: [
      {
        id: 'note-1',
        author: 'Ananya Sharma (IT Liaison)',
        time: '14 Oct, 10:15 AM',
        tag: 'Central Workshop Ticket #CW-882',
        text: 'Checked with Central Workshop. Spare diffraction grating assembly is currently in stock (Shelf B-12). Bench 4 oscilloscope requires firmware flash from vendor representative Mr. Khurana (Keysight contract).',
      },
    ],
    auditTrail: [
      {
        id: 'audit-1',
        title: 'Docket Opened in Review Queue',
        time: '14 Oct 2026, 11:30 AM',
        desc: 'Officer Ananya Sharma initialized primary inspection file.',
        dotClass: 'bg-primary',
        innerClass: 'bg-on-primary',
      },
      {
        id: 'audit-2',
        title: 'Case Assigned to Officer',
        time: '14 Oct 2026, 09:15 AM',
        desc: 'Assigned to Officer Ananya Sharma (Infrastructure / IT Liaison Desk).',
        dotClass: 'bg-secondary',
        innerClass: 'bg-on-secondary',
      },
      {
        id: 'audit-3',
        title: 'Automated UGC-Redressal Triage',
        time: '13 Oct 2026, 02:41 PM',
        desc: 'System evaluated priority: Medium (Academic Coursework disruption threshold triggered).',
        dotClass: 'bg-surface-dim',
        innerClass: 'bg-outline',
      },
      {
        id: 'audit-4',
        title: 'Grievance Lodged',
        time: '13 Oct 2026, 02:40 PM',
        desc: 'Submitted by Scholar Rahul Sengupta (#IITD-2024-PH019) via NIVARAN Student Portal.',
        dotClass: 'bg-surface-dim',
        innerClass: 'bg-outline',
      },
    ],
    sla: {
      reference: 'UGC Redressal Protocol § 9.3 • Infrastructure',
      countdown: '6h 18m',
      deadline: 'Deadline: 21 Oct 2026',
      progressPercent: 70,
      elapsed: '7 days elapsed',
      max: '10 days maximum SLA',
      urgencyBadge: 'Action Window Closing',
      legalNotice:
        'Statutory response window requires official triage within 72 hours of docket intake. Dean escalation triggers automatically in 18 hours if unacknowledged.',
    },
    routing: {
      officerName: 'Ananya Sharma',
      initials: 'AS',
      role: 'Infrastructure Liaison • Active Desk',
      supervisingCell: 'Physical Infrastructure Committee',
    },
    aiAssistant: {
      confidence: '98% Confidence',
      summary:
        'Equipment malfunction in Physics Lab 2 impacting 48 students in PH-201 practicals. Focus on 2 oscilloscope units and 1 optical spectrometer grating clamp.',
      topics: ['#LaboratoryEquipment', '#PhysicsLab2', '#UndergradPracticals', '#HardwareFailure'],
      recommendations: [
        {
          icon: 'lightbulb',
          title: 'Prior Docket Overlap',
          desc: 'High correlation with #GRV-2026-0094 (Physics Lab surge spikes). Advise testing bench surge suppressors.',
          linkTicket: '#GRV-2026-0094',
        },
        {
          icon: 'inventory_2',
          title: 'Inventory Match Found',
          desc: 'Central Workshop database indicates 4 compatible spectrometer clamp units in stock (Shelf B-12).',
        },
      ],
      informationGaps: 'None detected. Hardware model and room data are sufficient for field dispatch.',
    },
    initialRemarks:
      'Site inspection confirms digital oscilloscope calibration failure and optical clamp mechanical failure. Work order issued to Central Workshop for clamp fabrication and vendor re-flash scheduled for Bench 4.',
  },

  'GRV-2026-0142': {
    id: 'GRV-2026-0142',
    title: 'Hostel Wi-Fi Connectivity and Evening Packet Loss',
    category: 'IT & Technical',
    categoryIcon: 'wifi',
    subcategory: 'Hostel Network Infrastructure',
    submittedOn: '14 Oct 2026, 08:15 PM',
    department: 'IT Services',
    priority: 'High',
    statutoryPriority: 'High (24h Triage)',
    priorityDot: 'bg-error',
    priorityText: 'text-error font-bold',
    status: 'In Progress',
    statusPillClass: 'bg-error-container text-error font-bold',
    statusDotClass: 'bg-error animate-pulse',
    shaChecksum: '7a9c31b8ef902e8117d3bc8910a34b',
    narrative:
      'Hostel Block B experiences complete Wi-Fi connectivity dropouts every evening between 20:00 and 23:00 hrs. Access point AP-B-2F-04 exhibits packet loss exceeding 45%, impeding students from submitting online assignments and accessing academic journals.',
    location: 'Hostel Block B (Floors 2 & 3), South Campus',
    incidentDate: '12-14 October 2026 (Recurring Peak Hours)',
    impactScope: 'Residential Hall Network Access (Over 180 residents)',
    scholarIdentity: 'Kavya Raman • #IITD-2023-CS041',
    attachments: [
      {
        id: 'att-1',
        type: 'pdf',
        name: 'ping_traceroute_blockB.pdf',
        size: '890 KB',
        date: 'Uploaded 14 Oct',
        tag: 'Traceroute Log',
      },
    ],
    messages: [
      {
        id: 'msg-1',
        sender: 'Kavya Raman',
        role: 'Student',
        initials: 'KR',
        time: '14 Oct, 08:15 PM',
        avatarBg: 'bg-primary-fixed-dim text-on-primary',
        text: 'The evening drop is getting worse every day. We cannot access our LMS during submission hours.',
        isStudent: true,
      },
    ],
    internalNotes: [
      {
        id: 'note-1',
        author: 'Ananya Sharma (IT Liaison)',
        time: '15 Oct, 09:30 AM',
        tag: 'Network NOC Dispatch #NET-402',
        text: 'Core switch logs indicate upstream port flap at 20:14 hrs. NOC engineer assigned for firmware rollback.',
      },
    ],
    auditTrail: [
      {
        id: 'audit-1',
        title: 'NOC Engineer Dispatched',
        time: '15 Oct 2026, 10:00 AM',
        desc: 'Field technician sent to Hostel B communications closet.',
        dotClass: 'bg-primary',
        innerClass: 'bg-on-primary',
      },
      {
        id: 'audit-2',
        title: 'Grievance Lodged',
        time: '14 Oct 2026, 08:15 PM',
        desc: 'Lodged by Kavya Raman (#IITD-2023-CS041).',
        dotClass: 'bg-surface-dim',
        innerClass: 'bg-outline',
      },
    ],
    sla: {
      reference: 'UGC Redressal Protocol § 7.1 • IT Services',
      countdown: 'Overdue by 2d',
      deadline: 'Target: 20 Oct 2026',
      progressPercent: 100,
      elapsed: '8 days elapsed',
      max: '6 days statutory SLA',
      urgencyBadge: 'Overdue SLA Breach',
      legalNotice:
        'Statutory 48h resolution window exceeded. Automatic escalation flag active on Dean dashboard.',
    },
    routing: {
      officerName: 'Ananya Sharma',
      initials: 'AS',
      role: 'IT Services Desk • Active Officer',
      supervisingCell: 'Campus Networking Council',
    },
    aiAssistant: {
      confidence: '95% Confidence',
      summary:
        'Evening congestion and wireless AP disconnects in Hostel Block B affecting ~180 residents.',
      topics: ['#HostelNetwork', '#PacketLoss', '#AccessPointFailure', '#StudentResidential'],
      recommendations: [
        {
          icon: 'lightbulb',
          title: 'Related Network Ticket',
          desc: 'Correlates with upstream distribution switch reboot at East Wing distribution node.',
          linkTicket: '#GRV-2026-0081',
        },
      ],
      informationGaps: 'None. Diagnostic traceroutes provided.',
    },
    initialRemarks:
      'Field inspection arranged with NOC supervisor. VLAN traffic reallocation recommended for evening bandwidth throttle relief.',
  },
};

// Fallback helper to safely retrieve case details or generate standard view
export function getOfficerCaseDetails(id) {
  if (id && OFFICER_REVIEW_DETAILS[id]) {
    return OFFICER_REVIEW_DETAILS[id];
  }
  // Default to GRV-2026-0138 template with custom ID
  const base = OFFICER_REVIEW_DETAILS['GRV-2026-0138'];
  return {
    ...base,
    id: id || 'GRV-2026-0138',
  };
}
