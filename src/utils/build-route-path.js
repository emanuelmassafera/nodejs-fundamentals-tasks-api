export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParameters = path.replaceAll(routeParametersRegex, '(?<$1>[a-zA-Z0-9\-_]+)')

  const pathRegex = new RegExp(`^${pathWithParameters}(?<query>\\?(.*))?$`)

  return pathRegex
}
