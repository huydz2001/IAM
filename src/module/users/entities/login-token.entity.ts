import { EntityBase } from 'src/util/db/asbtract/entity_base.abstract';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'login_tokens' })
export class LoginToken extends EntityBase<string> {
  @Column({ unique: true })
  user_id: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  ip_adress: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @OneToOne(() => User, (u) => u.loginToken)
  user: User;

  constructor(item: Partial<LoginToken>) {
    super();
    Object.assign(this, item);
  }
}
