export function getDeadlineText(deadlineIso: string): string {
  // 1. ดักจับกรณีข้อมูลว่างเปล่า (ไม่มีกำหนด)
  if (!deadlineIso || deadlineIso.trim() === '' || deadlineIso === 'null') {
    return 'ไม่มีกำหนด';
  }

  const deadline = new Date(deadlineIso);
  
  // 2. ดักจับกรณีวันที่แปลงค่าไม่ได้ (Invalid Date)
  if (isNaN(deadline.getTime())) {
    return 'ไม่มีกำหนด';
  }

  const now = new Date();
  // รีเซ็ตเวลาให้เป็นเที่ยงคืนตรง เพื่อให้การคำนวณวันแม่นยำขึ้น
  now.setHours(0, 0, 0, 0);
  const target = new Date(deadline.getTime());
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 3. จัดฟอร์แมตวันที่ให้เป็น DD/MM/YYYY ให้แสดงผลชัดเจน
  const d = String(target.getDate()).padStart(2, '0');
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const y = target.getFullYear();
  const dateStr = `${d}/${m}/${y}`;

  // 4. รีเทิร์นข้อความนับถอยหลัง พร้อมใส่วันที่วงเล็บไว้ด้านหลัง
  if (diffDays < 0) {
    return `หมดรับสมัครแล้ว (${dateStr})`;
  } else if (diffDays === 0) {
    return `ปิดรับวันนี้ (${dateStr})`;
  } else {
    return `เหลือ ${diffDays} วัน (${dateStr})`;
  }
}