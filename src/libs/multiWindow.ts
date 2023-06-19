export async function getWindowManagementPermissionState(): Promise<string | undefined | PermissionStatus> {
  let state;
  // The new permission name.
  try {
    ({ state } = await navigator.permissions.query({
      // @ts-expect-error
      name: "window-management",
    }));
  } catch (err) {
    if (err instanceof Error && err.name !== "TypeError") {
      return `${err.name}: ${err.message}`;
    }
    // The old permission name.
    try {
      ({ state } = await navigator.permissions.query({
      // @ts-expect-error
        name: "window-placement",
      }));
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "TypeError") {
          return "Window management not supported.";
        }
        return `${err.name}: ${err.message}`;
      }
    }
  }
  return state;
}
