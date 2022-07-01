/**
 * Generates an unique ID.
 * @see https://stackoverflow.com/a/8084248
 */
const uniqueId = () => (Math.random() + 1).toString(36).substring(2)

export default uniqueId
