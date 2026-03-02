import { calculateDaysLeft } from '../utils/dateUtils';

const SHEET_ID = '19MSrc1mB4LJI7R9IeMUd3C4iGmxbzH8wM_TojY0c-rc';

function safeText(value: any, fallback: string) {
  if (value === null || value === undefined) return fallback;

  if (typeof value === 'string') {
    const v = value.trim();

    if (
      v === '' ||
      v === 'Null' ||
      v === 'null' ||
      v === '-'
    )
      return fallback;

    return v;
  }

  return value;
}

async function fetchSheetData(sheetName: string) {
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  const response = await fetch(url);

  const text = await response.text();

  const json = JSON.parse(
    text.substring(47).slice(0, -2)
  );

  return json.table.rows.map((row: any) =>
    row.c.map((cell: any) => cell?.v ?? null)
  );
}

function normalizeWorkMode(mode: string) {
  const m = mode.toLowerCase();

  if (m.includes('remote')) return 'remote';
  if (m.includes('wfh')) return 'remote';
  if (m.includes('hybrid')) return 'hybrid';
  if (m.includes('onsite')) return 'onsite';

  return '';
}

export const getAppData = async () => {
  const rows = await fetchSheetData('Internships');

  const internships = rows.map(
    (row: any, index: number) => {
      const [
        id,
        name,
        logo,
        posStr,
        mode,
        stipend,
        amt,
        area,
        ddl,
        link,
        note,
        status,
        postLink,
        workHours,
        email,
      ] = row;

      const deadline =
        typeof ddl === 'string' ? ddl : '';

      const deadlineLabel =
        deadline || 'ไม่มีกำหนด';

      const daysLeft =
        calculateDaysLeft(deadline);

      return {
        id: id?.toString() || index.toString(),

        name: safeText(
          name,
          'ไม่ระบุชื่อบริษัท'
        ),

        logoUrl: safeText(
          logo,
          'https://via.placeholder.com/100'
        ),

        positions: posStr
          ? posStr
              .split(',')
              .map((p: string) =>
                p.trim().toLowerCase()
              )
          : [],

        workMode: mode
          ? [normalizeWorkMode(mode)]
          : [],

        stipend:
          stipend === 'มี'
            ? 'paid'
            : 'unpaid',

        stipendAmount: safeText(
          amt,
          'ไม่ระบุ'
        ),

        location: safeText(
          area,
          'ไม่ระบุสถานที่'
        ),

        deadline,
        deadlineLabel,
        daysLeft,

        status:
          status === 'Open'
            ? 'Open'
            : 'Closed',

        requirements: [],
        benefits: [],

        workHours: safeText(
          workHours,
          'ไม่ระบุเวลาทำงาน'
        ),

        email: safeText(email, ''),

        contactUrl: safeText(link, '#'),

        jobPostUrl: safeText(postLink, ''),

        notes: safeText(
          note,
          'ไม่มีข้อมูลเพิ่มเติม'
        ),
      };
    }
  );

  return { internships };
};