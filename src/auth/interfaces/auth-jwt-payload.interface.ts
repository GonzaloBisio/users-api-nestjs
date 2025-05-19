/**
 * Interface representing the JWT payload structure used for authentication.
 * This is the shape of the data that will be encoded in the JWT token.
 */
export interface AuthJwtPayload {
  /**
   * Subject (whom the token refers to).
   * Typically contains the user's ID.
   */
  sub: string;
  
  /**
   * Issued at (timestamp in seconds since the Unix Epoch)
   */
  iat?: number;
  
  /**
   * Expiration time (timestamp in seconds since the Unix Epoch)
   */
  exp?: number;
}
