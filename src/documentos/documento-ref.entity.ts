// src/documentos/documento-ref.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Expediente } from 'src/expedientes/expediente.entity';

@Entity({ name: 'documento_ref' })
export class DocumentoRef {
  @PrimaryGeneratedColumn({ name: 'id_documento_ref' })
  id_documento_ref: number;

  @ManyToOne(() => Expediente, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_expediente' })
  expediente: Expediente;

  // ID que devuelve el storage (GridFS ObjectId, guárdalo como string)
  @Column({ name: 'doc_id_storage', type: 'varchar', length: 64 })
  doc_id_storage: string;

  @Column({ name: 'titulo', type: 'varchar', length: 200, nullable: true })
  titulo: string | null;

  @Column({ name: 'tipo', type: 'varchar', length: 50, nullable: true })
  tipo: string | null; // p.ej. CONTRATO, DEMANDA

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date;
}
