export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}

export class User {
  id?: number
  userName: string
  userPassword: string
  userAddress: string
  userEmail: string
  userRole: UserRole

  constructor(
    userName: string,
    userPassword: string,
    userAddress: string,
    userEmail: string,
    userRole: UserRole,
  ) {
    this.userName = userName
    this.userPassword = userPassword
    this.userAddress = userAddress
    this.userEmail = userEmail
    this.userRole = userRole
  }
}
