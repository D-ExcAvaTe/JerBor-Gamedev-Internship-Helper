const SHEET_ID = '19MSrc1mB4LJI7R9IeMUd3C4iGmxbzH8wM_TojY0c-rc';

const CAT_COLORS = {
  programmer: '#3B82F6',
  artist: '#3B82F6',
  design: '#3B82F6',
  other: '#3B82F6',
  workMode: '#06B6D4',
  stipend: '#EAB308',
};

function classifyPosition(label: string): 'programmer' | 'artist' | 'design' | 'other' {
  const l = label.toLowerCase();

  if (
    l.includes('developer') || l.includes('programmer') || l.includes('engineer') ||
    l.includes('unity') || l.includes('unreal') || l.includes('web dev') ||
    l.includes('nlp') || l.includes('ai researcher') || l.includes('data sci') ||
    l.includes('data analyst') || l.includes('it support') || l.includes('qa') ||
    l.includes('technical artist')
  ) return 'programmer';

  if (
    l.includes('artist') || l.includes('animator') || l.includes('vfx') ||
    l.includes('colorist') || l.includes('concept') || l.includes('rigger') ||
    l.includes('sound') || l.includes('music') || l.includes('video editor') ||
    l.includes('writer')
  ) return 'artist';

  if (
    l.includes('designer') || l.includes('design') || l.includes('ui') ||
    l.includes('ux') || l.includes('level designer') || l.includes('game designer') ||
    l.includes('board game') || l.includes('card game')
  ) return 'design';

  return 'other';
}

function normalizeWorkMode(mode: string): string {
  const m = mode.trim().toLowerCase();
  if (m.includes('remote') || m === 'remote 100%') return 'Remote 100%';
  if (m.includes('wfh') || m === 'wfh 100%') return 'Remote 100%';
  if (m.includes('hybrid') || m.includes('onsite/wfh')) return 'Hybrid';
  if (m.includes('onsite')) return 'Onsite 100%';
  return '';
}

async function fetchSheetData(sheetName: string) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
  const response = await fetch(url);
  const text = await response.text();
  const json = JSON.parse(text.substring(47).slice(0, -2));
  return json.table.rows.map((row: any) =>
    row.c.map((cell: any) => cell?.v ?? null)
  );
}

export const getAppData = async () => {
  const rows = await fetchSheetData('Internships');

  const posCount: Record<string, { label: string; count: number }> = {};
  const modeCount: Record<string, { label: string; count: number }> = {};

  const rawInternships = rows.map((row: any, index: number) => {
    const [
      id, name, logo, posStr, mode, stipend, amt,
      area, ddl, link, note, status,
      postLink, workHours, email
    ] = row;

    if (posStr) posStr.split(',').forEach((p: string) => {
      const label = p.trim();
      if (!label) return;
      const tagId = label.toLowerCase().replace(/\s+/g, '_');
      posCount[tagId] = { label, count: (posCount[tagId]?.count || 0) + 1 };
    });

    const normalizedMode = mode ? normalizeWorkMode(mode) : '';
    if (normalizedMode) {
      const tagId = normalizedMode.toLowerCase().replace(/\s+/g, '_').replace(/%/g, 'pct');
      modeCount[tagId] = { label: normalizedMode, count: (modeCount[tagId]?.count || 0) + 1 };
    }

    let deadlineStr = '';
    if (ddl) {
      const ddlString = String(ddl).trim();
      const matchDateObj = ddlString.match(/Date\((\d+),\s*(\d+),\s*(\d+)/);
      
      if (matchDateObj) {
        const y = matchDateObj[1];
        const m = String(parseInt(matchDateObj[2]) + 1).padStart(2, '0');
        const d = String(matchDateObj[3]).padStart(2, '0');
        deadlineStr = `${y}-${m}-${d}`;
      } else if (ddlString.includes('/')) {
        const parts = ddlString.split('/');
        if (parts.length === 3) {
          if (parts[0].length === 4) {
             deadlineStr = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
          } else {
             deadlineStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        } else {
          deadlineStr = ddlString;
        }
      } else {
        deadlineStr = ddlString;
      }
    }

    const stipendVal = (typeof stipend === 'string' && stipend.trim() === 'มี') ? 'paid' : 'unpaid';

    let finalStatus: 'Open' | 'Closed' = 'Closed';
    if (status === 'Open') {
      if (deadlineStr) {
        const deadline = new Date(deadlineStr);
        if (!isNaN(deadline.getTime())) {
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          finalStatus = deadline.getTime() >= now.getTime() ? 'Open' : 'Closed';
        } else {
          finalStatus = 'Open';
        }
      } else {
        finalStatus = 'Open';
      }
    } else {
      finalStatus = status === 'Closed' ? 'Closed' : 'Open';
    }

    return {
      id: id?.toString() || index.toString(),
      name: name || 'Unknown',
      logoUrl: logo || 'https://via.placeholder.com/100',
      positions: posStr ? posStr.split(',').map((p: string) => p.trim().toLowerCase().replace(/\s+/g, '_')).filter(Boolean) : [],
      workMode: normalizedMode ? [normalizedMode.toLowerCase().replace(/\s+/g, '_').replace(/%/g, 'pct')] : [],
      stipend: stipendVal,
      stipendAmount: amt || '-',
      location: area ? area.trim() : '',
      deadline: deadlineStr,
      status: finalStatus,
      requirements: [],
      benefits: [],
      workHours: workHours || '',
      email: email || '',
      contactUrl: link || '#',
      jobPostUrl: postLink || '',
      notes: note || '',
    };
  });

  const internships = [...rawInternships].sort((a, b) => {
    const timeA = a.deadline ? new Date(a.deadline).getTime() : NaN;
    const timeB = b.deadline ? new Date(b.deadline).getTime() : NaN;
    
    const isValidA = !isNaN(timeA);
    const isValidB = !isNaN(timeB);

    if (isValidA && isValidB) return timeA - timeB;
    if (isValidA && !isValidB) return -1;
    if (!isValidA && isValidB) return 1;
    return 0;
  });

  const posByCategory: Record<string, typeof posCount> = {
    programmer: {}, artist: {}, design: {}, other: {}
  };
  Object.entries(posCount).forEach(([id, info]) => {
    const cat = classifyPosition(info.label);
    posByCategory[cat][id] = info;
  });

  const subCategoryConfig = [
    { id: 'programmer', label: '💻 Programmer / Tech', color: CAT_COLORS.programmer },
    { id: 'artist',    label: '🎨 Artist / Creative',  color: CAT_COLORS.artist },
    { id: 'design',    label: '✏️ Designer',           color: CAT_COLORS.design },
    { id: 'other',     label: '📦 Other',              color: CAT_COLORS.other },
  ];

  const positionConfig = {
    id: 'position',
    label: 'สายงาน',
    tags: Object.entries(posCount).map(([id, info]) => ({
      id, label: info.label,
      color: CAT_COLORS[classifyPosition(info.label)],
      category: 'position' as const,
      positionCategory: classifyPosition(info.label),
      count: info.count,
    })).sort((a, b) => b.count - a.count),
    subCategories: subCategoryConfig.map(sc => ({
      ...sc,
      tags: Object.entries(posByCategory[sc.id]).map(([id, info]) => ({
        id, label: info.label,
        color: sc.color,
        category: 'position' as const,
        positionCategory: sc.id as any,
        count: info.count,
      })).sort((a, b) => b.count - a.count),
    })).filter(sc => sc.tags.length > 0),
  };

  const paidCount = internships.filter(i => i.stipend === 'paid').length;
  const unpaidCount = internships.filter(i => i.stipend === 'unpaid').length;

  const config = [
    positionConfig,
    {
      id: 'workMode',
      label: 'รูปแบบงาน',
      tags: Object.entries(modeCount).map(([id, info]) => ({
        id, label: info.label, color: CAT_COLORS.workMode, category: 'workMode' as const, count: info.count,
      })).sort((a, b) => b.count - a.count),
    },
    {
      id: 'stipend',
      label: 'เบี้ยเลี้ยง',
      tags: [
        { id: 'paid',   label: 'มีเบี้ยเลี้ยง',    color: CAT_COLORS.stipend, category: 'stipend' as const, count: paidCount },
        { id: 'unpaid', label: 'ไม่มีเบี้ยเลี้ยง', color: CAT_COLORS.stipend, category: 'stipend' as const, count: unpaidCount },
      ],
    },
  ];

  return { internships, config };
};