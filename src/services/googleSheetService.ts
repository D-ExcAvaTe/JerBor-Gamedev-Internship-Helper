const SHEET_ID = '19MSrc1mB4LJI7R9IeMUd3C4iGmxbzH8wM_TojY0c-rc';

async function fetchSheetData(sheetName: string) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
  const response = await fetch(url);
  const text = await response.text();
  // ตัดส่วนหัวและท้ายที่ Google แถมมาออกเพื่อให้เป็น JSON ที่สมบูรณ์
  const json = JSON.parse(text.substring(47).slice(0, -2));
  return json.table.rows.map((row: any) => 
    row.c.map((cell: any) => cell?.v ?? null)
  );
}

export const getAppData = async () => {
  const [internRows, configRows] = await Promise.all([
    fetchSheetData('Internships'),
    fetchSheetData('Config')
  ]);

  // 1. จัดการ Config Tags (Tab 2)
  const config: any[] = [
    { id: 'position', label: 'Position', tags: [] },
    { id: 'workMode', label: 'Work Mode', tags: [] },
    { id: 'stipend', label: 'Stipend', tags: [] }
  ];

  configRows.forEach((row: any) => {
    const [category, tagName, colorHex, icon] = row;
    const cat = config.find(c => c.label === category);
    if (cat) {
      cat.tags.push({
        id: tagName.toLowerCase().replace(/\s+/g, '_'),
        label: tagName,
        color: `bg-[${colorHex}]/20 text-[${colorHex}] border-[${colorHex}]/30`, // ใช้ Arbitrary values ของ Tailwind
        icon: icon
      });
    }
  });

  // 2. จัดการข้อมูล Internships (Tab 1)
  const internships = internRows.map((row: any, index: number) => {
    const [id, name, logoUrl, posStr, mode, stipendStat, amount, area, deadline, link, note, status] = row;
    
    return {
      id: id?.toString() || index.toString(),
      name: name || 'Unknown Company',
      logoUrl: logoUrl || 'https://via.placeholder.com/100',
      // แปลง String "Unity, C#" เป็น Array ของ ID
      positions: posStr ? posStr.split(',').map((p: string) => p.trim().toLowerCase().replace(/\s+/g, '_')) : [],
      workMode: mode ? [mode.toLowerCase().replace(/\s+/g, '_')] : [],
      stipend: stipendStat === 'มี' ? 'paid' : 'unpaid',
      stipendAmount: amount || '-',
      location: area || '-',
      deadline: deadline ? new Date(deadline).toISOString() : new Date().toISOString(),
      status: status === 'Open' ? 'Open' : 'Closed',
      requirements: [], // ถ้ามี Column เพิ่มในอนาคตค่อยมาใส่ตรงนี้
      benefits: [],
      contactUrl: link || '#',
      notes: note || ''
    };
  });

  return { internships, config };
};