export const getCurrentDateTime = (): string => {
  const now = new Date();
  return formatDate(now);
};

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
};

export const formatToISOString = (dateTimeString: string): string => {
  const [datePart, timePart] = dateTimeString.split(', ');
  const [day, month, year] = datePart.split('/');
  const dateString = `${year}-${month}-${day}T${timePart}`;
  return new Date(dateString).toISOString();
};

export const formatFromISOString = (isoString: string): string => {
  const date = new Date(isoString);
  return formatDate(date);
};