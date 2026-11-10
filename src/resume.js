/**
 * Resume data — sourced from Nexify's resume. Language-independent facts live
 * here; labels are translation keys. Do not add roles, results or details that
 * are not on the resume.
 */
export const experience = [
  { org: 'NOVARIS Esports', role: 'founder', period: 'p2020mid2021', start: '2020', countries: ['NL', 'PT', 'SE'], tags: ['founder'] },
  { org: 'NorthCore Esports', role: 'fortnitePlayer', period: 'mid2021early2022', start: '2021', countries: ['NL'], tags: ['player'] },
  { org: 'Lusitania Esports', role: 'playerContentEditor', period: 'y2022', start: '2022', countries: ['PT'], tags: ['player', 'content'] },
  { org: 'Vertex Esports', role: 'playerSmm', period: 'y2023', start: '2023', countries: ['NL'], tags: ['player', 'social'] },
  { org: 'NovaRise Esports', role: 'playerSmm', period: 'y2024', start: '2024', countries: ['PT'], tags: ['player', 'social'] },
  { org: 'Aether Esports', role: 'playerSmm', period: 'y2025', start: '2025', countries: ['PT'], tags: ['player', 'social'] },
];

export const skillGroups = [
  { id: 'core', skills: ['communication', 'leadership', 'creativity', 'problemSolving'] },
  { id: 'social', skills: ['socialMedia', 'contentWriting', 'contentScheduling', 'design', 'branding'] },
  { id: 'community', skills: ['communityManagement', 'discord'] },
  { id: 'ops', skills: ['esportsOps', 'recruitment'] },
  { id: 'player', skills: ['controllerPc', 'scrimsTournaments'] },
];

/** Tool names are product names and are not translated. */
export const tools = ['Adobe Photoshop', 'Canva', 'Premiere Pro', 'CapCut', 'OBS Studio', 'Microsoft Office', 'Notion', 'Trello'];

/** Order matches the resume skills list. */
export const resumeSkills = [
  'communication', 'leadership', 'socialMedia', 'communityManagement', 'discord', 'contentWriting',
  'contentScheduling', 'design', 'branding', 'recruitment', 'esportsOps', 'creativity', 'problemSolving',
];
