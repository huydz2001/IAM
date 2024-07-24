import { EntityAuditBase } from 'src/util/db';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile extends EntityAuditBase<string> {
  @Column({ nullable: true })
  user_name: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ type: 'int', nullable: true })
  gender: number;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ nullable: true })
  image: string;

  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @OneToOne(() => User, (u) => u.profile, { onDelete: 'CASCADE' })
  user: User;
}
