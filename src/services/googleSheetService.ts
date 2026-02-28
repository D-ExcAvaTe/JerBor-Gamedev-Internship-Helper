const SHEET_ID = '19MSrc1mB4LJI7R9IeMUd3C4iGmxbzH8wM_TojY0c-rc';

// สีมาตรฐานสำหรับหมวดหมู่
const COLOR_PALETTE = ['#A855F7', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

// Keyword Mapping สำหรับจัดกลุ่มอัตโนมัติ
const TAG_CATEGORIES = {
  'Developer & Tech': ['dev', 'programmer', 'unity', 'c#', 'backend', 'frontend', 'software', 'tester', 'qa', 'ai', 'nlp', 'engine', 'data', 'it'],
  'Art & Visual': ['art', 'artist', 'animator', '3d', '2d', 'model', 'rigger', 'vfx', 'motion', 'colorist', 'pixel', 'drawing', 'vdo', 'video', 'graphic'],
  'Design & Creative': ['design', 'designer', 'ux', 'ui', 'creative', 'level', 'narrative', 'writer', 'copywriter'],
  'Business & Management': ['marketing', 'admin', 'hr', 'ae', 'content', 'accountant', 'sales', 'coordinator', 'pm', 'project', 'business']
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
  const uniquePositions = new Set<string>();
  const uniqueModes = new Set<string>();

  const internships = rows.map((row: any, index: number) => {
    const [id, name, logoUrl, posStr, mode, stipendStat, amount, area, deadline, link, note, status] = row;
    
    if (posStr) posStr.split(',').forEach((p: string) => uniquePositions.add(p.trim()));
    if (mode) uniqueModes.add(mode.trim());

    return {
      id: id?.toString() || index.toString(),
      name: name || 'Unknown Company',
      logoUrl: logoUrl || 'https://via.placeholder.com/100',
      positions: posStr ? posStr.split(',').map((p: string) => p.trim().toLowerCase().replace(/\s+/g, '_')) : [],
      workMode: mode ? [mode.trim().toLowerCase().replace(/\s+/g, '_')] : [],
      stipend: stipendStat === 'มี' ? 'paid' : 'unpaid',
      stipendAmount: amount || '-',
      location: area || '-',
      deadline: deadline || '',
      status: status === 'Open' ? 'Open' : 'Closed',
      requirements: [], 
      benefits: [],
      contactUrl: link || '#',
      notes: note || ''
    };
  });

  // สร้างหมวดหมู่ Positions จาก Keyword Map
  const positionConfig = Object.entries(TAG_CATEGORIES).map(([catLabel, keywords]) => ({
    id: `cat_${catLabel.toLowerCase().replace(/\s+/g, '_')}`,
    label: catLabel,
    tags: Array.from(uniquePositions)
      .filter(pos => keywords.some(key => pos.toLowerCase().includes(key)))
      .map((name, i) => ({
        id: name.toLowerCase().replace(/\s+/g, '_'),
        label: name,
        color: COLOR_PALETTE[i % COLOR_PALETTE.length]
      }))
  })).filter(cat => cat.tags.length > 0);

  // หมวดหมู่ที่ไม่เข้าพวก
  const assignedTags = new Set(Object.values(TAG_CATEGORIES).flat());
  const otherTags = Array.from(uniquePositions).filter(pos => 
    !Array.from(assignedTags).some(key => pos.toLowerCase().includes(key))
  );

  const config = [
    ...positionConfig,
    {
      id: 'cat_other',
      label: 'Other Positions',
      tags: otherTags.map(name => ({
        id: name.toLowerCase().replace(/\s+/g, '_'),
        label: name,
        color: '#6B7280'
      }))
    },
    {
      id: 'workMode',
      label: 'Work Mode',
      tags: Array.from(uniqueModes).map(name => ({
        id: name.toLowerCase().replace(/\s+/g, '_'),
        label: name,
        color: '#6366F1'
      }))
    },
    {
      id: 'stipend',
      label: 'Stipend',
      tags: [
        { id: 'paid', label: 'Paid (มีเบี้ยเลี้ยง)', color: '#10B981' },
        { id: 'unpaid', label: 'Unpaid (ไม่มีเบี้ยเลี้ยง)', color: '#EF4444' }
      ]
    }
  ].filter(c => c.tags.length > 0);

  return { internships, config };
};