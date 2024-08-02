import { Modules } from 'src/module/menu/entity/module.entity';
import { User } from 'src/module/users';
import { EntityAuditBase } from 'src/util/db';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity({ name: 'groups' })
export class Group extends EntityAuditBase<string> {
  @Column({ nullable: false })
  group_name: string;

  @Column({ nullable: true })
  des: string;

  @ManyToMany(() => Modules, (m) => m.groups)
  @JoinTable({
    name: 'groups_modules',
    joinColumn: { name: 'group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'module_id', referencedColumnName: 'id' },
  })
  modules: Modules[];

  @OneToMany(() => User, (u) => u.group, { nullable: true })
  users: User[];

  constructor(item: Partial<Group>) {
    super();
    Object.assign(this, item);
  }
}
