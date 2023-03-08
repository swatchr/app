export const handleServerError = (e: Error | any, msg?: string) => {
  console.error('Something went wrong', e);
  return {
    status: 'error',
    message: msg || 'Something went wrong',
    error: JSON.stringify(e),
  };
};
