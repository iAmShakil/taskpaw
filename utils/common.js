export const waitForMs = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
