/**
 * Takes an array of keys and a schema object, and returns a new object whose
 * keys are the elements of the array and whose values are the corresponding
 * values from the schema object.
 *
 * @param arr - The array of keys
 * @param schema - The schema object
 * @returns The new object
 */

export const arrToObjSchema = <TSchema extends object, TArr extends keyof TSchema>(
	arr: TArr[],
	schema: TSchema
) => {
	return Object.fromEntries(arr.map((key) => [key, schema[key]]) || []);
};
