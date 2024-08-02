import { TYPE_ACTION } from 'src/constant';
import { Modules } from 'src/module/menu/entity/module.entity';
import { EntityAuditBase } from 'src/util/db';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'permisions' })
export class Permision extends EntityAuditBase<string> {
  @Column({
    type: 'enum',
    enum: TYPE_ACTION,
  })
  type: TYPE_ACTION;

  @Column()
  desc: string;

  @Column({
    name: 'module_id',
    nullable: true,
  })
  moduleId: string;

  @ManyToOne(() => Modules, (m) => m.permisions)
  @JoinColumn({
    name: 'module_id',
    referencedColumnName: 'id',
  })
  module: Modules;

  constructor(item: Partial<Permision>) {
    super();
    Object.assign(this, item);
  }
}
