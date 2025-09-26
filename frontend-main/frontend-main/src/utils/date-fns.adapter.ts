import { format, parseISO, addDays, differenceInDays, isToday, isYesterday, differenceInMinutes, differenceInHours, differenceInWeeks } from 'date-fns';
// import { toZonedTime } from 'date-fns-tz';

const FORMATOS: Record<string, string> = {
    'DD/MM/YYYY': 'dd/MM/yyyy',
    'YYYY-MM-DD': 'yyyy-MM-dd',
    'DD/MM/YYYY HH:mm': 'dd/MM/yyyy HH:mm',
    'YYYY-MM-DD HH:mm': 'yyyy-MM-dd HH:mm',
    'dddd, DD MMMM YYYY': "EEEE, dd 'de' MMMM yyyy", // Ejemplo largo en español
    'MMMM D, YYYY': 'MMMM d, yyyy', // September 11, 2024
    'D de MMMM de YYYY': "d 'de' MMMM 'de' yyyy", // 11 de septiembre de 2024
    'MMMM d, HH:mm': "MMMM d, HH:mm", // 11 de septiembre, 18:30
};

/**
 * Formatea una fecha en el formato especificado
 * @param date Fecha en Date, string ISO o timestamp
 * @param formato Formato como 'DD/MM/YYYY'
 * @returns Fecha formateada
 */
export const formatDate = (date: Date | string | number, formato: keyof typeof FORMATOS) => {
    if (!date) return ''; // Manejo de valores nulos o undefined

    const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    return format(parsedDate, FORMATOS[formato] || formato);
};

/**
 * Suma días a una fecha
 * @param date Fecha en Date, string ISO o timestamp
 * @param days Número de días a sumar
 * @returns Nueva fecha en formato Date
 */
export const addDaysToDate = (date: Date | string | number, days: number) => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    return addDays(parsedDate, days);
};

/**
 * Calcula la diferencia en días entre dos fechas
 * @param startDate Fecha inicial
 * @param endDate Fecha final
 * @returns Número de días de diferencia
 */
export const diffInDays = (startDate: Date | string | number, endDate: Date | string | number) => {
    return differenceInDays(new Date(endDate), new Date(startDate));
};


export function getDateDiff(fecha: Date | string): string {

    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;

    const ahora = new Date();
    const diffMs = ahora.getTime() - date.getTime();
    const diffMin = diffMs / (1000 * 60);
    const diffHoras = diffMin / 60;

    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${Math.floor(diffMin)} minutes ago`;
    if (diffHoras < 24) return `${Math.floor(diffHoras)} hours ago`;

    if (isToday(date)) return `today at ${format(date, 'HH:mm')}`;
    if (isYesterday(date)) return `yesterday at ${format(date, 'HH:mm')}`;

    const diasDiferencia = Math.floor(diffHoras / 24);
    if (diasDiferencia < 7) return `${diasDiferencia} days ago`;
    if (diasDiferencia < 60) return `${Math.floor(diasDiferencia / 7)} weeks ago`;
    if (diasDiferencia < 365) return `${Math.floor(diasDiferencia / 30)} months ago`;
    if (diasDiferencia < 730) return `${Math.floor(diasDiferencia / 365)} years ago`;

    return `${format(date, 'dd/MM/yyyy')}`;
}

export function getTimeSince(date: Date | string): string {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();

    // ✅ PARCHE: Corrige si el backend guarda fecha UTC pero el frontend interpreta como local
    const correctedDate = new Date(parsedDate.getTime() - 3 * 60 * 60 * 1000); // -3h

    if (correctedDate > now) return 'just now';

    const minutesDiff = differenceInMinutes(now, correctedDate);
    const hoursDiff = differenceInHours(now, correctedDate);
    const daysDiff = differenceInDays(now, correctedDate);
    const weeksDiff = differenceInWeeks(now, correctedDate);

    if (minutesDiff < 1) return 'just now';
    if (minutesDiff < 60) return `${minutesDiff} minute${minutesDiff > 1 ? 's' : ''} ago`;
    if (hoursDiff < 24) return `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
    if (daysDiff < 7) return `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
    return `${weeksDiff} week${weeksDiff > 1 ? 's' : ''} ago`;
}
