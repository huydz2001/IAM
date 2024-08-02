import { EntityAuditBase } from 'src/util/db';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'profiles' })
@Index('idx_profile_userName', ['user_name'], { unique: true })
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

  constructor(item: Partial<Profile>) {
    super();
    Object.assign(this, item);
  }
}
