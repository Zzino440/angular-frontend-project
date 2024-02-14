//object that in the back-end is bound to the Role (every role has a set of permissions)
export enum Permission {
  //user permissions
  USER_READ = "user:read",
  USER_UPDATE = "user:update",
  USER_CREATE = "user:create",
  USER_DELETE = "user:delete",

  //admin permissions
  ADMIN_READ = "admin:read",
  ADMIN_UPDATE = "admin:update",
  ADMIN_CREATE = "admin:create",
  ADMIN_DELETE = "admin:delete"
}
