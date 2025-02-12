import axios from "axios";
import { User } from "../models/User";

const userUrl = "http://localhost:8080/api/users/";

export class UserService {
  async addUser(user: User): Promise<User> {
    const response = await axios.post(`${userUrl}add`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  async updateUser(user: User): Promise<User> {
    const response = await axios.patch(`${userUrl}update/${user.id}`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await axios.delete(`${userUrl}delete/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getUserById(id: number): Promise<User> {
    const response = await axios.get(`${userUrl}${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  async getUsers(): Promise<User[]> {
    const response = await axios.get(userUrl, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
    return response.data;
  }

  async getUserByUserName(userName: string): Promise<User> {
    const response = await axios.get(`${userUrl}user-name/${userName}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  async loginUser (email : string, password : string) : Promise<User> {
    const response = await axios.post(`${userUrl}login`, {
      email : email,
      password : password
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  async updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    await axios.patch(`${userUrl}update-password`, {
      userId,
      currentPassword,
      newPassword
    }, {
      headers: { "Content-Type": "application/json" }
    });
  }

}
