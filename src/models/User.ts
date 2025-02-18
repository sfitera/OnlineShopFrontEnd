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
  userRoles: UserRole[];

  constructor(
    username: string,
    userPassword: string,
    userAddress: string,
    userEmail: string,
    userRoles: UserRole[] = [UserRole.USER], // 🔥 Predvolene priradíme rolu USER
  ) {
    this.username = username
    this.userPassword = userPassword
    this.userAddress = userAddress
    this.userEmail = userEmail
    this.userRoles = userRoles // ✅ Ukladáme zoznam rolí
  }

}
