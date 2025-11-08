import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Cliente } from 'src/clientes/cliente.entity';

@Entity({ name: 'cliente_credencial' })
@Unique(['email'])
@Unique(['telefono'])
export class ClienteCredencial {
  @PrimaryGeneratedColumn({ name: 'id_cliente_credencial' })
  id_cliente_credencial: number;

  @ManyToOne(() => Cliente, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @Column({ name: 'email', type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ name: 'telefono', type: 'varchar', length: 50, nullable: true })
  telefono: string | null;

  @Column({ name: 'password_hash', type: 'varchar', length: 200 })
  password_hash: string;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date;
}
