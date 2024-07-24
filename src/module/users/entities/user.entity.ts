import { Group } from 'src/module/groups/entites/group.entity';
import { EntityAuditBase } from 'src/util/db';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Role } from 'src/module/roles';

@Entity()
export class User extends EntityAuditBase<string> {
  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  hash_pass: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  is_verify_email: boolean;

  @Column()
  ip_address: string;

  @OneToOne(() => Profile, (p) => p.user)
  profile: Profile;

  @JoinColumn({
    name: 'group_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Group, (g) => g.user, { onDelete: 'CASCADE' })
  group: Group;

  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  @ManyToOne(() => Role, (r) => r.users, { onDelete: 'CASCADE' })
  roles: Role[];
}
