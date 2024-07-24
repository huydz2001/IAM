import { EntityAuditBase } from 'src/util/db';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'audit_logs' })
export class AuditLog extends EntityAuditBase<string> {
  @Column()
  time_stamp: Date;

  @Column()
  user_id: string;

  @Column()
  action_id: string;

  @Column()
  resource_id: string;

  @Column()
  user_ip: string;

  @Column()
  result: boolean;

  @Column()
  error_message: string;
}
