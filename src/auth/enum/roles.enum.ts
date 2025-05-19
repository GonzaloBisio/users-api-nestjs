export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
    SUPPORT = 'SUPPORT'
  }
  
  export enum Permission {
    // User permissions
    READ_PROFILE = 'read_profile',
    UPDATE_PROFILE = 'update_profile',
    
    // Article permissions
    READ_ARTICLES = 'read_articles',
    CREATE_ARTICLE = 'create_article',
    UPDATE_ARTICLE = 'update_article',
    DELETE_ARTICLE = 'delete_article',
    
    // Comment permissions
    CREATE_COMMENT = 'create_comment',
    UPDATE_COMMENT = 'update_comment',
    DELETE_COMMENT = 'delete_comment',
    
    // Admin permissions
    MANAGE_USERS = 'manage_users',
    MANAGE_ROLES = 'manage_roles'
  }
  
  export const RolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.USER]: [
      Permission.READ_PROFILE,
      Permission.UPDATE_PROFILE,
      Permission.READ_ARTICLES,
      Permission.CREATE_COMMENT
    ],
    [UserRole.MODERATOR]: [
      Permission.READ_ARTICLES,
      Permission.UPDATE_ARTICLE,
      Permission.DELETE_COMMENT
    ],
    [UserRole.SUPPORT]: [
      Permission.READ_PROFILE,
      Permission.READ_ARTICLES,
      Permission.MANAGE_USERS
    ],
    [UserRole.ADMIN]: Object.values(Permission)
  };