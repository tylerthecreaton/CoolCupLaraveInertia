export function isAbsoluteUrl(url) {
    return /^https?:\/\//.test(url);
}

export function has(obj, key) {
    return obj && key in obj;
}

export function hasRole(value, array) {
    return array.indexOf(value) !== -1;
}

export function hasRoles(roles, array) {
    return roles.some((role) => array.includes(role));
}

export function can(permission, permissions) {
    return permissions.includes(permission);
}

export function cannot(permission, permissions) {
    return !can(permission, permissions);
}

/**
 * Checks if any of the given permissions are present in the array.
 * @param {string[]} permissions - The permissions to check for.
 * @param {string[]} array - The array of permissions to check against.
 * @returns {boolean} True if any permission is found, false otherwise.
 */
export function hasPermissions(permissions, array) {
    return permissions.some((permission) => array.includes(permission));
}
