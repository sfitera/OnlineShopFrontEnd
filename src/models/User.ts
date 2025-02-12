export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}

export class User {
  id?: number
  username: string
  userPassword: string
  userAddress: string
  userEmail: string
  userRole: UserRole

  constructor(
    username: string,
    userPassword: string,
    userAddress: string,
    userEmail: string,
    userRole: UserRole,
  ) {
    this.username = username
    this.userPassword = userPassword
    this.userAddress = userAddress
    this.userEmail = userEmail
    this.userRole = userRole
  }
}
