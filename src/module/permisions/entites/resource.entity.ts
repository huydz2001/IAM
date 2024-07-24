import { EntityAuditBase } from 'src/util/db';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Permision } from './permision.entity';

@Entity({ name: 'resources' })
export class Resource extends EntityAuditBase<string> {
  @Column()
  name: string;

  @ManyToOne(() => Permision, (p) => p.resources)
  @JoinColumn({
    name: 'permission_id',
    referencedColumnName: 'id',
  })
  permission: Permision;
}
