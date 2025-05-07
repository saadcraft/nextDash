export const FormatDate = (dateString: string, locale: string = 'en-US', timeZone: string = 'Africa/Algiers') => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: timeZone
    };

    // Format date with a fixed locale and time zone
    return new Date(dateString).toLocaleDateString(locale, options);
};