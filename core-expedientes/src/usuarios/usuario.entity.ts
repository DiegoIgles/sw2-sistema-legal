import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity({ name: 'usuario' })
@Unique(['email'])
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id_usuario: number;

  @Column({ name: 'email', length: 150 })
  email: string;

  @Column({ name: 'password_hash', length: 200 })
  password_hash: string;

  @Column({ name: 'rol', length: 50, default: 'OPERADOR' })
  rol: string;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date;
}
