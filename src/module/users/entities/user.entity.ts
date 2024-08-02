import { Group } from 'src/module/groups/entites/group.entity';
import { EntityAuditBase } from 'src/util/db';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { LoginToken } from './login-token.entity';
import { Profile } from './profile.entity';

@Entity({ name: 'users' })
@Index('idx_user_email', ['email'], { unique: true })
@Index('idx_user_phone', ['phone'], { unique: true })
export class User extends EntityAuditBase<string> {
  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ select: false })
  hash_pass: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  is_verify_email: boolean;

  @Column({ nullable: true })
  ip_address: string;

  @OneToOne(() => Profile, (p) => p.user)
  profile: Profile;

  @JoinColumn({
    name: 'group_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Group, (g) => g.users, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  group: Group;

  @JoinColumn({
    name: 'login_token_id',
    referencedColumnName: 'id',
  })
  @OneToOne(() => LoginToken, (t) => t.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  loginToken: LoginToken;

  constructor(item: Partial<User>) {
    super();
    Object.assign(this, item);
  }
}
