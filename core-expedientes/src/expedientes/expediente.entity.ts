import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from 'src/clientes/cliente.entity';

export enum EstadoExpediente {
  ABIERTO = 'ABIERTO',
  EN_PROCESO = 'EN_PROCESO',
  CERRADO = 'CERRADO',
}

@Entity({ name: 'expediente' })
export class Expediente {
  @PrimaryGeneratedColumn({ name: 'id_expediente' })
  id_expediente: number;

  @Column({ name: 'titulo', length: 200 })
  titulo: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;

  @Column({
    name: 'estado',
    type: 'enum',
    enum: EstadoExpediente,
    default: EstadoExpediente.ABIERTO,
  })
  estado: EstadoExpediente;

  @Column({ name: 'fecha_inicio', type: 'date', nullable: true })
  fecha_inicio: Date;

  @Column({ name: 'fecha_cierre', type: 'date', nullable: true })
  fecha_cierre: Date;

  // FK al cliente (usa la columna id_cliente en la tabla expediente)
  @ManyToOne(() => Cliente, (cliente) => cliente.expedientes, { nullable: false, eager: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fecha_actualizacion: Date;
}
