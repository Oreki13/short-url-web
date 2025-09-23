export const ActivityType = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    CREATE_SHORT_LINK: "CREATE_SHORT_LINK",
    DELETE_SHORT_LINK: "DELETE_SHORT_LINK",
    UPDATE_SHORT_LINK: "UPDATE_SHORT_LINK",
    CREATE_DOMAIN: "CREATE_DOMAIN",
    UPDATE_DOMAIN: "UPDATE_DOMAIN",
    DELETE_DOMAIN: "DELETE_DOMAIN",
    UPDATE_PROFILE: "UPDATE_PROFILE",
    CHANGE_PASSWORD: "CHANGE_PASSWORD",
    TOKEN_REFRESH: "TOKEN_REFRESH",
    TOKEN_REVOKE: "TOKEN_REVOKE",
    UI_ACTION: "UI_ACTION",
} as const;

export type ActivityTypeValue = typeof ActivityType[keyof typeof ActivityType];

export const ActivityRoleAccess = new Set(["admin", "superadmin"]);

export const normalizeRoleName = (role?: string | null) => (role ?? '').toLowerCase();
