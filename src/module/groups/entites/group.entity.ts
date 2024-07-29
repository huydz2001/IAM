import { Role } from 'src/module/roles';
import { User } from 'src/module/users';
import { EntityAuditBase } from 'src/util/db';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity({ name: 'groups' })
export class Group extends EntityAuditBase<string> {
  @Column({ nullable: false })
  group_name: string;

  @Column({ nullable: true })
  des: string;

  @JoinTable({
    name: 'groups_roles',
    joinColumn: { name: 'group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  @ManyToMany(() => Role, (r) => r.groups, { nullable: true })
  roles: Role[];

  @OneToMany(() => User, (u) => u.group, { nullable: true })
  users: User[];

  constructor(item: Partial<Group>) {
    super();
    Object.assign(this, item);
  }
}
