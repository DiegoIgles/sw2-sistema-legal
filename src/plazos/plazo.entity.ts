import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Expediente } from 'src/expedientes/expediente.entity';

@Entity({ name: 'plazo' })
export class Plazo {
  @PrimaryGeneratedColumn({ name: 'id_plazo' })
  id_plazo: number;

  @Column({ name: 'descripcion', length: 200 })
  descripcion: string;

  @Column({ name: 'fecha_vencimiento', type: 'date' })
  fecha_vencimiento: Date;

  @Column({ name: 'cumplido', type: 'boolean', default: false })
  cumplido: boolean;

  // (opcional) cuándo se cumplió realmente
  @Column({ name: 'fecha_cumplimiento', type: 'timestamp', nullable: true })
  fecha_cumplimiento: Date | null;

  @ManyToOne(() => Expediente, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_expediente' })
  expediente: Expediente;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fecha_actualizacion: Date;
}
