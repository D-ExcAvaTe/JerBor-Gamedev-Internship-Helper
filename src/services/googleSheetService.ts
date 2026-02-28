const SHEET_ID = '19MSrc1mB4LJI7R9IeMUd3C4iGmxbzH8wM_TojY0c-rc';

// สีประจำหมวดหมู่ตามที่ PM สั่ง
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
  const posCount: Record<string, {label: string, count: number}> = {};
  const locCount: Record<string, {label: string, count: number}> = {};
  const modeCount: Record<string, {label: string, count: number}> = {};

  const internships = rows.map((row: any, index: number) => {
    // Column M (index 12) คือ Job Post Link
    const [id, name, logo, posStr, mode, stipend, amt, area, ddl, link, note, status, postLink] = row;
    
    // นับจำนวนครั้งที่ใช้แต่ละ Tag เพื่อเอาไปทำ Popularity
    if (posStr) posStr.split(',').forEach((p: string) => {
      const label = p.trim();
      const id = label.toLowerCase().replace(/\s+/g, '_');
      posCount[id] = { label, count: (posCount[id]?.count || 0) + 1 };
    });
    if (area) {
      const id = area.trim().toLowerCase().replace(/\s+/g, '_');
      locCount[id] = { label: area.trim(), count: (locCount[id]?.count || 0) + 1 };
    }
    if (mode) {
      const id = mode.trim().toLowerCase().replace(/\s+/g, '_');
      modeCount[id] = { label: mode.trim(), count: (modeCount[id]?.count || 0) + 1 };
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
      requirements: [], benefits: [],
      contactUrl: link || '#',
      jobPostUrl: postLink || '', // ลิงก์โพสต์สมัครงาน
      notes: note || ''
    };
  });

  const config: ConfigCategory[] = [
    {
      id: 'position', label: 'สายงาน (Positions)',
      tags: Object.entries(posCount).map(([id, info]) => ({
        id, label: info.label, color: CAT_COLORS.position, category: 'position', count: info.count
      })).sort((a, b) => b.count - a.count)
    },
    {
      id: 'location', label: 'สถานที่ (Location)',
      tags: Object.entries(locCount).map(([id, info]) => ({
        id, label: info.label, color: CAT_COLORS.location, category: 'location', count: info.count
      })).sort((a, b) => b.count - a.count)
    },
    {
      id: 'workMode', label: 'รูปแบบงาน',
      tags: Object.entries(modeCount).map(([id, info]) => ({
        id, label: info.label, color: CAT_COLORS.workMode, category: 'workMode', count: info.count
      }))
    },
    {
      id: 'stipend', label: 'เบี้ยเลี้ยง',
      tags: [
        { id: 'paid', label: 'มีเบี้ยเลี้ยง', color: CAT_COLORS.stipend, category: 'stipend', count: 100 },
        { id: 'unpaid', label: 'ไม่มีเบี้ยเลี้ยง', color: CAT_COLORS.stipend, category: 'stipend', count: 0 }
      ]
    }
  ];

  return { internships, config };
};