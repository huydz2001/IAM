import { EntityAuditBase } from 'src/util/db';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Resource } from './resource.entity';
import { Action } from './action.entity';
import { Role } from 'src/module/roles';

@Entity()
export class Permision extends EntityAuditBase<string> {
  @Column({ type: 'int' })
  effect: number;

  @Column({ type: 'json' })
  condition: JSON;

  @ManyToMany(() => Role, (r) => r.permissions)
  roles: Role[];

  @OneToMany(() => Resource, (r) => r.permission)
  resources: Resource;

  @OneToMany(() => Action, (r) => r.permission)
  actions: Action;

  constructor(item: Partial<Permision>) {
    super();
    Object.assign(this, item);
  }
}
