import { Column, Entity } from 'typeorm';
import { IAuditable } from '../interfaces/audit_table.interface';
import { EntityBase } from './entity_base.abstract';

@Entity()
export abstract class EntityAuditBase<T extends string>
  extends EntityBase<T>
  implements IAuditable
{
  @Column()
  created_at: Date;

  @Column()
  modified_at: Date;

  @Column()
  created_by: string;

  @Column()
  updated_by: string;

  @Column()
  isDeleted: boolean;

  @Column()
  deleted_at: Date;
}
