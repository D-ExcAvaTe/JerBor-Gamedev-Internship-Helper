export function getDeadlineText(deadlineIso: string): string {
  if (!deadlineIso || deadlineIso.trim() === '') {
    return 'ไม่มีกำหนด';
  }

  const deadline = new Date(deadlineIso);
  
  // Handle invalid date
  if (isNaN(deadline.getTime())) {
    return 'ไม่มีกำหนด';
  }

  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'หมดสมัครแล้ว';
  } else if (diffDays === 0) {
    return 'สมัครปิดวันนี้';
  } else if (diffDays === 1) {
    return '1 วันเหลือ';
  } else {
    return `${diffDays} วันเหลือ`;
  }
}
