const SHEET_ID = '19MSrc1mB4LJI7R9IeMUd3C4iGmxbzH8wM_TojY0c-rc';

// สีมาตรฐานสำหรับ Tags (จะวนลูปใช้)
const COLOR_PALETTE = ['#A855F7', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

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

  // 1. จัดการแปลงข้อมูลแถวเป็น Internship Object และเก็บชื่อ Tag ทั้งหมดที่เจอ
  const internships = rows.map((row: any, index: number) => {
    const [id, name, logoUrl, posStr, mode, stipendStat, amount, area, deadline, link, note, status] = row;
    
    // เก็บชื่อ Tag แบบดิบๆ ไว้ทำ Config
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
      contactUrl: link || '#', // แก้ปัญหาปุ่ม Apply: ดึงจาก Column J
      notes: note || ''
    };
  });

  // 2. เจน Config อัตโนมัติจาก Tag ที่สแกนเจอ
  const config: any[] = [
    {
      id: 'position',
      label: 'Position',
      tags: Array.from(uniquePositions).map((name, i) => ({
        id: name.toLowerCase().replace(/\s+/g, '_'),
        label: name,
        color: COLOR_PALETTE[i % COLOR_PALETTE.length]
      }))
    },
    {
      id: 'workMode',
      label: 'Work Mode',
      tags: Array.from(uniqueModes).map((name, i) => ({
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
        { id: 'unpaid', label: 'Unpaid (ไม่มีเบี้ยเลี้ยง)', color: '#6B7280' }
      ]
    }
  ];

  return { internships, config };
};