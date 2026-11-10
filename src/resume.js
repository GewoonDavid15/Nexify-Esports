/**
 * Resume data — sourced from Nexify's official resume
 * (attached_assets/Nexify_Resume_Esports_v2_1.docx). Language-independent facts
 * live here; labels and bullet points are translation keys. Do not add roles,
 * results or details that are not on the resume.
 */
export const experience = [
  { id: 'novaris', org: 'Novaris Esports', role: 'founder', period: 'p2020mid2021', countries: ['PT', 'SE'], tags: ['founder'] },
  { id: 'northcore', org: 'NorthCore Esports', role: 'fortnitePlayer', period: 'mid2021early2022', countries: ['NL'], tags: ['player'] },
  { id: 'lusitania', org: 'Lusitania Esports', role: 'fortnitePlayerContentEditor', period: 'y2022', countries: ['PT'], tags: ['player', 'content'] },
  { id: 'vertex', org: 'Vertex Esports', role: 'playerSmm', period: 'y2023', countries: ['NL'], tags: ['player', 'social'] },
  { id: 'novarise', org: 'NovaRise Esports', role: 'playerSmm', period: 'y2025', countries: ['PT'], tags: ['player', 'social'] },
  { id: 'aether', org: 'Aether Esports', role: 'playerSmm', period: 'early2026', countries: ['PT'], tags: ['player', 'social'] },
  { id: 'haze', org: 'Haze Esports', role: 'smm', period: 'mid2026present', countries: ['US', 'UK'], tags: ['social'], current: true },
];

/** Skill groups in the order of the resume. Tools are product names (not translated). */
export const skillGroups = [
  { id: 'esports', skills: ['competitiveFortnite', 'scrimsTournaments', 'teamCallouts', 'scouting'] },
  { id: 'social', skills: ['socialStrategy', 'communityDiscord', 'brandGrowth', 'copywriting', 'contentScheduling', 'esportsOps'] },
  { id: 'tech', skills: ['discordBots', 'obsPacks', 'logoBranding', 'lua', 'java', 'python', 'web'] },
  { id: 'languages', skills: ['ptNative', 'dutch', 'english'] },
];

export const tools = ['Photoshop', 'Premiere Pro', 'CapCut', 'Canva', 'OBS Studio', 'Notion', 'Trello', 'Microsoft Office'];
