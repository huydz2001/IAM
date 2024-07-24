import { EntityAuditBase } from 'src/util/db';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Permision } from './permision.entity';

@Entity({ name: 'actions' })
export class Action extends EntityAuditBase<string> {
  @Column()
  name: string;

  @ManyToOne(() => Permision, (p) => p.actions)
  @JoinColumn({
    name: 'permission_id',
    referencedColumnName: 'id',
  })
  permission: Permision;
}
