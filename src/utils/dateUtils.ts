export function getDeadlineText(deadlineIso: string): string {
  const deadline = new Date(deadlineIso);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Deadline passed';
  } else if (diffDays === 0) {
    return 'Ends today';
  } else if (diffDays === 1) {
    return '1 day left';
  } else {
    return `${diffDays} days left`;
  }
}
