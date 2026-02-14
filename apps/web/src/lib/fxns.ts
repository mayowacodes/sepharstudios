export const onSuccess = <T>(data: T) => ({ status: 'success' as const, data });
export const onError = (message: string) => ({ status: 'error' as const, message, data: null });
