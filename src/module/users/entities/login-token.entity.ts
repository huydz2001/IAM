import { EntityBase } from 'src/util/db/asbtract/entity_base.abstract';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'login_tokens' })
@Index('idx_loginToken_uId', ['user_id'], { unique: true })
@Index('idx_loginToken_accessToken', ['access_token'])
@Index('idx_loginToken_refreshToken', ['refresh_token'])
export class LoginToken extends EntityBase<string> {
  @Column({ unique: true })
  user_id: string;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @Column()
  ip_adress: string;

  @Column()
  created_at: Date;

  @Column()
  modified_at: Date;

  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @OneToOne(() => User, (u) => u.loginToken)
  user: User;

  constructor(item: Partial<LoginToken>) {
    super();
    Object.assign(this, item);
  }
}
