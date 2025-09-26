export const formatMinutes = (minutes: number): string => {
    if (minutes < 0) return '0m';

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const parts: string[] = [];

    if (hours > 0) parts.push(`${hours}h`);
    if (remainingMinutes > 0 || hours === 0) parts.push(`${remainingMinutes}m`);

    return parts.join(' ');
};

export const formatSeconds = (seconds: number, includeSeconds: boolean = true): string => {
    if (seconds <= 0) return '0s';

    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts: string[] = [];

    if (hours > 0) parts.push(`${hours}h`);
    if (remainingMinutes > 0 || hours > 0) parts.push(`${remainingMinutes}m`);
    
    if (includeSeconds && (remainingSeconds > 0 || (hours === 0 && remainingMinutes === 0))) parts.push(`${remainingSeconds}s`);

    return parts.join(' ');
};
