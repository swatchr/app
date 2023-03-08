export function parseFormData(input: HTMLInputElement) {
  // form input mapping helper component used to return an array of objects for each input value.
  return {
    [input?.name]: input?.value,
  };
}
