import { Group } from 'src/module/groups';
import { Permision } from 'src/module/permisions';
import { User } from 'src/module/users';
import { EntityAuditBase } from 'src/util/db';
import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';

@Entity({ name: 'roles' })
@Index('idx_role_roleName', ['role_name'], { unique: true })
export class Role extends EntityAuditBase<string> {
  @Column({ unique: true })
  role_name: string;

  @Column()
  version: string;

  @ManyToMany(() => Group, (g) => g.roles, { onDelete: 'CASCADE' })
  groups: Group[];

  @JoinTable({
    name: 'roles_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  @ManyToMany(() => Permision, (p) => p.roles, { onDelete: 'CASCADE' })
  permissions: Permision[];

  @ManyToMany(() => User, (u) => u.roles)
  users: User;

  constructor(item: Partial<Role>) {
    super();
    Object.assign(this, item);
  }
}
