import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Expediente } from 'src/expedientes/expediente.entity';

@Entity({ name: 'cliente' })
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'id_cliente' })
  id_cliente: number;

  @Column({ name: 'nombre_completo', length: 200 })
  nombre_completo: string;

  @Column({ name: 'contacto_email', length: 150, nullable: true })
  contacto_email: string;

  @Column({ name: 'contacto_tel', length: 50, nullable: true })
  contacto_tel: string;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date;

  // Relación: un cliente puede tener muchos expedientes
  @OneToMany(() => Expediente, (expediente) => expediente.cliente)
  expedientes: Expediente[];
}
