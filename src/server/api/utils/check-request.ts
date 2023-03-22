import { throwBadRequestError } from './error/trpc';
/**
 * Check if all conditions are true
 * If not, throw a bad request error
 *
 * @export
 * @param {Array<boolean>} conditions
 */
export function checkRequestParams(conditions: Array<boolean>): void {
  const isAllConditionsTrue = conditions.every(
    (condition) => !!condition === true
  );

  if (!isAllConditionsTrue) {
    throw throwBadRequestError();
  }
}
