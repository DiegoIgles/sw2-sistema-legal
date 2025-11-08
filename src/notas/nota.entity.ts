import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Expediente } from 'src/expedientes/expediente.entity';

@Entity({ name: 'nota' })
export class Nota {
  @PrimaryGeneratedColumn({ name: 'id_nota' })
  id_nota: number;

  @Column({ name: 'contenido', type: 'text' })
  contenido: string;

  // 👇 especifica el tipo SQL para evitar "Object"
  @Column({ name: 'tipo', type: 'varchar', length: 50, nullable: true })
  tipo: string | null;

  @ManyToOne(() => Expediente, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_expediente' })
  expediente: Expediente;

  @CreateDateColumn({ name: 'fecha_registro', type: 'timestamp' })
  fecha_registro: Date;
}
