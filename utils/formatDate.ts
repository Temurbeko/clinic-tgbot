export function formatDateUzbekLocale(
  date: Date | string,
  locale: string = 'uz-UZ',
): string {
  // Default to Uzbek locale
  try {
    let dateObj: Date;

    if (typeof date === 'string') {
      dateObj = new Date(date);
      if (isNaN(dateObj as any)) {
        return "Noto'g'ri sana";
      }
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return "Noto'g'ri sana";
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }; // 'long' for full month name
    const formatted = dateObj.toLocaleDateString(locale, options);
    return formatted.replace(/\//g, '-'); // Replace slashes with hyphens (if needed)
  } catch (error) {
    return "Noto'g'ri sana";
  }
}
