export function formatDateUzbekLocale(
  date: Date | string,
  options: {
    showDate?: boolean;
    showMonth?: boolean;
    showYear?: boolean;
    showHour?: boolean;
    showMinute?: boolean;
    showSecond?: boolean;
  } = {
    showDate: true,
    showMonth: true,
    showYear: true,
    showHour: true,
    showMinute: true,
  },
  locale: string = 'uz-UZ',
): string {
  try {
    let dateObj: Date;

    if (typeof date === 'string') {
      dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return "Noto'g'ri sana";
      }
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return "Noto'g'ri sana";
    }

    const intlOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Tashkent',
    };

    if (options.showYear) {
      intlOptions.year = 'numeric';
    }
    if (options.showMonth) {
      intlOptions.month = 'long';
    }
    if (options.showDate) {
      intlOptions.day = 'numeric';
    }
    if (options.showHour) {
      intlOptions.hour = 'numeric';
    }
    if (options.showMinute) {
      intlOptions.minute = '2-digit';
    }
    if (options.showSecond) {
      intlOptions.second = '2-digit';
    }

    const parts = new Intl.DateTimeFormat(locale, intlOptions).formatToParts(
      dateObj,
    );
    let formatted = '';

    parts.forEach((part) => {
      if (part.type === 'month') {
        formatted += part.value.toLowerCase(); // Ensure lowercase month names
      } else if (part.type === 'year') {
        formatted += part.value + '-yil';
      } else if (part.type === 'hour') {
        formatted += part.value + '';
      } else if (part.type === 'minute') {
        formatted += part.value;
      } else if (part.type === 'day') {
        formatted += part.value;
      } else {
        formatted += part.value;
      }
    });

    return formatted.trim();
  } catch (error) {
    return "Noto'g'ri sana";
  }
}
export function extractNumbers(inputString: string): string {
  return inputString.replace(/\D/g, '');
}
