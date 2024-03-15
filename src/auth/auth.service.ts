import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    return null;
  }

  async signup(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if {user} throw new BadRequestException();
    const newUser = await this.userService.create(email, password);
    return;
  }

  async signin(user: any) {
    return;
  }
}
