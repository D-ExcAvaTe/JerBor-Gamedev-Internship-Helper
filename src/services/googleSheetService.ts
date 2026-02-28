const SHEET_ID = '19MSrc1mB4LJI7R9IeMUd3C4iGmxbzH8wM_TojY0c-rc';

// สีประจำหมวดหมู่
const CAT_COLORS = {
  position: '#3B82F6', // Blue
  location: '#EF4444', // Red
  workMode: '#A855F7', // Purple
  stipend: '#EAB308',  // Yellow
};

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
  const locCount: Record<string, { label: string; count: number }> = {};
  const modeCount: Record<string, { label: string; count: number }> = {};

  const internships = rows.map((row: any, index: number) => {
    // Column layout (0-indexed):
    // 0=id, 1=name, 2=logo, 3=positions, 4=mode, 5=stipend, 6=amt,
    // 7=area, 8=deadline, 9=contactUrl, 10=note, 11=status,
    // 12=jobPostUrl, 13=workHours, 14=email
    const [
      id, name, logo, posStr, mode, stipend, amt,
      area, ddl, link, note, status,
      postLink, workHours, email
    ] = row;

    if (posStr) posStr.split(',').forEach((p: string) => {
      const label = p.trim();
      const tagId = label.toLowerCase().replace(/\s+/g, '_');
      posCount[tagId] = { label, count: (posCount[tagId]?.count || 0) + 1 };
    });
    if (area) {
      const tagId = area.trim().toLowerCase().replace(/\s+/g, '_');
      locCount[tagId] = { label: area.trim(), count: (locCount[tagId]?.count || 0) + 1 };
    }
    if (mode) {
      const tagId = mode.trim().toLowerCase().replace(/\s+/g, '_');
      modeCount[tagId] = { label: mode.trim(), count: (modeCount[tagId]?.count || 0) + 1 };
    }

    return {
      id: id?.toString() || index.toString(),
      name: name || 'Unknown',
      logoUrl: logo || 'https://via.placeholder.com/100',
      positions: posStr ? posStr.split(',').map((p: string) => p.trim().toLowerCase().replace(/\s+/g, '_')) : [],
      workMode: mode ? [mode.trim().toLowerCase().replace(/\s+/g, '_')] : [],
      stipend: stipend === 'มี' ? 'paid' : 'unpaid',
      stipendAmount: amt || '-',
      location: area ? area.trim().toLowerCase().replace(/\s+/g, '_') : '',
      deadline: ddl || '',
      status: status === 'Open' ? 'Open' : 'Closed',
      requirements: [],
      benefits: [],
      workHours: workHours || '',
      email: email || '',
      contactUrl: link || '#',
      jobPostUrl: postLink || '',
      notes: note || '',
    };
  });

  const config = [
    {
      id: 'position', label: 'สายงาน (Positions)',
      tags: Object.entries(posCount).map(([id, info]) => ({
        id, label: info.label, color: CAT_COLORS.position, category: 'position' as const, count: info.count,
      })).sort((a, b) => b.count - a.count),
    },
    {
      id: 'location', label: 'สถานที่ (Location)',
      tags: Object.entries(locCount).map(([id, info]) => ({
        id, label: info.label, color: CAT_COLORS.location, category: 'location' as const, count: info.count,
      })).sort((a, b) => b.count - a.count),
    },
    {
      id: 'workMode', label: 'รูปแบบงาน',
      tags: Object.entries(modeCount).map(([id, info]) => ({
        id, label: info.label, color: CAT_COLORS.workMode, category: 'workMode' as const, count: info.count,
      })),
    },
    {
      id: 'stipend', label: 'เบี้ยเลี้ยง',
      tags: [
        { id: 'paid', label: 'มีเบี้ยเลี้ยง', color: CAT_COLORS.stipend, category: 'stipend' as const, count: 100 },
        { id: 'unpaid', label: 'ไม่มีเบี้ยเลี้ยง', color: CAT_COLORS.stipend, category: 'stipend' as const, count: 0 },
      ],
    },
  ];

  return { internships, config };
};
